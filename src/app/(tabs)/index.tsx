import { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getTodayTotalKcal, getDailyGoal } from '../../database/db';

export default function HomeScreen() {
    const [totalKcal, setTotalKcal] = useState(0);
    const [goal, setGoal] = useState(2000);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setTotalKcal(getTodayTotalKcal());
            setGoal(getDailyGoal());
        }, [])
    );

    const remaining = goal - totalKcal;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumo do Dia</Text>
            <Text style={styles.kcal}>{totalKcal} kcal</Text>
            <Text style={styles.sub}>Meta: {goal} kcal</Text>
            <Text style={styles.sub}>
                {remaining >= 0 ? `Restam ${remaining} kcal` : `${-remaining} kcal acima da meta`}
            </Text>
            <Button title="Registrar Refeição" onPress={() => router.push('/camera')} />
            <View style={{ height: 12 }} />
            <Button title="Configurações" onPress={() => router.push('/settings')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 10 },
    kcal: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50' },
    sub: { fontSize: 16, color: '#666', marginBottom: 8 },
});
