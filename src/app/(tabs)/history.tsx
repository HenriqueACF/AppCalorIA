import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getMeals } from '../../database/db';
import { Meal } from '@/types/meal';

export default function HistoryScreen() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setMeals(getMeals());
        }, [])
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={styles.empty}>Nenhuma refeição registrada ainda.</Text>
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.mealCard}
                        onPress={() => router.push(`/meal-view?id=${item.id}`)}
                    >
                        <Text style={styles.date}>
                            {new Date(item.datetime).toLocaleString('pt-BR')}
                        </Text>
                        <Text>Total: {item.total_kcal} kcal</Text>
                        <Text>Itens: {item.notes || 'N/A'}</Text>
                    </Pressable>
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
