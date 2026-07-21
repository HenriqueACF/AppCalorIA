import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveMeal } from '../database/db';

export default function MealDetailScreen() {
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = {
            items: [
                { food_name: 'Arroz', portion_g: 150, kcal: 195, protein_g: 3.6, fat_g: 0.4, carbs_g: 43 },
                { food_name: 'Feijão', portion_g: 100, kcal: 77, protein_g: 5, fat_g: 0.5, carbs_g: 14 },
            ],
            total_kcal: 272,
        };
        setItems(mockData.items);
        setLoading(false);
    }, [imageUri]);

    const handleSave = () => {
        try {
            saveMeal(items, imageUri);
            Alert.alert('Salvo!');
            router.replace('/');
        } catch (e) {
            Alert.alert('Erro ao salvar');
        }
    };

    if (loading) return <Text>Analisando imagem...</Text>;

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.foodName}>{item.food_name}</Text>
                        <Text>{item.portion_g}g - {item.kcal} kcal</Text>
                    </View>
                )}
            />
            <Text style={styles.total}>
                Total: {items.reduce((s, i) => s + i.kcal, 0)} kcal
            </Text>
            <Button title="Salvar Refeição" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
    foodName: { fontSize: 18, fontWeight: 'bold' },
    total: { fontSize: 20, marginVertical: 15, textAlign: 'center' },
});
