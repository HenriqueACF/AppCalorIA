import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { getMeals } from '../../database/db';
import { Meal } from '@/types/meal';

export default function HistoryScreen() {
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const data = getMeals();
        setMeals(data);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={styles.empty}>Nenhuma refeição registrada ainda.</Text>
                }
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
    empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});
