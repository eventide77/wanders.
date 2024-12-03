import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen'; // Główna mapa
import SearchingPanel from '../components/SearchingPanel'; // Panel wyszukiwania
import FavoritesPanel from '../components/FavoritesPanel'; // Ulubione miejsca
import JourneyPanel from '../components/JourneyPanel'; // Historia podróży
import { navigationStyles } from '../styles/navigation.styles';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ state, dispatch, mapViewRef }) => {
    const handleSelectPlace = (place) => {
        console.log("Place selected from SearchingPanel:", place);

        // Ustaw wybrane miejsce w stanie aplikacji
        dispatch({ type: 'SET_SELECTED_PLACE', payload: place });

        // Przejdź do ekranu Map
        if (mapViewRef.current) {
            mapViewRef.current.animateToRegion({
                latitude: place.latitude,
                longitude: place.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

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
            <Tab.Screen name="Map">
                {() => (
                    <MapScreen
                        state={state}
                        dispatch={dispatch}
                        mapViewRef={mapViewRef}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen name="Search">
                {() => (
                    <SearchingPanel
                        onSelectPlace={(place) => {
                            dispatch({ type: 'SET_SELECTED_PLACE', payload: place });
                            if (mapViewRef.current) {
                                mapViewRef.current.animateToRegion({
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }, 1000);
                            }
                        }}
                    />
                )}
            </Tab.Screen>



            <Tab.Screen name="Favorites">
                {() => (
                    <FavoritesPanel
                        favorites={state.favorites}
                        onToggleFavorite={(place) => dispatch({ type: 'TOGGLE_FAVORITE', payload: place })}
                        openDetailPanel={(place) => dispatch({ type: 'SET_SELECTED_PLACE', payload: place })}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen name="Journey">
                {() => (
                    <JourneyPanel
                        journey={state.journey}
                        onAddToJourney={(place) => dispatch({ type: 'ADD_TO_JOURNEY', payload: place })}
                        openDetailPanel={(place) => dispatch({ type: 'SET_SELECTED_PLACE', payload: place })}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default BottomTabs;
