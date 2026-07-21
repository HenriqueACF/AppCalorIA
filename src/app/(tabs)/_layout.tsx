import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Hoje' }} />
            <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
        </Tabs>
    );
}
