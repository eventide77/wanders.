import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth, loadUserData, addFriend } from '../firebase'; // Import Firebase funkcji
import { profilePanelStyles as styles } from '../styles/ProfilePanel.styles';

const ProfilePanel = ({ onClose, userProfile }) => {
    const handleAddFriend = async () => {
        Alert.prompt(
            "Add Friend",
            "Enter the friend's username to add:",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async (username) => {
                        try {
                            await addFriend(auth.currentUser?.uid, username);
                            Alert.alert("Success", `${username} added to your friends!`);
                        } catch (error) {
                            console.error("Error adding friend:", error);
                            Alert.alert("Error", "Failed to add friend. Please try again.");
                        }
                    },
                },
            ],
            "plain-text"
        );
    };

    return (
        <View style={styles.panelContainer}>
            {/* Przycisk zamknięcia */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Tytuł profilu */}
            <Text style={styles.title}>My Profile</Text>

            {/* Dane użytkownika */}
            <Text style={styles.name}>{userProfile.name}</Text>
            <Text style={styles.stats}>Distance Traveled: {userProfile.distanceTraveled} km</Text>
            <Text style={styles.stats}>Friends:</Text>

            {/* Lista znajomych */}
            <ScrollView style={styles.friendsList}>
                {userProfile.friends.length > 0 ? (
                    userProfile.friends.map((friend, index) => (
                        <Text key={index} style={styles.friendName}>
                            {friend}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noFriendsText}>No friends yet.</Text>
                )}
            </ScrollView>

            {/* Przyciski */}
            <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
                <Text style={styles.addFriendButtonText}>Add Friend</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePanel;
