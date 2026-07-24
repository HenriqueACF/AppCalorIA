import { create } from 'zustand';

export type PendingImage = {
    base64: string;
    mediaType: 'image/jpeg' | 'image/png';
    uri: string;
};

type MealStore = {
    pending: PendingImage | null;
    setPending: (p: PendingImage) => void;
    clearPending: () => void;
};

export const useMealStore = create<MealStore>((set) => ({
    pending: null,
    setPending: (pending) => set({ pending }),
    clearPending: () => set({ pending: null }),
}));
