import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Linking,
    Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { detailPanelStyles } from '../styles/DetailPanel.styles';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DetailPanel = ({
                         place = {},
                         isFavorite: initialIsFavorite,
                         onClose,
                         onAddToJourney,
                         userLocation,
                         journey,
                         onUpdateMarker,
                     }) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isVisited, setIsVisited] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlace, setEditedPlace] = useState({
        name: place.name || '',
        description: place.description || '',
    });

    const isAuthor = place.authorId === auth.currentUser?.uid;

    useEffect(() => {
        const visited = journey.some((journeyPlace) => journeyPlace.id === place.id);
        setIsVisited(visited);
    }, [journey, place]);

    // Funkcja sprawdzająca poprawność URL obrazu
    const isValidImageUrl = (url) => url && typeof url === 'string' && url.startsWith('http');

    // Funkcja do dodawania/usuwania ulubionych miejsc
    const toggleFavorite = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You must be logged in to manage favorites.');
            return;
        }

        try {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            let updatedFavorites = [];
            if (userDoc.exists()) {
                const currentFavorites = userDoc.data().favorites || [];
                const isFav = currentFavorites.some((fav) => fav.id === place.id);

                if (isFav) {
                    updatedFavorites = currentFavorites.filter((fav) => fav.id !== place.id);
                } else {
                    updatedFavorites = [...currentFavorites, place];
                }
            } else {
                updatedFavorites = [place];
            }

            await setDoc(userDocRef, { favorites: updatedFavorites }, { merge: true });
            setIsFavorite(!isFavorite); // Zmień stan lokalny
            Alert.alert(
                'Success',
                isFavorite ? 'Removed from favorites!' : 'Added to favorites!'
            );
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorites.');
        }
    };

    const handleSaveEdits = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You must be logged in to edit this place.');
            return;
        }

        if (!editedPlace.name.trim() || !editedPlace.description.trim()) {
            Alert.alert('Error', 'Name and description cannot be empty.');
            return;
        }

        try {
            const placeRef = doc(db, 'places', place.id);

            const updatedPlace = {
                name: editedPlace.name.trim(),
                description: editedPlace.description.trim(),
            };

            await updateDoc(placeRef, updatedPlace);
            onUpdateMarker({ ...place, ...updatedPlace });

            Alert.alert('Success', 'Marker updated successfully!');
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save changes.');
        }
    };

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'Failed to open Google Maps.')
        );
    };

    return (
        <View style={detailPanelStyles.overlay}>
            <TouchableOpacity
                style={detailPanelStyles.overlayBackground}
                onPress={onClose}
            />
            <View style={detailPanelStyles.panelContainer}>
                <TouchableOpacity
                    style={detailPanelStyles.closeButton}
                    onPress={onClose}
                >
                    <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>

                {isAuthor && (
                    <TouchableOpacity
                        style={detailPanelStyles.editIcon}
                        onPress={() => setIsEditing((prev) => !prev)}
                    >
                        <MaterialCommunityIcons name="pencil" size={22} color="#2563EB" />
                    </TouchableOpacity>
                )}

                {isEditing ? (
                    <View>
                        <Text style={detailPanelStyles.editLabel}>Edit Name:</Text>
                        <TextInput
                            style={detailPanelStyles.editInput}
                            value={editedPlace.name}
                            onChangeText={(text) => setEditedPlace({ ...editedPlace, name: text })}
                        />
                        <Text style={detailPanelStyles.editLabel}>Edit Description:</Text>
                        <TextInput
                            style={detailPanelStyles.editInput}
                            value={editedPlace.description}
                            onChangeText={(text) =>
                                setEditedPlace({ ...editedPlace, description: text })
                            }
                            multiline
                        />
                        <View style={detailPanelStyles.editActions}>
                            <TouchableOpacity
                                style={detailPanelStyles.saveButton}
                                onPress={handleSaveEdits}
                            >
                                <Text style={detailPanelStyles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={detailPanelStyles.cancelButton}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={detailPanelStyles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={detailPanelStyles.placeTitle}>
                            {place.name || 'N/A'}
                        </Text>
                        <View style={detailPanelStyles.imageContainer}>
                            {isValidImageUrl(place.imageUrl) ? (
                                <Image
                                    style={detailPanelStyles.placeImage}
                                    source={{ uri: place.imageUrl }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={detailPanelStyles.imagePlaceholderText}>
                                    No Image Available
                                </Text>
                            )}
                        </View>
                        <Text style={detailPanelStyles.placeDescription}>
                            {place.description || 'No description available.'}
                        </Text>

                        {/* Przycisk do ulubionych */}
                        <TouchableOpacity
                            style={detailPanelStyles.favoriteIcon}
                            onPress={toggleFavorite}
                        >
                            <MaterialCommunityIcons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={32}
                                color={isFavorite ? 'red' : 'gray'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={detailPanelStyles.navigateButton}
                            onPress={handleNavigate}
                        >
                            <Text style={detailPanelStyles.navigateButtonText}>Navigate</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

export default DetailPanel;
