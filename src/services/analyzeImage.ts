import axios from 'axios';
import { API_URL } from '../config';
import { MealItemInput } from '@/types/meal';

export async function analyzeImage(
    imageBase64: string,
    mediaType: 'image/jpeg' | 'image/png'
): Promise<MealItemInput[]> {
    const { data } = await axios.post<{ items: MealItemInput[] }>(
        `${API_URL}/api/analyze`,
        { imageBase64, mediaType },
        { timeout: 60000 }
    );

    return data.items ?? [];
}
