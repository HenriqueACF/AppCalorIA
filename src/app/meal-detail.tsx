import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { saveMeal } from '../database/db';
import { analyzeImage } from '../services/analyzeImage';
import { useMealStore } from '../store/mealStore';
import { MealItemInput } from '@/types/meal';

export default function MealDetailScreen() {
    const router = useRouter();
    const pending = useMealStore((s) => s.pending);
    const [items, setItems] = useState<MealItemInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!pending) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await analyzeImage(pending.base64, pending.mediaType);
                if (!cancelled) setItems(result);
            } catch (e) {
                console.error('Falha ao analisar imagem:', e);
                if (!cancelled) setError('Não foi possível analisar a imagem. Tente novamente.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pending]);

    const handleSave = () => {
        try {
            saveMeal(items, pending?.uri);
            useMealStore.getState().clearPending();
            router.replace('/');
        } catch (e) {
            console.error('Falha ao salvar refeição:', e);
            Alert.alert('Erro ao salvar');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 12 }}>Analisando imagem...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <Button title="Voltar" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(_, i) => i.toString()}
                ListEmptyComponent={<Text style={styles.empty}>Nenhum alimento identificado.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.foodName}>{item.food_name}</Text>
                        <Text>{item.portion_g}g - {item.kcal} kcal</Text>
                        <Text style={styles.macros}>
                            P: {item.protein_g}g   C: {item.carbs_g}g   G: {item.fat_g}g
                        </Text>
                    </View>
                )}
            />
            <Text style={styles.total}>
                Total: {items.reduce((s, i) => s + i.kcal, 0)} kcal
            </Text>
            <Button title="Salvar Refeição" onPress={handleSave} disabled={items.length === 0} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
    foodName: { fontSize: 18, fontWeight: 'bold' },
    macros: { fontSize: 14, color: '#666', marginTop: 2 },
    total: { fontSize: 20, marginVertical: 15, textAlign: 'center' },
    empty: { textAlign: 'center', marginTop: 40, color: '#888' },
    error: { color: '#c0392b', textAlign: 'center', marginBottom: 20 },
});
