import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OptionsPanel from '../components/OptionsPanel'; // Import OptionsPanel

const Header = ({ onLogout, onProfile, onSettings }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleMenuOption = (action) => {
        setIsMenuVisible(false);
        if (action === 'profile') onProfile();
        else if (action === 'settings') onSettings();
        else if (action === 'logout') onLogout();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* AppBar */}
            <View style={styles.header}>
                <Text style={styles.title}>wanders.</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={28} color="#3B82F6" />
                </TouchableOpacity>
            </View>
            {/* OptionsPanel for menu */}
            {isMenuVisible && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isMenuVisible}
                    onRequestClose={toggleMenu}
                >
                    <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
                    <View style={styles.menuContainer}>
                        <FlatList
                            data={[
                                { key: 'profile', label: 'Profil' },
                                { key: 'settings', label: 'Ustawienia' },
                                { key: 'logout', label: 'Wyloguj' },
                            ]}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleMenuOption(item.key)}
                                    style={styles.menuItem}
                                >
                                    <Text style={styles.menuText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#ffffff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    menuButton: {
        padding: 8, // Zwiększony hitbox
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        top: 66, // Dopasowanie pod AppBar
        right: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Header;
