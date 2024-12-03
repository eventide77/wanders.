import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfilePanel from './ProfilePanel'; // Import komponentu profilu
import SettingsPanel from './SettingsPanel'; // Import komponentu ustawień
import { auth } from '../firebase'; // Firebase auth dla wylogowania

const OptionsPanel = ({ userProfile }) => {
    const [visible, setVisible] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Przełącz widoczność menu
    const toggleMenu = () => {
        setVisible(!visible);
    };

    // Funkcja wylogowania
    const handleLogout = async () => {
        try {
            setVisible(false); // Zamknij menu
            await auth.signOut();
            Alert.alert("Logged out", "You have been logged out.");
        } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to log out.");
        }
    };

    return (
        <>
            {/* Przycisk otwierający menu */}
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <MaterialCommunityIcons name="dots-vertical" size={30} color="white" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={toggleMenu}
            >
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.menuContainer}>
                    {/* My Profile */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            setIsProfileOpen(true); // Otwórz profil
                        }}
                    >
                        <MaterialCommunityIcons
                            name="account"
                            size={20}
                            color="#333"
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuText}>My Profile</Text>
                    </TouchableOpacity>

                    {/* Settings */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            setIsSettingsOpen(true); // Otwórz ustawienia
                        }}
                    >
                        <MaterialCommunityIcons
                            name="cog"
                            size={20}
                            color="#333"
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuText}>Settings</Text>
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            handleLogout(); // Wylogowanie
                        }}
                    >
                        <MaterialCommunityIcons
                            name="logout"
                            size={20}
                            color="#333"
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Profile Panel */}
            {isProfileOpen && (
                <ProfilePanel
                    onClose={() => setIsProfileOpen(false)} // Zamknięcie panelu profilu
                    userProfile={userProfile} // Przekazanie danych użytkownika
                />
            )}

            {/* Settings Panel */}
            {isSettingsOpen && (
                <SettingsPanel
                    onClose={() => setIsSettingsOpen(false)} // Zamknięcie panelu ustawień
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        marginRight: 12,
        marginTop: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        top: 60,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    menuIcon: {
        marginRight: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});

export default OptionsPanel;
