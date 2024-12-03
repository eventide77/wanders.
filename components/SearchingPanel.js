import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { searchingPanelStyles as styles } from '../styles/SearchingPanel.styles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SearchingPanel = ({ onSelectPlace }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);

    // Pobieranie miejsc z Firestore przy montowaniu komponentu
    const fetchAllPlaces = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'places'));
            const placesFromFirebase = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAllPlaces(placesFromFirebase);
        } catch (error) {
            console.error('Error fetching places:', error);
            Alert.alert('Error', 'Failed to fetch places from the database.');
        }
    };

    useEffect(() => {
        fetchAllPlaces(); // Pobierz miejsca tylko raz
    }, []);

    // Wyszukiwanie w allPlaces
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query.length) {
            setFilteredPlaces([]);
            return;
        }

        const results = allPlaces.filter((place) =>
            place.name?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPlaces(results);
    };

    // Obsługa wyboru miejsca z listy
    const handleSelectPlace = (place) => {
        console.log('Selected place:', place); // Debugowanie
        if (onSelectPlace) {
            onSelectPlace(place); // Powiadomienie rodzica o wybranym miejscu
        } else {
            console.warn('onSelectPlace is not defined');
        }
    };

    return (
        <View style={styles.panelContainer}>
            <View style={styles.contentWrapper}>
                <Text style={styles.title}>Search for a Spot</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter spot name"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

                <FlatList
                    style={styles.resultList} // Dodano ograniczenie wysokości listy
                    data={filteredPlaces}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectPlace(item)}>
                            <Text style={styles.resultItem}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        searchQuery.length > 0 ? (
                            <Text style={styles.noResults}>No results found</Text>
                        ) : null
                    }
                />
            </View>
        </View>
    );
};

export default SearchingPanel;
