import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { settingsPanelStyles as styles } from '../styles/SettingsPanel.styles';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const SettingsPanel = ({
                           isVisible, // Widoczność modala
                           onClose, // Funkcja zamknięcia
                           currentUsername,
                           dispatch, // Dispatch do aktualizacji stanu w reducerze
                       }) => {
    const [newUsername, setNewUsername] = useState(currentUsername || '');

    const handleSave = async () => {
        if (!newUsername.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        try {
            if (!auth.currentUser) {
                Alert.alert('Error', 'You must be logged in to change the username.');
                return;
            }

            const userDocRef = doc(db, 'users', auth.currentUser.uid);

            // Zapisz nową nazwę użytkownika w Firestore
            await setDoc(userDocRef, { name: newUsername }, { merge: true });

            // Zaktualizuj stan użytkownika w aplikacji
            dispatch({
                type: 'SET_USER_PROFILE',
                payload: { name: newUsername },
            });

            Alert.alert('Success', 'Username updated successfully!');
            onClose(); // Zamknij modal po zapisaniu
        } catch (error) {
            console.error('Error saving username:', error);
            Alert.alert('Error', 'Failed to update username. Please try again.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent={true}>
            <View style={styles.settingsPanelContainer}>
                <View style={styles.panelContent}>
                    {/* Przycisk zamykający */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    {/* Tytuł */}
                    <Text style={styles.settingsTitle}>Settings</Text>

                    {/* Pole do edycji nazwy użytkownika */}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new username"
                        value={newUsername}
                        onChangeText={setNewUsername}
                    />

                    {/* Przycisk zapisu */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Username</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SettingsPanel;
