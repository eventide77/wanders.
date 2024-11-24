import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { journeyPanelStyles } from '../styles/JourneyPanel.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JourneyPanel = ({ journey, onRemoveFromJourney, onClose }) => {
    const renderJourneyItem = ({ item }) => (
        <View style={journeyPanelStyles.itemContainer}>
            <View>
                <Text style={journeyPanelStyles.placeName}>{item.name}</Text>
                <Text style={journeyPanelStyles.placeDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => onRemoveFromJourney(item.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#FF0000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={journeyPanelStyles.panelContainer}>
            <Text style={journeyPanelStyles.title}>Journey History</Text>
            <FlatList
                data={journey}
                keyExtractor={(item) => item.id}
                renderItem={renderJourneyItem}
                ListEmptyComponent={<Text style={journeyPanelStyles.noJourney}>No journey history yet!</Text>}
            />
            <TouchableOpacity style={journeyPanelStyles.closeButton} onPress={onClose}>
                <Text style={journeyPanelStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default JourneyPanel;
