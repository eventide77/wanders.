import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { searchingPanelStyles as styles } from '../styles/SearchingPanel.styles';
import { getDistance } from 'geolib';
import Fuse from 'fuse.js';
import * as Location from 'expo-location';

const SearchingPanel = ({ onClose, places, onSelectPlace, userLocation }) => {
    const [query, setQuery] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    // Fuse.js configuration for fuzzy search
    const fuse = new Fuse(places, {
        keys: ['name'],
        threshold: 0.3,
        includeScore: true,
    });

    // Check user location and calculate distances
    useEffect(() => {
        const searchAndSortPlaces = () => {
            console.log("Current query:", query);
            console.log("Places:", places);

            if (!query.length) {
                setFilteredPlaces([]);
                return;
            }

            const results = fuse.search(query).map((result) => result.item);

            const resultsWithDistance = results
                .filter((place) => place.latitude && place.longitude) // Filtruje miejsca bez współrzędnych
                .map((place) => ({
                    ...place,
                    distance: userLocation
                        ? getDistance(
                            {
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            },
                            {
                                latitude: parseFloat(place.latitude),
                                longitude: parseFloat(place.longitude),
                            }
                        )
                        : null,
                }))
                .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

            console.log("Filtered places with distance:", resultsWithDistance);

            setFilteredPlaces(resultsWithDistance);
        };

        searchAndSortPlaces();
    }, [query, places, userLocation]);


    return (
        <View style={styles.panelContainer}>
            <Text style={styles.title}>Search for a Spot</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter spot name"
                value={query}
                onChangeText={setQuery}
            />

            <FlatList
                data={filteredPlaces}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelectPlace(item)}>
                        <Text style={styles.resultItem}>
                            {item.name} {item.distance !== null ? ` - ${item.distance} meters away` : ''}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    query.length > 0 ? (
                        <Text style={styles.noResults}>No results found</Text>
                    ) : null
                }
            />


            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SearchingPanel;
