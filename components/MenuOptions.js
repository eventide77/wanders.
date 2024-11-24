// components/MenuOptions.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { menuOptionsStyles as styles } from '../styles/MenuOptions.styles';

const MenuOptions = ({ toggleMenu, openPanel }) => (
    <View style={styles.menuContainer}>
        {/* Opcja: Wyszukaj */}
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                openPanel('Search');
                toggleMenu();
            }}
        >
            <MaterialCommunityIcons name="magnify" size={24} color="black" />
            <Text style={styles.menuText}>Wyszukaj</Text>
        </TouchableOpacity>

        {/* Dodaj inne opcje menu tutaj */}
    </View>
);

export default MenuOptions;
