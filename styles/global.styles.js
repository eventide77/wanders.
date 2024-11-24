import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    // Główne kontenery
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Jasne tło
        justifyContent: 'center', // Wyśrodkowanie pionowe
    },
    screenContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16, // Marginesy wokół ekranu
    },

    // Nagłówki i tytuły
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 12,
    },

    // Przyciski
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
    },
    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
    },
    buttonIcon: {
        marginRight: 8, // Odstęp między ikoną a tekstem
    },

    // Przyciski przełączania (logowanie/rejestracja)
    toggleButton: {
        marginTop: 10,
    },
    toggleButtonText: {
        color: '#3B82F6',
        fontSize: 14,
        textAlign: 'center',
    },

    // Pola tekstowe / Inputy
    input: {
        height: 50,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#111827',
        marginBottom: 12,
    },

    // Teksty
    text: {
        fontSize: 14,
        color: '#374151',
    },
    smallText: {
        fontSize: 12,
        color: '#6B7280',
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },

    // Kontener dla elementów (np. kart, paneli)
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    // Ikony
    iconButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    // Linie i rozdzielacze
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 10,
    },

    // Layout
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Mapa
    map: {
        ...StyleSheet.absoluteFillObject, // Ustawienie mapy na pełny ekran
    },

    // Logo
    logoContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        zIndex: 10,
        elevation: 5,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        resizeMode: 'cover',
    },

    // Menu
    menuButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        zIndex: 10,
    },
    menuContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        width: 180,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical: 5,
        alignItems: 'flex-start',
        zIndex: 11,
    },
    menuOptionText: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },

    // Centrum
    centerButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    switchButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    switchText: {
        fontSize: 14,
        color: '#3B82F6',
    },
});
