import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getMeals } from '../../database/db';

export default function HistoryScreen() {
    const [meals, setMeals] = useState<any[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory =  () => {
        const data = getMeals();
        setMeals(data);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.mealCard}>
                        <Text style={styles.date}>{item.datetime}</Text>
                        <Text>Total: {item.total_kcal} kcal</Text>
                        <Text>Itens: {item.notes || 'N/A'}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    mealCard: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
    date: { fontWeight: 'bold', marginBottom: 5 },
});
