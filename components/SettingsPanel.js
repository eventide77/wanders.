import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { settingsPanelStyles as styles } from '../styles/SettingsPanel.styles';

const SettingsPanel = ({ onClose, onSaveUsername, currentUsername, startTrackingDistance, stopTrackingDistance }) => {
    const [newUsername, setNewUsername] = useState(currentUsername || '');

    const handleSave = () => {
        if (newUsername.trim()) {
            onSaveUsername(newUsername); // Save the new username
            Alert.alert('Success', 'Username saved successfully');
        } else {
            Alert.alert('Error', 'Username cannot be empty');
        }
    };

    return (
        <View style={styles.settingsPanelContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.settingsTitle}>Settings</Text>

            {/* Username Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={setNewUsername}
            />

            {/* Save Username Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Username</Text>
            </TouchableOpacity>

            {/* Distance Tracking Buttons */}
            <TouchableOpacity style={styles.trackButton} onPress={startTrackingDistance}>
                <Text style={styles.trackButtonText}>Start Tracking Distance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trackButton} onPress={stopTrackingDistance}>
                <Text style={styles.trackButtonText}>Stop Tracking Distance</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsPanel;
