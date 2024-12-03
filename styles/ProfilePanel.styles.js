import { StyleSheet } from 'react-native';

export const profilePanelStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Półprzezroczyste tło
    },
    panelContainer: {
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
        backgroundColor: '#d1d5db', // Jasny szary jako akcent
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#374151', // Ciemny szary
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#10B981', // Zielony jako kolor wiodący
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#374151', // Szary tekst
        textAlign: 'center',
    },
    stats: {
        fontSize: 16,
        color: '#6B7280', // Jasny szary tekst
        marginVertical: 5,
        textAlign: 'center',
    },
    friendsList: {
        maxHeight: 150,
        width: '100%',
        marginBottom: 10,
    },
    addFriendButton: {
        backgroundColor: '#10B981', // Zielony jako wiodący kolor
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    addFriendButtonText: {
        color: '#FFFFFF', // Kontrastowy biały tekst
        fontSize: 16,
        fontWeight: 'bold',
    },
});
