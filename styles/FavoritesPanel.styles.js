import { StyleSheet } from 'react-native';

export const favoritesPanelStyles = StyleSheet.create({
    panelContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1F2937',
    },
    favoriteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    favoriteDetails: {
        flex: 1,
    },
    favoriteText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    noFavorites: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 20,
    },
});
