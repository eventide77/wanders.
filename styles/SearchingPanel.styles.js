import { StyleSheet } from 'react-native';

export const searchingPanelStyles = StyleSheet.create({
    panelContainer: {
        flex: 1, // Zapełnij cały ekran
        justifyContent: 'center', // Wyśrodkuj wertykalnie
        alignItems: 'center', // Wyśrodkuj horyzontalnie
        backgroundColor: '#F3F4F6', // Delikatne tło
        padding: 20,
    },
    contentWrapper: {
        width: '90%', // Szerokość bloku z funkcjonalnością
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    resultList: {
        maxHeight: 200, // Ograniczenie wysokości listy wyników
        marginBottom: 15,
    },
    resultItem: {
        paddingVertical: 12,
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
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
