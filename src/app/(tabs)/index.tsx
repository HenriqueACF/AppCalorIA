import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getTodayTotalKcal } from '../../database/db';

export default function HomeScreen() {
  const [totalKcal, setTotalKcal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadTodayTotal();
  }, []);

  const loadTodayTotal =  () => {
    const total =  getTodayTotalKcal();
    setTotalKcal(total);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Resumo do Dia</Text>
        <Text style={styles.kcal}>{totalKcal} kcal</Text>
        <Text style={styles.sub}>Meta: 2000 kcal</Text>
        <Button title="Registrar Refeição" onPress={() => router.push('/camera')} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  kcal: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50' },
  sub: { fontSize: 16, color: '#666', marginBottom: 30 },
});
