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

// Inicjalizacja Firebase App (sprawdzamy, czy już istnieje)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicjalizacja Firestore
const db = getFirestore(app);

// Inicjalizacja Firebase Auth z `AsyncStorage` dla zachowania sesji
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Helper functions for Firestore
 */

// Tworzy nowy dokument użytkownika lub aktualizuje istniejący
const initializeUserInFirestore = async (uid, username = "New User") => {
  if (!uid) throw new Error("User ID is required to initialize user.");

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
};

// Funkcja do pobierania danych użytkownika
const loadUserData = async (uid) => {
  if (!uid) throw new Error("User ID is required to load user data.");

  try {
    const userDoc = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data(); // Zwraca dane użytkownika
    } else {
      console.warn("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    throw error;
  }
};

// Dodanie miejsca do historii odwiedzonych miejsc
const addToVisitedPlaces = async (uid, place) => {
  if (!uid) throw new Error("User ID is required to add visited place.");

  if (!place || !place.id || !place.name) {
    console.warn("Invalid place object:", place);
    throw new Error("Invalid place object. Ensure it contains an ID and name.");
  }

  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      visitedPlaces: arrayUnion({
        id: place.id,
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
      }),
    });
  } catch (error) {
    console.error("Error adding to visited places:", error);
    throw error;
  }
};

const savePlaceToFirestore = async (place) => {
  if (!place.name || !place.latitude || !place.longitude) {
    throw new Error("Invalid place object. Ensure it contains a name, latitude, and longitude.");
  }

  try {
    const placeDoc = doc(collection(db, "places")); // Tworzy nowe miejsce z automatycznym ID
    await setDoc(placeDoc, { ...place, id: placeDoc.id }); // Dodaje ID miejsca
    return placeDoc.id; // Zwracamy ID miejsca
  } catch (error) {
    console.error("Error saving place to Firestore:", error);
    throw error;
  }
};


// Dodanie miejsca do ulubionych
const addToFavorites = async (uid, place) => {
  if (!uid) throw new Error("User ID is required to add favorite.");

  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      favorites: arrayUnion(place),
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Dodanie znacznika do listy dodanych przez użytkownika
const addMarkerToUser = async (uid, marker) => {
  if (!uid) throw new Error("User ID is required to add marker.");

  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      addedMarkers: arrayUnion(marker),
    });
  } catch (error) {
    console.error("Error adding marker to user:", error);
    throw error;
  }
};

// Wyszukaj użytkownika po nazwie użytkownika
const searchUserByUsername = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data(); // Pobierz dane użytkownika
      user.id = querySnapshot.docs[0].id; // Dodaj ID użytkownika
      return user;
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
};

// Wysyłanie zaproszenia do znajomych
const sendFriendRequest = async (fromUid, toUid) => {
  try {
    const toUserDoc = doc(db, "users", toUid);
    await updateDoc(toUserDoc, {
      friendRequests: arrayUnion(fromUid), // Dodaj ID nadawcy do zaproszeń
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

// Akceptowanie zaproszenia do znajomych
const acceptFriendRequest = async (currentUid, friendUid) => {
  try {
    const currentUserDoc = doc(db, "users", currentUid);
    const friendUserDoc = doc(db, "users", friendUid);

    // Dodaj ID do listy znajomych obu użytkowników
    await updateDoc(currentUserDoc, {
      friends: arrayUnion(friendUid),
      friendRequests: arrayRemove(friendUid), // Usuń zaproszenie
    });

    await updateDoc(friendUserDoc, {
      friends: arrayUnion(currentUid),
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

/**
 * Eksport instancji Firestore, Auth i funkcji pomocniczych
 */
export {
  db,
  auth,
  initializeUserInFirestore,
  loadUserData,
  addToVisitedPlaces,
  addToFavorites,
  addMarkerToUser,
  searchUserByUsername,
  sendFriendRequest,
  acceptFriendRequest,
};
