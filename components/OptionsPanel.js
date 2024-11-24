// components/OptionsPanel.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { optionsPanelStyles as styles } from '../styles/OptionsPanel.styles';

const OptionsPanel = ({ onClose, onProfile, onSettings, onLogout }) => {
    return (
        <View style={styles.panelContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Options Title */}
            <Text style={styles.title}>Options</Text>

            {/* My Profile Option */}
            <TouchableOpacity style={styles.optionButton} onPress={onProfile}>
                <Text style={styles.optionText}>My Profile</Text>
            </TouchableOpacity>

            {/* Settings Option */}
            <TouchableOpacity style={styles.optionButton} onPress={onSettings}>
                <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>

            {/* Logout Option */}
            <TouchableOpacity style={styles.optionButton} onPress={onLogout}>
                <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OptionsPanel;
