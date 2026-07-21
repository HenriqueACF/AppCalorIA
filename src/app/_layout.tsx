import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="camera" options={{ title: 'Fotografar Refeição' }} />
                <Stack.Screen name="meal-detail" options={{ title: 'Detalhes da Refeição' }} />
            </Stack>
        </>
    );
}
