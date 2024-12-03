import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { profilePanelStyles as styles } from '../styles/ProfilePanel.styles';

const ProfilePanel = ({ isVisible, onClose, userProfile = {} }) => {
    const { name = "Guest", distanceTraveled = 0, friends = [] } = userProfile;

    return (
        <Modal visible={isVisible} animationType="fade" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.panelContainer}>
                    {/* Przycisk zamykający */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    {/* Tytuł */}
                    <Text style={styles.title}>My Profile</Text>

                    {/* Nazwa użytkownika */}
                    <Text style={styles.name}>{name}</Text>

                </View>
            </View>
        </Modal>
    );
};

export default ProfilePanel;
