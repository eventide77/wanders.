import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { journeyPanelStyles } from '../styles/JourneyPanel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const JourneyPanel = ({ journey = [], onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]); // Wszystkie miejsca z Firebase
    const [updatedJourney, setUpdatedJourney] = useState(Array.isArray(journey) ? journey : []); // Zabezpieczenie przed undefined
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Sterowanie otwieraniem sekcji wyszukiwania

    // Pobieranie miejsc z Firebase
    const fetchAllPlaces = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'places'));
            const placesFromFirebase = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAllPlaces(placesFromFirebase); // Ustaw wszystkie miejsca
        } catch (error) {
            console.error('Error fetching places from Firebase:', error);
            Alert.alert('Error', 'Failed to fetch places from the database.');
        }
    };

    useEffect(() => {
        fetchAllPlaces(); // Pobierz miejsca przy montowaniu komponentu
    }, []);

    // Obsługa wyszukiwania
    const handleSearch = (query) => {
        setSearchQuery(query);

        const results = allPlaces.filter((place) =>
            place.name?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPlaces(results);
    };

    // Funkcja lokalna obsługująca dodanie miejsca do podróży
    const onAddToJourney = async (place) => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You must be logged in to add a place to your journey.');
            return;
        }

        // Zabezpieczenie przed błędem "undefined"
        if (updatedJourney.some((item) => item.id === place.id)) {
            Alert.alert('Info', 'This place is already in your journey.');
            return;
        }

        const newJourney = [...updatedJourney, place];

        try {
            // Zapisz dane w Firestore
            const userDoc = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userDoc, { journey: newJourney }, { merge: true });

            setUpdatedJourney(newJourney); // Zaktualizuj lokalny stan
            Alert.alert('Success', 'Place added to your journey!');
        } catch (error) {
            console.error('Error adding place to journey:', error);
            Alert.alert('Error', 'Failed to add place to your journey.');
        }
    };

    // Funkcja lokalna obsługująca usunięcie miejsca z podróży
    const onRemoveFromJourney = async (placeId) => {
        const newJourney = updatedJourney.filter((item) => item.id !== placeId);

        try {
            const userDoc = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userDoc, { journey: newJourney }, { merge: true });

            setUpdatedJourney(newJourney);
            Alert.alert('Success', 'Place removed from your journey!');
        } catch (error) {
            console.error('Error removing place from journey:', error);
            Alert.alert('Error', 'Failed to remove place from your journey.');
        }
    };

    const renderJourneyItem = ({ item }) => (
        <View style={journeyPanelStyles.itemContainer}>
            <View style={journeyPanelStyles.placeInfo}>
                <Text style={journeyPanelStyles.placeName}>{item.name}</Text>
                <Text style={journeyPanelStyles.placeDescription}>
                    {item.description || 'No description available.'}
                </Text>
            </View>
            <TouchableOpacity onPress={() => onRemoveFromJourney(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#FF0000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={journeyPanelStyles.panelContainer}>
            <Text style={journeyPanelStyles.title}>Journey History</Text>

            {/* Lista miejsc w podróży */}
            <FlatList
                data={updatedJourney}
                keyExtractor={(item) => item.id}
                renderItem={renderJourneyItem}
                ListEmptyComponent={
                    <Text style={journeyPanelStyles.noJourney}>
                        No journey history yet! Start exploring!
                    </Text>
                }
            />

            {/* Przycisk otwierania sekcji wyszukiwania */}
            <TouchableOpacity
                style={journeyPanelStyles.searchToggleButton}
                onPress={() => setIsSearchOpen((prev) => !prev)}
            >
                <Text style={journeyPanelStyles.searchToggleButtonText}>
                    {isSearchOpen ? 'Close Search' : 'Search for a Place'}
                </Text>
            </TouchableOpacity>

            {/* Sekcja wyszukiwania */}
            {isSearchOpen && (
                <>
                    <TextInput
                        style={journeyPanelStyles.searchInput}
                        placeholder="Search for a place to add..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredPlaces}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={journeyPanelStyles.itemContainer}>
                                <View style={journeyPanelStyles.placeInfo}>
                                    <Text style={journeyPanelStyles.placeName}>{item.name}</Text>
                                    <Text style={journeyPanelStyles.placeDescription}>
                                        {item.description || 'No description available.'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => onAddToJourney(item)}>
                                    <MaterialCommunityIcons name="plus-circle" size={24} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={journeyPanelStyles.noJourney}>
                                No matching places found.
                            </Text>
                        }
                    />
                </>
            )}

            {/* Przycisk zamknięcia panelu */}

        </View>
    );
};

export default JourneyPanel;
