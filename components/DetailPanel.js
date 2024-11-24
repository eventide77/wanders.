import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { detailPanelStyles } from '../styles/DetailPanel.styles';
import { auth } from '../firebase'; // Import firebase
import { addToVisitedPlaces } from "../firebase";
import * as ImagePicker from 'expo-image-picker';

const DetailPanel = ({
                         place = {},
                         isFavorite,
                         onClose,
                         onToggleFavorite, // Funkcja obsługująca dodawanie/usuwanie ulubionych
                         onAddToJourney,
                         journey, // Historia podróży
                     }) => {
    const [isVisited, setIsVisited] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlace, setEditedPlace] = useState({
        name: place.name || '',
        description: place.description || '',
    });
    const [selectedImage, setSelectedImage] = useState(null);

    // Sprawdzenie, czy użytkownik jest autorem znacznika
    const isAuthor = place.authorId === auth.currentUser?.uid;

    const pickImageFromGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                console.log('Selected Image:', result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    // Logika edycji miejsca
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
            // Zapis edycji miejsca do Firestore
            Alert.alert('Success', 'Marker updated successfully!');
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save changes.');
            console.error(error);
        }
    };

    // Sprawdzenie, czy miejsce zostało odwiedzone
    useEffect(() => {
        const visited = journey.some((journeyPlace) => journeyPlace.id === place.id);
        setIsVisited(visited);
    }, [journey, place]);

    // Obsługa oznaczenia miejsca jako odwiedzonego
    const handleVisitPlace = async (place) => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be logged in to mark a place as visited.");
            return;
        }

        if (!place || !place.id || !place.name) {
            console.error("Invalid place object:", place);
            Alert.alert("Error", "The place is missing required details (ID and Name).");
            return;
        }

        try {
            await addToVisitedPlaces(auth.currentUser.uid, place); // Dodanie do Firestore
            onAddToJourney(place); // Dodanie do journey w stanie aplikacji
            setIsVisited(true); // Aktualizacja stanu po sukcesie
            Alert.alert("Success", "Place added to your visited list!");
        } catch (error) {
            console.error("Error adding to visited places:", error);
            Alert.alert("Error", "Failed to mark the place as visited.");
        }
    };

    // Obsługa otwierania Google Maps
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

                <Text style={detailPanelStyles.placeTitle}>{place.name || 'N/A'}</Text>

                <View style={detailPanelStyles.imageContainer}>
                    {place.imageUrl ? (
                        <FastImage
                            style={detailPanelStyles.placeImage}
                            source={{ uri: place.imageUrl }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    ) : (
                        <Text style={detailPanelStyles.imagePlaceholderText}>
                            No Image Available
                        </Text>
                    )}
                </View>

                {isAuthor && (
                    <View style={detailPanelStyles.editOptions}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={detailPanelStyles.input}
                                    value={editedPlace.name}
                                    onChangeText={(text) => setEditedPlace((prev) => ({ ...prev, name: text }))}
                                    placeholder="Edit name"
                                />
                                <TextInput
                                    style={[detailPanelStyles.input, { height: 80 }]}
                                    value={editedPlace.description}
                                    onChangeText={(text) =>
                                        setEditedPlace((prev) => ({ ...prev, description: text }))
                                    }
                                    placeholder="Edit description"
                                    multiline
                                />
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
                            </>
                        ) : (
                            <TouchableOpacity
                                style={detailPanelStyles.editButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={detailPanelStyles.editButtonText}>Edit Place</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {!isAuthor && (
                    <TouchableOpacity
                        style={[
                            detailPanelStyles.visitButton,
                            isVisited && detailPanelStyles.visitedButton,
                        ]}
                        onPress={() => {
                            if (!isVisited) {
                                handleVisitPlace(place);
                            }
                        }}
                    >
                        <Text style={detailPanelStyles.visitButtonText}>
                            {isVisited ? 'Visited!' : 'I was here!'}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={detailPanelStyles.favoriteIcon}
                    onPress={() => onToggleFavorite(place)}
                >
                    <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={32}
                        color={isFavorite ? "red" : "gray"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={detailPanelStyles.navigateButton}
                    onPress={handleNavigate}
                >
                    <Text style={detailPanelStyles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
};

export default DetailPanel;
