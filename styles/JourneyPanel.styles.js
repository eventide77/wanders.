import { StyleSheet } from 'react-native';

export const journeyPanelStyles = StyleSheet.create({
    panelContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    placeName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    placeDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    noJourney: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 20,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#E5E7EB',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#111827',
        fontSize: 16,
    },
});
