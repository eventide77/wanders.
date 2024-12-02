import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen'; // Główna mapa
import SearchingPanel from '../components/SearchingPanel'; // Panel wyszukiwania
import FavoritesPanel from '../components/FavoritesPanel'; // Ulubione miejsca
import JourneyPanel from '../components/JourneyPanel'; // Historia podróży
import { navigationStyles } from '../styles/navigation.styles';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator

            screenOptions={({ route }) => ({
                headerShown: false, // Ukrywa nagłówek nawigacji
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    height: 60,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    // Mapowanie nazw zakładek na ikony
                    switch (route.name) {
                        case 'Map':
                            iconName = 'map';
                            break;
                        case 'Search':
                            iconName = 'magnify';
                            break;
                        case 'Favorites':
                            iconName = 'heart';
                            break;
                        case 'Journey':
                            iconName = 'map-marker-path';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: '#3B82F6', // Kolor aktywnej zakładki
                tabBarInactiveTintColor: '#6B7280', // Kolor nieaktywnej zakładki
            })}
        >
            {/* Definiowanie zakładek */}
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Search" component={SearchingPanel} />
            <Tab.Screen name="Favorites" component={FavoritesPanel} />
            <Tab.Screen name="Journey" component={JourneyPanel} />
        </Tab.Navigator>
    );
};

export default BottomTabs;
