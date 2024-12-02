import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDh-lQcYVepHUp9XvD7f8ai_DlrTq-I4Po",
  authDomain: "projekt-6309f.firebaseapp.com",
  projectId: "projekt-6309f",
  storageBucket: "projekt-6309f.appspot.com",
  messagingSenderId: "799926973197",
  appId: "1:799926973197:web:0faf817a7322c6bbaa7644",
};

// Inicjalizacja Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicjalizacja Firestore
const db = getFirestore(app);

// Inicjalizacja Auth z `AsyncStorage` dla przechowywania sesji użytkownika
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Pomocnicza funkcja do sprawdzania błędów
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error.message || error);
  throw error;
};

/**
 * Funkcje pomocnicze Firestore
 */

// Inicjalizowanie użytkownika w Firestore
const initializeUserInFirestore = async (uid, username = "New User") => {
  if (!uid) throw new Error("User ID is required to initialize user.");
  try {
    const userDoc = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await setDoc(userDoc, {
        username,
        visitedPlaces: [],
        favorites: [],
        addedMarkers: [],
        friendRequests: [],
        friends: [],
      });
    }
  } catch (error) {
    handleError(error, "initializeUserInFirestore");
  }
};

// Pobieranie danych użytkownika
const loadUserData = async (uid) => {
  if (!uid) throw new Error("User ID is required to load user data.");
  try {
    const userDoc = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.warn("User not found.");
      return null;
    }
  } catch (error) {
    handleError(error, "loadUserData");
  }
};

// Dodanie miejsca do odwiedzonych
const addToVisitedPlaces = async (uid, place) => {
  if (!uid || !place?.id || !place?.name) {
    throw new Error("Invalid arguments for addToVisitedPlaces.");
  }
  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      visitedPlaces: arrayUnion(place),
    });
  } catch (error) {
    handleError(error, "addToVisitedPlaces");
  }
};

// Zapisywanie miejsca w Firestore
const savePlaceToFirestore = async (place) => {
  if (!place?.name || !place?.latitude || !place?.longitude) {
    throw new Error("Invalid place object. Ensure it contains name, latitude, and longitude.");
  }
  try {
    const placeDoc = doc(collection(db, "places")); // Automatyczne ID
    await setDoc(placeDoc, { ...place, id: placeDoc.id });
    return placeDoc.id;
  } catch (error) {
    handleError(error, "savePlaceToFirestore");
  }
};

// Dodanie do ulubionych
const addToFavorites = async (uid, place) => {
  if (!uid || !place) {
    throw new Error("Invalid arguments for addToFavorites.");
  }
  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      favorites: arrayUnion(place),
    });
  } catch (error) {
    handleError(error, "addToFavorites");
  }
};

// Dodanie znacznika do użytkownika
const addMarkerToUser = async (uid, marker) => {
  if (!uid || !marker) {
    throw new Error("Invalid arguments for addMarkerToUser.");
  }
  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      addedMarkers: arrayUnion(marker),
    });
  } catch (error) {
    handleError(error, "addMarkerToUser");
  }
};

// Wyszukiwanie użytkownika po nazwie
const searchUserByUsername = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    handleError(error, "searchUserByUsername");
  }
};

// Wysyłanie zaproszenia do znajomych
const sendFriendRequest = async (fromUid, toUid) => {
  if (!fromUid || !toUid) {
    throw new Error("Invalid arguments for sendFriendRequest.");
  }
  try {
    const toUserDoc = doc(db, "users", toUid);
    await updateDoc(toUserDoc, {
      friendRequests: arrayUnion(fromUid),
    });
  } catch (error) {
    handleError(error, "sendFriendRequest");
  }
};

// Akceptowanie zaproszenia do znajomych
const acceptFriendRequest = async (currentUid, friendUid) => {
  if (!currentUid || !friendUid) {
    throw new Error("Invalid arguments for acceptFriendRequest.");
  }
  try {
    const currentUserDoc = doc(db, "users", currentUid);
    const friendUserDoc = doc(db, "users", friendUid);

    await updateDoc(currentUserDoc, {
      friends: arrayUnion(friendUid),
      friendRequests: arrayRemove(friendUid),
    });

    await updateDoc(friendUserDoc, {
      friends: arrayUnion(currentUid),
    });
  } catch (error) {
    handleError(error, "acceptFriendRequest");
  }
};

// Eksport modułów i funkcji
export {
  db,
  auth,
  initializeUserInFirestore,
  loadUserData,
  addToVisitedPlaces,
  savePlaceToFirestore,
  addToFavorites,
  addMarkerToUser,
  searchUserByUsername,
  sendFriendRequest,
  acceptFriendRequest,
};
