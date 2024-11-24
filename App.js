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
import SearchingPanel from './components/SearchingPanel';
import AddSpotPanel from './components/AddSpotPanel';
import FavoritesPanel from './components/FavoritesPanel';
import JourneyPanel from './components/JourneyPanel';
import OptionsPanel from './components/OptionsPanel';
import ProfilePanel from './components/ProfilePanel';
import SettingsPanel from './components/SettingsPanel';
import haversine from 'haversine-distance'; // Pamiętaj, aby zainstalować tę bibliotekę: npm install haversine-distance
import CenterButton from './components/CenterButton';
import * as ImagePicker from 'expo-image-picker';

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


const userIcon = require('./assets/images/travel.png'); // Dodanie ścieżki do ikony
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
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        console.log("Fetched user location:", location);

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error("Error fetching user location:", error);
        Alert.alert("Error", "Unable to fetch your current location.");
        return null; // Zwraca null w przypadku błędu
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
    isSearchPanelVisible: false,
    isAddSpotPanelVisible: false,
    isFavoritesPanelVisible: false,
    isJourneyPanelVisible: false,
    isMenuVisible: false,
    isOptionsPanelVisible: false,
    isProfilePanelVisible: false,
    isSettingsPanelVisible: false,
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
            return { ...state, isOptionsPanelVisible: !state.isOptionsPanelVisible };
        case 'SET_SEARCH_PANEL_VISIBLE':
            return { ...state, isSearchPanelVisible: action.payload };
        case 'SET_ADD_SPOT_PANEL_VISIBLE':
            return {
                ...state,
                isAddSpotPanelVisible: action.payload,
                addSpotLocation: action.payload ? state.addSpotLocation : null,
            };
        case 'SET_FAVORITES_PANEL_VISIBLE':
            return { ...state, isFavoritesPanelVisible: action.payload };
        case 'SET_JOURNEY_PANEL_VISIBLE':
            return { ...state, isJourneyPanelVisible: action.payload };
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


const calculateMapRegion = (userLocation, places) => {
    if (!userLocation && places.length === 0) return null;

    let minLat = userLocation?.latitude || places[0].latitude;
    let maxLat = userLocation?.latitude || places[0].latitude;
    let minLng = userLocation?.longitude || places[0].longitude;
    let maxLng = userLocation?.longitude || places[0].longitude;

    places.forEach((place) => {
        minLat = Math.min(minLat, place.latitude);
        maxLat = Math.max(maxLat, place.latitude);
        minLng = Math.min(minLng, place.longitude);
        maxLng = Math.max(maxLng, place.longitude);
    });

    const latitudeDelta = maxLat - minLat + 0.01; // Dodajemy niewielki margines
    const longitudeDelta = maxLng - minLng + 0.01;

    return {
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLng + minLng) / 2,
        latitudeDelta,
        longitudeDelta,
    };
};

const customMapStyle = [
    {
        featureType: "poi",
        stylers: [
            { visibility: "off" }
        ]
    }
];

// Utility functions to save data to Firestore
const saveFavoritesToFirestore = async (userId, favorites) => {
    try {
        // Filtruj dane przed zapisaniem
        const validFavorites = favorites.filter(fav => fav.id && fav.name);
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, { favorites: validFavorites }, { merge: true });
    } catch (error) {
        console.error('Error saving favorites to Firestore:', error);
        throw error;
    }
};


const saveJourneyToFirestore = async (userId, journey) => {
    try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, { journey }, { merge: true });
    } catch (error) {
        console.error('Error saving journey to Firestore:', error);
        throw error;
    }
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [email, setEmail] = useState(''); // Stan dla email
    const [password, setPassword] = useState(''); // Stan dla hasła
    const [user, setUser] = useState(null); // Stan użytkownika
    const [loading, setLoading] = useState(true); // Stan ładowania
    const mapViewRef = React.useRef(null); // Referencja do MapView
    const [userLocation, setUserLocation] = useState(null); // Stan do przechowywania lokalizacji użytkownika
    const [mapRegion, setMapRegion] = useState(null);
    const [userProfile, setUserProfile] = useState({
        name: 'User Name',
        bio: '',
        distanceTraveled: 0, // Dodanie dystansu do profilu użytkownika
        friends: ['Friend 1', 'Friend 2'],
    });
    const centerMapOnUser = () => {
        if (mapViewRef.current && state.location) {
            const region = {
                latitude: state.location.coords.latitude,
                longitude: state.location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            mapViewRef.current.animateToRegion(region, 1000); // Animacja w czasie 1 sekundy
        } else {
            Alert.alert('Location Error', 'User location is not available.');
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
            dispatch({ type: 'SET_USER', payload: userCredential.user });

            // Wyłączenie ekranu ładowania
            dispatch({ type: 'SET_LOADING', payload: false });
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
            dispatch({ type: "TOGGLE_REGISTER" }); // Przełącz na tryb logowania
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
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'TOGGLE_OPTIONS_PANEL' });
            Alert.alert('Successfully logged out');
        } catch (error) {
            Alert.alert("Logout error", error.message);
        }
    };

    const openProfile = () => {
        dispatch({ type: 'TOGGLE_OPTIONS_PANEL' });
        dispatch({ type: 'SET_PROFILE_PANEL_VISIBLE', payload: true });
    };

    const openSettings = () => {
        dispatch({ type: 'TOGGLE_OPTIONS_PANEL' });
        dispatch({ type: 'SET_SETTINGS_PANEL_VISIBLE', payload: true });
    };

    const loadUserData = async (userId) => {
        try {
            const userDoc = doc(db, 'users', userId);
            const userData = await getDoc(userDoc);
            if (userData.exists()) {
                const data = userData.data();
                dispatch({ type: 'SET_FAVORITES', payload: data.favorites || [] });
                dispatch({ type: 'SET_JOURNEY', payload: data.journey || [] });
                return data; // Zwracamy dane użytkownika
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
        return null;
    };





    const handleSaveUsername = async (newUsername) => {
        if (auth.currentUser) {
            try {
                const userDoc = doc(db, 'users', auth.currentUser.uid);
                await setDoc(userDoc, { name: newUsername }, { merge: true });
                setUserProfile((prev) => ({ ...prev, name: newUsername }));
                Alert.alert('Success', 'Username updated successfully!');
            } catch (error) {
                Alert.alert('Error', 'Could not update username.');
                console.error(error);
            }
        }
    };


    const fetchLocationAndData = async () => {
        try {
            console.log("Requesting location permissions...");
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.warn("Location permissions not granted.");
                Alert.alert(
                    'Permission Denied',
                    'We need location permissions to show your location on the map.'
                );
                return null;
            }

            console.log("Permissions granted. Fetching location...");
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            console.log("Fetched user location:", location.coords);
            return location.coords; // Zwracamy tylko współrzędne
        } catch (error) {
            console.error("Error fetching user location:", error);
            Alert.alert('Error', 'Unable to fetch your current location.');
            return null;
        }
    };



    const fetchPlaces = async (dispatch) => {
        try {
            // Pobierz kolekcję miejsc z Firestore
            const querySnapshot = await getDocs(collection(db, "places"));
            const places = querySnapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id, // ID miejsca
                    name: data.name || "Unknown", // Domyślna nazwa, jeśli brak
                    latitude: data.latitude || null, // Współrzędne miejsca
                    longitude: data.longitude || null,
                };
            });

            console.log('Fetched places:', places);

            // Wyślij dane do reduktora
            dispatch({ type: "SET_PLACES", payload: places });

            return places; // Opcjonalnie zwróć miejsca, jeśli trzeba ich użyć
        } catch (error) {
            console.error("Error fetching places:", error);
            Alert.alert('Error', 'Unable to fetch places.');
            return []; // Zwróć pustą tablicę w przypadku błędu
        }
    };




    let locationSubscription = null;

    const startTrackingDistance = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission to access location was denied");
            return;
        }

        // Uzyskanie pozwolenia na działanie w tle
        await Location.requestBackgroundPermissionsAsync();

        let lastPosition = null;

        locationSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 1000, // Śledzenie co sekundę
                distanceInterval: 1, // Aktualizacja co 1 metr
            },
            (location) => {
                if (lastPosition) {
                    const distance = haversine(lastPosition.coords, location.coords);
                    setUserProfile((prevProfile) => ({
                        ...prevProfile,
                        distanceTraveled: prevProfile.distanceTraveled + distance,
                    }));
                }
                lastPosition = location;
            }
        );
    };

    const stopTrackingDistance = () => {
        if (locationSubscription) {
            locationSubscription.remove();
            locationSubscription = null;
            saveDistanceToFirebase(); // Zapisanie dystansu po zakończeniu śledzenia
        }
    };
    const saveDistanceToFirebase = async () => {
        if (auth.currentUser) {
            const userDoc = doc(db, "users", auth.currentUser.uid);
            await setDoc(userDoc, { distanceTraveled: userProfile.distanceTraveled }, { merge: true });
        }
    };


    useEffect(() => {
        const checkPermissions = async () => {
            try {
                console.log("Checking permissions...");
                const permissionsGranted = await requestPermissions();
                if (!permissionsGranted) {
                    console.warn("Permissions not granted. Some features may not work.");
                } else {
                    console.log("All permissions granted.");
                }
            } catch (error) {
                console.error("Error checking permissions:", error);
            }
        };

        checkPermissions();
    }, []); // Sprawdzanie uprawnień tylko raz przy montowaniu komponentu
    useEffect(() => {
        const initializeLocation = async () => {
            const location = await getCurrentLocation();
            if (location) {
                console.log("Setting user location:", location);
                setUserLocation(location); // Ustawienie tylko jeśli dane są poprawne
            } else {
                console.warn("User location is null");
            }
        };

        initializeLocation();
    }, []);



    useEffect(() => {
        let isMounted = true; // Flaga zapobiegająca wyciekom pamięci

        const initializeApp = async () => {
            try {
                console.log("Initializing app...");

                // Pobranie lokalizacji użytkownika
                const locationData = await fetchLocationAndData();
                if (isMounted && locationData) {
                    console.log("Location fetched:", locationData);
                    setUserLocation(locationData); // Ustawienie lokalnej lokalizacji
                    setMapRegion({
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                } else {
                    console.warn("No location data fetched.");
                }

                // Pobranie miejsc
                const places = await fetchPlaces(dispatch);
                if (isMounted && places.length > 0) {
                    console.log("Places fetched successfully:", places);
                } else {
                    console.warn("No places found.");
                }
            } catch (error) {
                console.error("Error during initialization:", error);
            } finally {
                if (isMounted) {
                    dispatch({ type: 'SET_LOADING', payload: false }); // Koniec ładowania
                }
            }
        };

        initializeApp();

        return () => {
            isMounted = false; // Zapobiegaj wyciekom pamięci
            console.log("Cleanup complete.");
        };
    }, []);




    const onSelectPlace = (place) => {
        dispatch({ type: 'SET_SELECTED_PLACE', payload: place });
        dispatch({ type: 'SET_SEARCH_PANEL_VISIBLE', payload: false });
    };

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






    const toggleFavorite = (place) => {
        if (!state.user?.uid) return;
        if (!place || !place.id || !place.name) {
            console.error("Invalid place object:", place);
            Alert.alert("Error", "Place data is incomplete.");
            return;
        }
        dispatch({ type: 'TOGGLE_FAVORITE', payload: place });
    };

    const onAddToJourney = (place) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to save a place to your journey.");
            return;
        }

        // Sprawdzenie, czy miejsce jest już w journey
        const alreadyInJourney = state.journey.some((journeyPlace) => journeyPlace.id === place.id);

        if (alreadyInJourney) {
            Alert.alert("Info", "This place is already in your journey history.");
            return;
        }

        const updatedJourney = [...state.journey, place]; // Dodanie nowego miejsca
        dispatch({ type: "SET_JOURNEY", payload: updatedJourney }); // Aktualizacja stanu journey

        saveJourneyToFirestore(auth.currentUser.uid, updatedJourney) // Zapis do Firestore
            .then(() => {
                console.log("Journey updated successfully in Firestore.");
            })
            .catch((error) => {
                console.error("Error saving journey:", error);
                Alert.alert("Error", "Failed to save place to journey.");
            });
    };



    const markPlaceAsVisited = async (place) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to mark a place as visited.");
            return;
        }

        try {
            const updatedJourney = [...state.journey, { ...place, visitedAt: new Date().toISOString() }];
            dispatch({ type: "SET_JOURNEY", payload: updatedJourney });

            await saveJourneyToFirestore(auth.currentUser.uid, updatedJourney);

            Alert.alert("Success", "Place marked as visited!");
        } catch (error) {
            console.error("Error marking place as visited:", error);
            Alert.alert("Error", "Failed to mark the place as visited.");
        }
    };


    const onRemoveFromJourney = (placeId) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to modify your journey history.");
            return;
        }

        const updatedJourney = state.journey.filter((journeyPlace) => journeyPlace.id !== placeId);
        dispatch({ type: "SET_JOURNEY", payload: updatedJourney });

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
                        dispatch({ type: "TOGGLE_REGISTER" }) // Przełącz tryb
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
        if (!place.id || !place.name) {
            console.error("Marker is missing required properties:", place);
            Alert.alert("Error", "Marker data is incomplete.");
            return;
        }

        dispatch({ type: 'SET_SELECTED_PLACE', payload: place });
    };


    const handleLongPress = (event) => {
        const { coordinate } = event.nativeEvent;
        dispatch({ type: 'SET_ADD_SPOT_LOCATION', payload: coordinate });
        dispatch({ type: 'SET_ADD_SPOT_PANEL_VISIBLE', payload: true });
    };

    return (
        <GestureHandlerRootView style={globalStyles.container}>
            <Provider>
                <SafeAreaView style={globalStyles.container}>

                    {/* Logo Button */}
                    <TouchableOpacity
                        style={globalStyles.logoContainer}
                        onPress={() => dispatch({ type: 'TOGGLE_OPTIONS_PANEL' })}
                    >
                        <Image
                            source={require('./assets/images/logo_wanders.jpg')}
                            style={globalStyles.logo}
                        />
                    </TouchableOpacity>

                    <MapView
                        style={globalStyles.map}
                        region={mapRegion}
                        customMapStyle={customMapStyle}
                        onLongPress={handleLongPress}
                    >
                        {/* Marker dla bieżącej lokalizacji użytkownika */}
                        {userLocation ? (
                            <Marker
                                coordinate={{
                                    latitude: userLocation.latitude,
                                    longitude: userLocation.longitude,
                                }}
                                title="Your Location"
                                description="Your current location"
                            >
                                <Image
                                    source={userIcon} // Przekazanie wcześniej załadowanej ikony
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                />
                            </Marker>

                        ) : (
                            console.log('User location not available:', userLocation)
                        )}

                        {/* Pozostałe znaczniki */}
                        {state.places.map((place, index) => (
                            place.latitude && place.longitude ? (
                                <Marker
                                    key={place.id || `marker-${index}`}
                                    coordinate={{
                                        latitude: parseFloat(place.latitude),
                                        longitude: parseFloat(place.longitude),
                                    }}
                                    onPress={() => handleMarkerClick(place)} // Przekazanie pełnego obiektu
                                />
                            ) : null
                        ))}
                    </MapView>


                    <CenterButton onPress={centerMapOnUser} />

                    {/* Existing Menu Button */}
                    <TouchableOpacity
                        style={globalStyles.menuButton}
                        onPress={() => dispatch({ type: 'TOGGLE_MENU' })}
                    >
                        <MaterialCommunityIcons name="menu" size={30} color="black" />
                    </TouchableOpacity>

                    {state.isMenuVisible && (
                        <View style={globalStyles.overlay}>
                            <TouchableOpacity
                                style={globalStyles.overlay}
                                onPress={() => dispatch({ type: 'TOGGLE_MENU' })}
                            />
                            <View style={globalStyles.menuContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch({ type: 'SET_SEARCH_PANEL_VISIBLE', payload: true });
                                        dispatch({ type: 'TOGGLE_MENU' });
                                    }}
                                >
                                    <Text style={globalStyles.menuOptionText}>Search for a spot</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch({ type: 'SET_FAVORITES_PANEL_VISIBLE', payload: true });
                                        dispatch({ type: 'TOGGLE_MENU' });
                                    }}
                                >
                                    <Text style={globalStyles.menuOptionText}>My favourite spots</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch({ type: 'SET_JOURNEY_PANEL_VISIBLE', payload: true });
                                        dispatch({ type: 'TOGGLE_MENU' }); // Ukrywa menu
                                    }}
                                >
                                    <Text style={globalStyles.menuOptionText}>My journey</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    )}

                    {state.isOptionsPanelVisible && (
                        <OptionsPanel
                            onClose={() => dispatch({ type: 'TOGGLE_OPTIONS_PANEL' })}
                            onProfile={openProfile}
                            onSettings={openSettings}
                            onLogout={handleLogout}
                        />
                    )}

                    {state.isProfilePanelVisible && (
                        <ProfilePanel
                            onClose={() => dispatch({ type: 'SET_PROFILE_PANEL_VISIBLE', payload: false })}
                            userProfile={userProfile} // Przekazanie nazwy użytkownika
                        />
                    )}

                    {state.isSettingsPanelVisible && (
                        <SettingsPanel
                            onClose={() => dispatch({ type: 'SET_SETTINGS_PANEL_VISIBLE', payload: false })}
                            onSaveUsername={handleSaveUsername} // Dodanie funkcji zapisu
                            currentUsername={userProfile.name} // Przekazanie obecnej nazwy użytkownika
                        />
                    )}



                    {/* Additional Panels */}
                    {state.isSearchPanelVisible && (
                        <SearchingPanel
                            onClose={() => dispatch({ type: 'SET_SEARCH_PANEL_VISIBLE', payload: false })}
                            places={state.places}
                            userLocation={userLocation || { latitude: 0, longitude: 0 }} // Zapewnij domyślne wartości
                            onSelectPlace={onSelectPlace}
                        />
                    )}


                    {state.isAddSpotPanelVisible && (
                        <AddSpotPanel
                            onClose={() => dispatch({ type: 'SET_ADD_SPOT_PANEL_VISIBLE', payload: false })}
                            onSaveSpot={onSaveSpot}
                            userLocation={state.location}
                            selectedLocation={state.addSpotLocation}
                        />
                    )}

                    {state.isFavoritesPanelVisible && (
                        <FavoritesPanel
                            favorites={state.favorites}
                            onSelectFavorite={onSelectPlace}
                            onClose={() => dispatch({ type: 'SET_FAVORITES_PANEL_VISIBLE', payload: false })}
                        />
                    )}
                    {state.isJourneyPanelVisible && (
                        <JourneyPanel
                            journey={state.journey} // Przekazuje historię podróży
                            onRemoveFromJourney={onRemoveFromJourney} // Funkcja usuwania z historii
                            onClose={() => dispatch({ type: 'SET_JOURNEY_PANEL_VISIBLE', payload: false })} // Zamknięcie panelu
                        />
                    )}

                    {state.isDetailPanelVisible && state.selectedPlace && (
                        <DetailPanel
                            place={state.selectedPlace}
                            userLocation={state.location}
                            isFavorite={state.favorites.some((fav) => fav.id === state.selectedPlace?.id)}
                            onClose={() => dispatch({ type: 'CLOSE_DETAIL_PANEL' })}
                            onToggleFavorite={toggleFavorite}
                            onAddToJourney={onAddToJourney} // Funkcja dodania miejsca do journey
                            journey={state.journey}
                        />
                    )}






                </SafeAreaView>
            </Provider>
        </GestureHandlerRootView>
    );
};

export default App;