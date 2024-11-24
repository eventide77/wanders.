import { StyleSheet } from 'react-native';

export const favoritesPanelStyles = StyleSheet.create({
    panelContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    favoriteItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    favoriteText: {
        fontSize: 16,
        color: '#333',
    },
    noFavorites: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    closeButton: {
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
});
