import React, { useReducer, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { auth, db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Provider, Button } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from './styles/global.styles';
import DetailPanel from './components/DetailPanel';
import AddSpotPanel from './components/AddSpotPanel';
import OptionsPanel from './components/OptionsPanel';
import ProfilePanel from './components/ProfilePanel';
import SettingsPanel from './components/SettingsPanel';
import CenterButton from './components/CenterButton';
import * as ImagePicker from 'expo-image-picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from './screens/MapScreen'; // Ekran mapy
import SearchingPanel from './components/SearchingPanel'; // Panel wyszukiwania
import FavoritesPanel from './components/FavoritesPanel'; // Panel ulubionych miejsc
import JourneyPanel from './components/JourneyPanel'; // Historia podróży
import Header from './components/Header';




const Tab = createBottomTabNavigator(); // Tworzymy instancję nawigatora

const requestPermissions = async () => {
    try {
        // Prośba o dostęp do lokalizacji
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        if (locationStatus.status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'We need location permissions to provide this feature.'
            );
            return false;
        }

        console.log("Location permissions granted.");

        // Prośba o dostęp do galerii
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (galleryStatus.status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'We need gallery permissions to upload photos.'
            );
            return false;
        }

        console.log("Gallery permissions granted.");

        return true;
    } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
    }
};


const userIcon = require('./assets/images/traveler.png'); // Dodanie ścieżki do ikony
const savePlaceToFirestore = async (place) => {
    try {
        const placeDoc = doc(collection(db, "places"));
        await setDoc(placeDoc, { ...place, id: placeDoc.id }); // Zapis do Firestore
        return placeDoc.id;
    } catch (error) {
        console.error("Error saving place to Firestore:", error);
        throw error;
    }
};

const getCurrentLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permission Denied",
                "We need location permissions to show your location on the map."
            );
            return null;
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        console.log("Fetched user location:", location.coords); // Dodano logowanie

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error("Error fetching user location:", error);
        return null;
    }
};










const initialState = {
    location: null,
    places: [],
    favorites: [],
    journey: [],
    user: null,
    loading: true,
    selectedPlace: null,
    isDetailPanelVisible: false,
    isAddSpotPanelVisible: false,
    isMenuVisible: false,
    isOptionsPanelVisible: false,
    isProfilePanelVisible: false,
    isSettingsPanelVisible: false,
    isJourneyPanelVisible: false,
    isFavoritesPanelVisible: false, // Sterowanie widocznością FavoritesPanel
    addSpotLocation: null,
    userProfile: { // Właściwość do przechowywania danych profilu użytkownika
        name: 'User Name',
        bio: '',
        distanceTraveled: 0,
        friends: [],
    },
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOCATION':
            return { ...state, location: action.payload };
        case 'SET_PLACES':
            return { ...state, places: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_SELECTED_PLACE':
            return { ...state, selectedPlace: action.payload, isDetailPanelVisible: true };
        case 'CLOSE_DETAIL_PANEL':
            return { ...state, isDetailPanelVisible: false, selectedPlace: null };
        case 'TOGGLE_MENU':
            return { ...state, isMenuVisible: !state.isMenuVisible };
        case 'TOGGLE_OPTIONS_PANEL':
            return { ...state, isOptionsPanelVisible: !state.isOptionsPanelVisible
            };
        case 'SET_PROFILE_PANEL_VISIBLE':
            return { ...state, isProfilePanelVisible: action.payload };

        case 'SET_SETTINGS_PANEL_VISIBLE':
            return { ...state, isSettingsPanelVisible: action.payload };
        case 'TOGGLE_JOURNEY_PANEL':
            return { ...state, isJourneyPanelVisible: action.payload };
        case 'TOGGLE_FAVORITES_PANEL':
            return { ...state, isFavoritesPanelVisible: action.payload };
        case 'SET_ADD_SPOT_PANEL_VISIBLE':
            return {
                ...state,
                isAddSpotPanelVisible: action.payload,
                addSpotLocation: action.payload ? state.addSpotLocation : null,
            };
        case 'ADD_NEW_SPOT':
            return { ...state, places: [...state.places, action.payload] };
        case 'SET_ADD_SPOT_LOCATION':
            return { ...state, addSpotLocation: action.payload };
        case 'TOGGLE_FAVORITE': {
            const isFavorite = state.favorites.some(fav => fav.id === action.payload.id);
            const updatedFavorites = isFavorite
                ? state.favorites.filter(fav => fav.id !== action.payload.id)
                : [...state.favorites, action.payload];

            return { ...state, favorites: updatedFavorites };
        }
        case 'ADD_TO_JOURNEY': {
            const updatedJourney = [...state.journey, action.payload];
            return { ...state, journey: updatedJourney };
        }
        case 'SET_FAVORITES':
            return { ...state, favorites: action.payload };
        case 'SET_JOURNEY':
            return { ...state, journey: action.payload };
        case 'SET_PROFILE_PANEL_VISIBLE':
            return { ...state, isProfilePanelVisible: action.payload };
        case 'SET_SETTINGS_PANEL_VISIBLE':
            return { ...state, isSettingsPanelVisible: action.payload };
        case 'SET_USER_PROFILE':
            return { ...state, userProfile: action.payload };
        case "TOGGLE_REGISTER":
            return { ...state, isRegistering: !state.isRegistering };

        default:
            return state;
    }
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Odległość w metrach
};


const handleVisitButtonClick = (place) => {
    if (!state.location || !place.latitude || !place.longitude) {
        Alert.alert("Error", "Location data is incomplete.");
        return;
    }

    const distance = calculateDistance(
        state.location.latitude,
        state.location.longitude,
        place.latitude,
        place.longitude
    );

    if (distance > 100) {
        Alert.alert("You are not there yet, wanderer!");
        return;
    }

    const alreadyInJourney = state.journey.some((journeyPlace) => journeyPlace.id === place.id);

    if (alreadyInJourney) {
        Alert.alert("Info", "This place is already in your journey history.");
        return;
    }

    const updatedJourney = [...state.journey, place]; // Dodanie miejsca do podróży
    dispatch({ type: "SET_JOURNEY", payload: updatedJourney });

    saveJourneyToFirestore(auth.currentUser.uid, updatedJourney) // Zapis do Firestore
        .then(() => {
            Alert.alert("Success", "Place added to your journey!");
        })
        .catch((error) => {
            console.error("Error saving journey:", error);
            Alert.alert("Error", "Failed to save place to journey.");
        });
};

// Utility functions to save data to Firestore
const saveFavoritesToFirestore = async (favorites) => {
    try {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDoc, { favorites }, { merge: true }); // Scalanie z istniejącymi danymi
    } catch (error) {
        console.error('Error saving favorites:', error);
        Alert.alert('Error', 'Failed to save favorites.');
    }
};


const saveJourneyToFirestore = async (journey) => {
    try {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDoc, { journey }, { merge: true }); // Scalanie z istniejącymi danymi
    } catch (error) {
        console.error('Error saving journey:', error);
        Alert.alert('Error', 'Failed to save journey.');
    }
};

const onToggleFavorite = async (place) => {
    if (!auth.currentUser) {
        Alert.alert("Error", "You must be logged in to manage favorites.");
        return;
    }

    const updatedFavorites = state.favorites.some((fav) => fav.id === place.id)
        ? state.favorites.filter((fav) => fav.id !== place.id)
        : [...state.favorites, place];

    dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });

    try {
        await saveFavoritesToFirestore(updatedFavorites);
    } catch (error) {
        console.error("Error saving favorites:", error);
    }
};


const App = () => {
    // Stany i logika
    const [state, dispatch] = useReducer(reducer, initialState);
    const [email, setEmail] = useState(''); // Stan dla email
    const [password, setPassword] = useState(''); // Stan dla hasła
    const [user, setUser] = useState(null); // Stan użytkownika
    const [loading, setLoading] = useState(true); // Stan ładowania
    const mapViewRef = React.useRef(null); // Referencja do MapView
    const [userLocation, setUserLocation] = useState(null); // Stan dla lokalizacji użytkownika
    const [mapRegion, setMapRegion] = useState(null);
    const [userProfile, setUserProfile] = useState({
        name: 'User Name',
        bio: '',
        distanceTraveled: 0, // Dystans użytkownika
        friends: ['Friend 1', 'Friend 2'],
    });
    const centerMapOnUser = () => {
        if (!state.location) {
            Alert.alert("Error", "User location is not available.");
            return;
        }

        if (mapViewRef.current) {
            const region = {
                ...state.location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            mapViewRef.current.animateToRegion(region, 1000);
        } else {
            Alert.alert("Error", "MapView reference is not set.");
        }
    };



    const fetchFavorites = async () => {
        try {
            const userDoc = doc(db, 'users', state.user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists() && userSnapshot.data().favorites) {
                dispatch({ type: 'SET_FAVORITES', payload: userSnapshot.data().favorites });
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            Alert.alert("Error", "Failed to fetch favorites.");
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const userDoc = doc(db, 'users', userId);
            const userData = await getDoc(userDoc)
            if (userData.exists()) {
                const { favorites = [], journey = [] } = userData.data();
                dispatch({ type: 'SET_FAVORITES', payload: favorites });
                dispatch({ type: 'SET_JOURNEY', payload: journey });
            } else {
                console.log("No user data found. Initializing empty favorites and journey.");
                dispatch({ type: 'SET_FAVORITES', payload: [] });
                dispatch({ type: 'SET_JOURNEY', payload: [] });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to fetch user data.');
        }
    };

    const ensureUserDocumentExists = async (userId) => {
        try {
            const userDoc = doc(db, 'users', userId);
            const userData = await getDoc(userDoc);
            if (!userData.exists()) {
                await setDoc(userDoc, {
                    favorites: [],
                    journey: [],
                    name: 'New User' // Domyślne dane użytkownika
                });
            }
        } catch (error) {
            console.error('Error ensuring user document exists:', error);
        }
    };

    const updatePlaceInState = (updatedPlace) => {
        dispatch({
            type: 'SET_PLACES',
            payload: state.places.map((place) =>
                place.id === updatedPlace.id ? updatedPlace : place
            ),
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            Alert.alert("Login successful!");
            console.log("Logged in user:", userCredential.user);

            // Ustawienie użytkownika w stanie
            dispatch({type: 'SET_USER', payload: userCredential.user});

            // Wyłączenie ekranu ładowania
            dispatch({type: 'SET_LOADING', payload: false});
        } catch (error) {
            console.error("Login error:", error.code, error.message);

            switch (error.code) {
                case "auth/user-not-found":
                    Alert.alert("Login Error", "User not found.");
                    break;
                case "auth/wrong-password":
                    Alert.alert("Login Error", "Incorrect password.");
                    break;
                default:
                    Alert.alert("Login Error", error.message);
                    break;
            }
        }
    };

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Weak Password", "Password must be at least 6 characters.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
            Alert.alert("Registration successful!", "You can now log in.");
            dispatch({type: "TOGGLE_REGISTER"}); // Przełącz na tryb logowania
        } catch (error) {
            console.error("Registration error:", error.code, error.message);

            switch (error.code) {
                case "auth/email-already-in-use":
                    Alert.alert("Registration Error", "Email is already in use.");
                    break;
                case "auth/invalid-email":
                    Alert.alert("Registration Error", "Invalid email format.");
                    break;
                default:
                    Alert.alert("Registration Error", error.message);
                    break;
            }
        }
    };


    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch({ type: 'SET_USER', payload: null }); // Usuń użytkownika ze stanu
            Alert.alert('Successfully logged out');
        } catch (error) {
            Alert.alert("Logout error", error.message);
        }
    };

    const handleProfileOpen = () => {
        dispatch({ type: 'SET_PROFILE_PANEL_VISIBLE', payload: true });
    };

    const handleSettingsOpen = () => {
        dispatch({ type: 'SET_SETTINGS_PANEL_VISIBLE', payload: true });
    };


    const handleSaveUsername = async (newUsername) => {
        if (auth.currentUser) {
            try {
                const userDoc = doc(db, 'users', auth.currentUser.uid);
                await setDoc(userDoc, {name: newUsername}, {merge: true});
                setUserProfile((prev) => ({...prev, name: newUsername}));
                Alert.alert('Success', 'Username updated successfully!');
            } catch (error) {
                Alert.alert('Error', 'Could not update username.');
                console.error(error);
            }
        }
    };

    const fetchPlaces = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "places"));
            const places = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    latitude: parseFloat(data.latitude), // Parsowanie na liczby
                    longitude: parseFloat(data.longitude),
                };
            });


            console.log("Fetched places:", places); // Debug - sprawdź dane
            dispatch({ type: 'SET_PLACES', payload: places });
        } catch (error) {
            console.error("Error fetching places from Firestore:", error);
            Alert.alert("Error", "Failed to fetch places from Firestore.");
        }
    };




    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Monitorowanie sesji użytkownika
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        dispatch({ type: 'SET_USER', payload: user });
                        console.log("User logged in:", user);

                        // Upewnienie się, że dokument użytkownika w Firestore istnieje
                        await ensureUserDocumentExists(user.uid);

                        // Pobranie ulubionych miejsc użytkownika
                        await fetchFavorites(user.uid);

                        // Pobranie historii podróży użytkownika
                        await fetchJourney(user.uid);
                    } else {
                        dispatch({ type: 'SET_USER', payload: null });
                        console.log("No user logged in.");
                    }
                });

                // Prośba o uprawnienia lokalizacji i galerii
                const permissionsGranted = await requestPermissions();
                if (!permissionsGranted) {
                    console.warn("Permissions not granted.");
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }

                // Pobranie lokalizacji użytkownika
                const location = await getCurrentLocation();
                if (location) {
                    console.log("User location fetched:", location);
                    dispatch({ type: 'SET_LOCATION', payload: location });
                    setMapRegion({
                        ...location,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                } else {
                    console.warn("User location not available. Setting default coordinates.");
                    setMapRegion({
                        latitude: 37.4219983, // Domyślne współrzędne (np. Googleplex)
                        longitude: -122.084,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }

                // Pobranie miejsc z Firestore
                await fetchPlaces();

            } catch (error) {
                console.error("Error during initialization:", error);
                Alert.alert("Error", "Failed to initialize the app.");
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        // Funkcja do pobierania ulubionych miejsc
        const fetchFavorites = async (userId) => {
            try {
                const userDoc = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists() && userSnapshot.data().favorites) {
                    dispatch({ type: 'SET_FAVORITES', payload: userSnapshot.data().favorites });
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
                Alert.alert("Error", "Failed to fetch favorites.");
            }
        };

        // Funkcja do pobierania historii podróży
        const fetchJourney = async (userId) => {
            try {
                const userDoc = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userDoc);

                if (userSnapshot.exists() && userSnapshot.data().journey) {
                    dispatch({ type: 'SET_JOURNEY', payload: userSnapshot.data().journey });
                }
            } catch (error) {
                console.error("Error fetching journey:", error);
                Alert.alert("Error", "Failed to fetch journey history.");
            }
        };

        initializeApp();
    }, [dispatch]);







    const onSaveSpot = async (newSpot) => {
        if (!auth.currentUser?.uid) {
            Alert.alert('Error', 'You must be logged in to save a spot.');
            return;
        }

        try {
            const spotDoc = doc(collection(db, 'places'));
            const savedSpot = {
                ...newSpot,
                id: spotDoc.id,
                authorId: auth.currentUser.uid, // Dodanie ID autora
            };
            await setDoc(spotDoc, savedSpot);

            dispatch({
                type: 'SET_PLACES',
                payload: [...state.places.filter(place => place.id !== savedSpot.id), savedSpot],
            });
        } catch (error) {
            console.error('Error saving new spot:', error);
            Alert.alert('Error', 'Failed to save the spot. Please try again.');
        }
    };


    const toggleFavorite = async (place) => {
        try {
            const userDocRef = doc(db, 'users', state.user.uid);
            const userDoc = await getDoc(userDocRef);

            let updatedFavorites = [];
            if (userDoc.exists()) {
                const currentFavorites = userDoc.data().favorites || [];
                const isFavorite = currentFavorites.some((fav) => fav.id === place.id);

                if (isFavorite) {
                    // Remove from favorites
                    updatedFavorites = currentFavorites.filter((fav) => fav.id !== place.id);
                } else {
                    // Add to favorites
                    updatedFavorites = [...currentFavorites, place];
                }
            } else {
                // First favorite if no data exists
                updatedFavorites = [place];
            }

            // Update Firestore and state
            await setDoc(userDocRef, { favorites: updatedFavorites }, { merge: true });
            dispatch({ type: 'SET_FAVORITES', payload: updatedFavorites });
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Could not update favorites.');
        }
    };




    const onAddToJourney = async (place) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to manage your journey.");
            return;
        }

        if (state.journey.some((journeyPlace) => journeyPlace.id === place.id)) {
            Alert.alert("Info", "This place is already in your journey.");
            return;
        }

        const updatedJourney = [...state.journey, place];
        dispatch({ type: 'SET_JOURNEY', payload: updatedJourney });

        try {
            await saveJourneyToFirestore(updatedJourney);
        } catch (error) {
            console.error("Error saving journey:", error);
        }
    };



    const openDetailPanel = (place) => {
        if (!place || !place.id) {
            console.error("Invalid place object:", place);
            Alert.alert("Error", "Invalid place data.");
            return;
        }

        dispatch({ type: 'SET_SELECTED_PLACE', payload: place }); // Ustaw wybrane miejsce w stanie aplikacji
    };


    const onRemoveFromJourney = (placeId) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to modify your journey history.");
            return;
        }

        const updatedJourney = state.journey.filter((journeyPlace) => journeyPlace.id !== placeId);
        dispatch({type: "SET_JOURNEY", payload: updatedJourney});

        saveJourneyToFirestore(auth.currentUser.uid, updatedJourney)
            .then(() => {
                Alert.alert("Success", "Place removed from your journey history!");
            })
            .catch((error) => {
                console.error("Error removing journey:", error);
                Alert.alert("Error", "Failed to remove place from journey.");
            });
    };


    if (state.loading) {
        console.log("Loading state active. Rendering loader.");
        return (
            <View style={globalStyles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }



    if (!state.user) {
        // Jeśli użytkownik nie jest zalogowany, wyświetlamy ekran logowania/rejestracji
        return (
            <SafeAreaView style={globalStyles.container}>
                <Text style={globalStyles.title}>
                    {state.isRegistering ? "Register" : "Login"}
                </Text>

                <TextInput
                    style={globalStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text.trim())}
                />
                <TextInput
                    style={globalStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={globalStyles.button}
                    onPress={state.isRegistering ? handleRegister : handleLogin}
                >
                    <Text style={globalStyles.buttonText}>
                        {state.isRegistering ? "Register" : "Login"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        dispatch({type: "TOGGLE_REGISTER"}) // Przełącz tryb
                    }
                    style={globalStyles.switchButton}
                >
                    <Text style={globalStyles.switchText}>
                        {state.isRegistering
                            ? "Already have an account? Login"
                            : "Don't have an account? Register"}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }


    const handleMarkerClick = (place) => {
        console.log("Marker clicked:", place);
        if (!place.id || !place.name) {
            console.error("Marker is missing required properties:", place);
            Alert.alert("Error", "Marker data is incomplete.");
            return;
        }

        dispatch({ type: 'SET_SELECTED_PLACE', payload: place });
    };





    const handleLongPress = (event) => {
        const {coordinate} = event.nativeEvent;
        dispatch({type: 'SET_ADD_SPOT_LOCATION', payload: coordinate});
        dispatch({type: 'SET_ADD_SPOT_PANEL_VISIBLE', payload: true});
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName;

                            switch (route.name) {
                                case 'Map':
                                    iconName = 'map';
                                    break;
                                case 'Search':
                                    iconName = 'magnify';
                                    break;
                                case 'Favorites':
                                    iconName = 'heart';
                                    break;
                                case 'Journey':
                                    iconName = 'map-marker-path';
                                    break;
                                default:
                                    iconName = 'circle';
                            }

                            return (
                                <MaterialCommunityIcons
                                    name={iconName}
                                    color={color}
                                    size={size}
                                />
                            );
                        },
                        tabBarActiveTintColor: '#44e830',
                        tabBarInactiveTintColor: '#ffffff',
                        headerShown: false,
                        tabBarStyle: {
                            backgroundColor: '#33673c',
                            height: 60,
                        },
                    })}
                >
                    <Tab.Screen name="Map">
                        {() => (
                            <MapScreen
                                mapRegion={mapRegion}
                                userLocation={state.location}
                                state={state}
                                mapViewRef={mapViewRef}
                                dispatch={dispatch} // Przekazywanie dispatch jako prop
                                handleLongPress={handleLongPress}
                                centerMapOnUser={centerMapOnUser}
                                handleMarkerClick={handleMarkerClick} // Przekazywanie handleMarkerClick
                            />
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Search" component={SearchingPanel} />
                    <Tab.Screen name="Favorites" component={FavoritesPanel} />
                    <Tab.Screen name="Journey" component={JourneyPanel} />
                </Tab.Navigator>


                {/* Dodatkowe panele poza zakładkami */}
                {state.isOptionsPanelVisible && (
                    <OptionsPanel
                        onClose={handleOptionsPanelClose}
                        onProfile={handleProfileOpen}
                        onSettings={handleSettingsOpen}
                        onLogout={handleLogout}
                    />
                )}


                {state.isProfilePanelVisible && (
                    <ProfilePanel
                        onClose={() => dispatch({type: 'SET_PROFILE_PANEL_VISIBLE', payload: false})}
                        userProfile={userProfile}
                    />
                )}

                {state.isSettingsPanelVisible && (
                    <SettingsPanel
                        onClose={() => dispatch({type: 'SET_SETTINGS_PANEL_VISIBLE', payload: false})}
                        onSaveUsername={handleSaveUsername}
                        currentUsername={userProfile.name}
                    />
                )}

                {state.isAddSpotPanelVisible && (
                    <AddSpotPanel
                        onClose={() => dispatch({type: 'SET_ADD_SPOT_PANEL_VISIBLE', payload: false})}
                        onSaveSpot={onSaveSpot}
                        userLocation={state.location}
                        selectedLocation={state.addSpotLocation}
                    />
                )}

                {state.isDetailPanelVisible && state.selectedPlace && (
                    <DetailPanel
                        place={state.selectedPlace}
                        isFavorite={state.favorites.some((fav) => fav.id === state.selectedPlace?.id)}
                        onToggleFavorite={toggleFavorite} // Pass the toggleFavorite function
                        onClose={() => dispatch({ type: 'CLOSE_DETAIL_PANEL' })}
                        onAddToJourney={onAddToJourney}
                        journey={state.journey}
                    />
                )}


                {state.isJourneyPanelVisible && (
                    <JourneyPanel
                        journey={state.journey}
                        places={state.places}
                        onAddToJourney={onAddToJourney}
                        onRemoveFromJourney={onRemoveFromJourney}
                        openDetailPanel={openDetailPanel} // Dodanie funkcji do propsów
                        onClose={() => dispatch({ type: 'TOGGLE_JOURNEY_PANEL', payload: false })}
                    />
                )}

                {state.isFavoritesPanelVisible && (
                    <FavoritesPanel
                        favorites={state.favorites}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => dispatch({ type: 'TOGGLE_FAVORITES_PANEL', payload: false })}
                    />
                )}


            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

    export default App;