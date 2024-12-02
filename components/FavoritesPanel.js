import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { favoritesPanelStyles as styles } from '../styles/FavoritesPanel.styles';
import DetailPanel from './DetailPanel';

const FavoritesPanel = ({ favorites, onToggleFavorite, onClose }) => {
    const [selectedFavorite, setSelectedFavorite] = React.useState(null);

    const handleRemoveFavorite = (favorite) => {
        Alert.alert(
            'Remove Favorite',
            `Are you sure you want to remove "${favorite.name}" from favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onToggleFavorite(favorite),
                },
            ]
        );
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
                        <Text style={styles.favoriteText}>{item.name}</Text>
                        <TouchableOpacity onPress={() => onToggleFavorite(item)}>
                            <MaterialCommunityIcons name="heart" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noFavorites}>No favourites added yet.</Text>}
            />



            {/* Przycisk zamknięcia */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            {/* DetailPanel */}
            {selectedFavorite && (
                <DetailPanel
                    place={selectedFavorite}
                    onClose={() => setSelectedFavorite(null)}
                />
            )}
        </View>
    );
};

export default FavoritesPanel;
