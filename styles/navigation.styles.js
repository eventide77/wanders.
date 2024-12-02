import { StyleSheet } from 'react-native';

export const navigationStyles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#33673c', // Białe tło dla dolnego paska
        borderTopWidth: 0, // Usunięcie obramowania na górze
        height: 60, // Wysokość paska
        elevation: 5, // Lekki cień (dla Androida)
        shadowColor: '#000', // Kolor cienia
        shadowOffset: { width: 0, height: -2 }, // Kierunek cienia
        shadowOpacity: 0.1, // Przejrzystość cienia
        shadowRadius: 4, // Rozmycie cienia
    },
    tabBarIconStyle: {
        marginTop: 5, // Dodatkowy odstęp od góry dla ikon
    },
    tabBarLabelStyle: {
        fontSize: 12, // Rozmiar tekstu etykiet
        marginBottom: 5, // Odstęp od dołu
        fontWeight: '500', // Pogrubiona czcionka
        color: '#6B7280', // Domyślny kolor tekstu
    },
    tabBarActiveTintColor: '#44e830', // Kolor aktywnej zakładki
    tabBarInactiveTintColor: '#33673c', // Kolor nieaktywnej zakładki
});
