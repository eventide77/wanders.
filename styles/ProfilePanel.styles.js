import { StyleSheet } from 'react-native';

export const profilePanelStyles = StyleSheet.create({
    panelContainer: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 15,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1F2937',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#111827',
    },
    stats: {
        fontSize: 16,
        color: '#6B7280',
        marginVertical: 5,
        textAlign: 'center',
    },
    friendName: {
        fontSize: 14,
        color: '#374151',
        marginVertical: 2,
        textAlign: 'center',
    },
});
