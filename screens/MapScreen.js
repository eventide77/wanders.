import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { globalStyles } from '../styles/global.styles';
import CenterButton from '../components/CenterButton';
import OptionsPanel from '../components/OptionsPanel';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Image } from 'react-native';


// Ikona podróżnika
const travelerIcon = require('../assets/images/traveler.png');

// Styl mapy - ukrycie POI i transportu
const customMapStyle = [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const MapScreen = ({
                       mapRegion,
                       userLocation,
                       state,
                       centerMapOnUser,
                       onProfile,
                       onSettings,
                       onLogout,
                       mapViewRef,
                       dispatch,
                   }) => {
    // Pobieranie miejsc z Firestore
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'places'));
                const places = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched places:", places); // Debug
                dispatch({ type: 'SET_PLACES', payload: places });
            } catch (error) {
                console.error("Error fetching places from Firestore:", error);
            }
        };

        fetchPlaces();
    }, [dispatch]);

    // Obsługa kliknięcia znacznika
    const handleMarkerClick = (place) => {
        if (!place.id || !place.name) {
            console.error("Marker is missing required properties:", place);
            Alert.alert("Error", "Marker data is incomplete.");
            return;
        }
        dispatch({ type: 'SET_SELECTED_PLACE', payload: place });
        console.log(`Marker clicked: ${place.name}`);
    };

    // Obsługa długiego naciśnięcia mapy
    const handleLongPress = (event) => {
        const { coordinate } = event.nativeEvent;
        console.log("Long pressed at location:", coordinate);

        dispatch({ type: 'SET_ADD_SPOT_LOCATION', payload: coordinate });
        dispatch({ type: 'SET_ADD_SPOT_PANEL_VISIBLE', payload: true });
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>wanders.</Text>
                <OptionsPanel
                    onProfile={onProfile}
                    onSettings={onSettings}
                    onLogout={onLogout}
                />
            </View>

            {/* MapView */}
            <MapView
                ref={mapViewRef}
                style={StyleSheet.absoluteFillObject}
                region={mapRegion}
                onLongPress={handleLongPress} // Obsługa długiego naciśnięcia
                customMapStyle={customMapStyle}
            >
                {/* Marker użytkownika */}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        description="Your current location"
                    >
                        <Image
                            source={travelerIcon}
                            style={{ width: 40, height: 40 }} // Zmniejsz rozmiar tutaj
                            resizeMode="contain" // Zapewnia odpowiednie proporcje
                        />
                    </Marker>
                )}

                {/* Markery miejsc */}
                {state?.places?.map((place) => {
                    if (!place.latitude || !place.longitude || isNaN(place.latitude) || isNaN(place.longitude)) {
                        console.warn("Skipping invalid marker:", place);
                        return null;
                    }
                    return (
                        <Marker
                            key={place.id}
                            coordinate={{
                                latitude: place.latitude,
                                longitude: place.longitude,
                            }}
                            onPress={() => handleMarkerClick(place)} // Wywołanie kliknięcia
                        />
                    );
                })}

            </MapView>

            {/* Center Button */}
            <CenterButton onPress={centerMapOnUser} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#33673c',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        position: 'center',
        fontSize: 20,
        top: 5,
        fontWeight: 'bold',
        color: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default MapScreen;
