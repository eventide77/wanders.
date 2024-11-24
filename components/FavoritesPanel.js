// components/FavoritesPanel.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { favoritesPanelStyles as styles } from '../styles/FavoritesPanel.styles';

const FavoritesPanel = ({ favorites, onSelectFavorite, onClose }) => {
    return (
        <View style={styles.panelContainer}>
            <Text style={styles.title}>My Favourite Spots</Text>

            {/* Lista ulubionych miejsc */}
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.favoriteItem}
                        onPress={() => onSelectFavorite(item)}
                    >
                        <Text style={styles.favoriteText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.noFavorites}>No favourites added yet.</Text>
                }
            />

            {/* Przycisk zamknięcia */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FavoritesPanel;
