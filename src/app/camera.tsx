import { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { useMealStore, PendingImage } from '../store/mealStore';

export default function CameraScreen() {
    const [asset, setAsset] = useState<PendingImage | null>(null);
    const router = useRouter();

    const toPending = (a: ImagePicker.ImagePickerAsset): PendingImage => ({
        uri: a.uri,
        base64: a.base64 ?? '',
        mediaType: a.uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
    });

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Habilite o acesso à câmera nas configurações.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            base64: true,
        });
        if (!result.canceled) setAsset(toPending(result.assets[0]));
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
            base64: true,
        });
        if (!result.canceled) setAsset(toPending(result.assets[0]));
    };

    const analyzeMeal = () => {
        if (!asset) return;
        useMealStore.getState().setPending(asset);
        router.push('/meal-detail');
    };

    return (
        <View style={styles.container}>
            {asset ? (
                <Image source={{ uri: asset.uri }} style={styles.preview} />
            ) : (
                <View style={styles.placeholder}>
                    <Text>Nenhuma foto</Text>
                </View>
            )}
            <Button title="Tirar Foto" onPress={takePhoto} />
            <Button title="Galeria" onPress={pickFromGallery} />
            {asset && <Button title="Analisar" onPress={analyzeMeal} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    preview: { width: 300, height: 300, marginBottom: 20, borderRadius: 10 },
    placeholder: { width: 300, height: 300, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
});
