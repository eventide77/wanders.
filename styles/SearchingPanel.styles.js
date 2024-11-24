import { StyleSheet } from 'react-native';

export const searchingPanelStyles = StyleSheet.create({
    panelContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#F9FAFB',
        fontSize: 16,
    },
    resultItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        fontSize: 16,
        color: '#374151',
    },
    noResults: {
        fontStyle: 'italic',
        color: '#9CA3AF',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});