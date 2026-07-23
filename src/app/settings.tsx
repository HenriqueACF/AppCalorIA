import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getDailyGoal, setDailyGoal } from '../database/db';

export default function SettingsScreen() {
    const router = useRouter();
    const [goal, setGoal] = useState(String(getDailyGoal()));

    const handleSave = () => {
        const value = Number(goal);
        if (!Number.isFinite(value) || value <= 0) {
            Alert.alert('Valor inválido', 'Digite um número maior que zero.');
            return;
        }
        setDailyGoal(value);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Meta diária de calorias (kcal)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={goal}
                onChangeText={setGoal}
            />
            <Button title="Salvar" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        marginBottom: 20,
    },
});
