import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { favoritesPanelStyles as styles } from '../styles/FavoritesPanel.styles';
import DetailPanel from './DetailPanel';

const FavoritesPanel = ({ favorites = [], onToggleFavorite, allPlaces = [], onClose }) => {
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    // Obsługa wyszukiwania
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredPlaces([]);
            return;
        }

        const results = allPlaces.filter((place) =>
            place.name?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPlaces(results);
    };

    const handleAddToFavorites = (place) => {
        if (favorites.some((fav) => fav.id === place.id)) {
            Alert.alert('Info', `"${place.name}" is already in your favorites.`);
            return;
        }

        onToggleFavorite(place); // Dodaj do ulubionych
        Alert.alert('Success', `"${place.name}" has been added to your favorites!`);
        setSearchQuery(''); // Resetuj zapytanie wyszukiwania
        setFilteredPlaces([]); // Wyczyść wyniki wyszukiwania
    };

    const handleRemoveFavorite = (favorite) => {
        Alert.alert(
            'Remove Favorite',
            `Are you sure you want to remove "${favorite.name}" from favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onToggleFavorite(favorite), // Usuń z ulubionych
                },
            ]
        );
    };

    const handleSelectFavorite = (favorite) => {
        setSelectedFavorite(favorite); // Otwórz szczegóły miejsca
    };

    return (
        <View style={styles.panelContainer}>
            <Text style={styles.title}>My Favourite Spots</Text>


            {/* Lista ulubionych miejsc */}
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.favoriteItem}>
                        <TouchableOpacity
                            style={styles.favoriteDetails}
                            onPress={() => handleSelectFavorite(item)}
                        >
                            <Text style={styles.favoriteText}>{item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
                            <MaterialCommunityIcons name="heart" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.noFavorites}>No favourites added yet.</Text>
                }
            />

            {/* DetailPanel */}
            {selectedFavorite && (
                <DetailPanel
                    place={selectedFavorite}
                    isFavorite={favorites.some((fav) => fav.id === selectedFavorite.id)}
                    onClose={() => setSelectedFavorite(null)}
                    onAddToJourney={(place) => Alert.alert('Journey', `Added "${place.name}" to journey!`)}
                    journey={[]} // Możesz przekazać właściwą listę podróży
                />
            )}
        </View>
    );
};

export default FavoritesPanel;
