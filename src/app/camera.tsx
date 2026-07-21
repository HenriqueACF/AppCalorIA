import { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const router = useRouter();

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Habilite o acesso à câmera nas configurações.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const pickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Habilite o acesso à galeria nas configurações.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const analyzeMeal = () => {
        if (!imageUri) return;
        router.push({ pathname: '/meal-detail', params: { imageUri } });
    };

    return (
        <View style={styles.container}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} />
            ) : (
                <View style={styles.placeholder}>
                    <Text>Nenhuma foto</Text>
                </View>
            )}
            <Button title="Tirar Foto" onPress={takePhoto} />
            <Button title="Galeria" onPress={pickFromGallery} />
            {imageUri && <Button title="Analisar" onPress={analyzeMeal} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    preview: { width: 300, height: 300, marginBottom: 20, borderRadius: 10 },
    placeholder: { width: 300, height: 300, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
});
