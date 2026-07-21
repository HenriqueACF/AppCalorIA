export interface MealItemInput {
    food_name: string;
    portion_g: number;
    kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
}

export interface MealItem extends MealItemInput {
    id: number;
    meal_id: number;
}

export interface Meal {
    id: number;
    datetime: string;
    image_path: string | null;
    total_kcal: number;
    notes: string | null;
}
