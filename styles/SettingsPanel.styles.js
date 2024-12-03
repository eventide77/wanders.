import { StyleSheet } from 'react-native';

export const settingsPanelStyles = StyleSheet.create({
    settingsPanelContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Półprzezroczyste tło
    },
    panelContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#ffffff', // Białe tło jako baza
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#d1d5db', // Jasny szary
        borderRadius: 15,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#374151', // Ciemny szary
        fontWeight: 'bold',
    },
    settingsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#10B981', // Zielony jako kolor wiodący
    },
    input: {
        height: 40,
        borderColor: '#d1d5db', // Jasny szary
        borderWidth: 1,
        padding: 12,
        marginBottom: 15,
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#F3F4F6', // Bardzo jasny szary
        fontSize: 16,
        color: '#374151', // Ciemny szary tekst
    },
    saveButton: {
        backgroundColor: '#10B981', // Zielony jako kolor wiodący
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#FFFFFF', // Kontrastowy biały tekst
        fontSize: 16,
        fontWeight: 'bold',
    },
    trackButton: {
        backgroundColor: '#10B981', // Zielony jako wiodący kolor
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    trackButtonText: {
        color: '#FFFFFF', // Kontrastowy biały tekst
        fontSize: 16,
        fontWeight: 'bold',
    },
});
