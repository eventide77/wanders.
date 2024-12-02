// styles/MenuOptions.styles.js
import { StyleSheet } from 'react-native';

export const menuOptionsStyles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    menuText: {
        fontSize: 16,
        color: '#1F2937',
        marginLeft: 10,
    },
});
