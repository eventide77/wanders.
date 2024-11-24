import { StyleSheet } from 'react-native';

export const detailPanelStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Przyciemnione tło
        justifyContent: 'center',
        alignItems: 'center', // Wyśrodkowanie panelu
    },
    panelContainer: {
        width: '85%', // Zmniejszona szerokość
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        alignItems: 'center', // Wyśrodkowanie zawartości
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 50,
        padding: 8,
        elevation: 2,
    },
    placeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    placeImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    imagePlaceholderText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    visitButton: {
        backgroundColor: '#3B82F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    visitedButton: {
        backgroundColor: '#10B981',
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
    },
    visitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    navigateButton: {
        backgroundColor: '#EF4444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    navigateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    editOptions: {
        marginBottom: 15,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#2563EB',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F9FAFB',
    },
    saveButton: {
        backgroundColor: '#3B82F6',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#D1D5DB',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    addToJourneyButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    addToJourneyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
