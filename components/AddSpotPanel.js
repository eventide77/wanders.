import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase"; // Import Auth
import { addMarkerToUser } from "../firebase"; // Import funkcji dodawania markera do użytkownika

const AddSpotPanel = ({ onClose, onSaveSpot, selectedLocation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Funkcja do wyboru zdjęcia z galerii
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    // Funkcja do przesyłania obrazu do Firebase Storage
    const uploadImageToStorage = async (imageUri) => {
        try {
            const storage = getStorage();
            const spotId = `${Date.now()}`; // Generowanie unikalnego ID na podstawie czasu
            const storageRef = ref(storage, `SpotImages/${spotId}.jpg`);
            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    // Funkcja zapisu nowego miejsca
    const saveSpot = async () => {
        if (!name.trim() || !selectedLocation) {
            Alert.alert("Error", "Please provide a name and location for the spot.");
            return;
        }

        setIsUploading(true); // Rozpoczynamy przesyłanie

        try {
            let imageUrl = null;

            // Jeśli obrazek został wybrany, przesyłamy go do Firebase Storage
            if (image) {
                imageUrl = await uploadImageToStorage(image);
            }

            // Tworzymy nowy obiekt znacznika
            const newSpot = {
                name: name.trim(),
                description: description.trim(),
                imageUrl: imageUrl || null, // URL obrazu lub null
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                authorId: auth.currentUser?.uid, // Dodaj ID użytkownika, który tworzy
            };

            await onSaveSpot(newSpot); // Zapis do Firestore
            Alert.alert("Success", "Spot saved successfully!");
            onClose(); // Zamknij panel po zapisaniu
        } catch (error) {
            console.error("Error saving spot:", error);
            Alert.alert("Error", "Failed to save the spot. Please try again.");
        } finally {
            setIsUploading(false); // Resetujemy stan przesyłania
        }
    };


    return (
        <View style={styles.panelContainer}>
            <Text style={styles.title}>Add a New Spot</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            {/* Wyświetlenie opcji wyboru obrazu */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Pick an Image</Text>
                )}
            </TouchableOpacity>

            {isUploading ? (
                <Text style={styles.uploadingText}>Uploading...</Text> // Informacja o przesyłaniu
            ) : (
                <Button title="Save Spot" onPress={saveSpot} />
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    panelContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    imagePicker: {
        height: 100,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagePlaceholder: {
        color: '#888',
        fontSize: 16,
    },
    uploadingText: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#888',
    },
    closeButton: {
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AddSpotPanel;
