import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CenterButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.centerButton} onPress={onPress}>
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#000" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    centerButton: {
        position: 'absolute',
        top: 80,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5, // Cień na Androidzie
        shadowColor: '#000000', // Cień na iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10, // Priorytet renderowania nad mapą
    },
});

export default CenterButton;
