import * as SQLite from 'expo-sqlite';

export type MealItemInput = {
    food_name: string;
    portion_g: number;
    kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
};

export type Meal = {
    id: number;
    datetime: string;
    image_path: string | null;
    total_kcal: number;
    notes: string | null;
};

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
    if (!db) {
        db = await SQLite.openDatabaseAsync('caloria.db');
        await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS Meal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datetime TEXT NOT NULL,
        image_path TEXT,
        total_kcal REAL,
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS MealItem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_id INTEGER,
        food_name TEXT,
        portion_g REAL,
        kcal REAL,
        protein_g REAL,
        fat_g REAL,
        carbs_g REAL,
        FOREIGN KEY (meal_id) REFERENCES Meal(id) ON DELETE CASCADE
      );
    `);
    }
    return db;
}

export const initDatabase = getDb;

export const getTodayTotalKcal = async (): Promise<number> => {
    const database = await getDb();
    const row = await database.getFirstAsync<{ total: number }>(
        "SELECT COALESCE(SUM(total_kcal), 0) as total FROM Meal WHERE date(datetime) = date('now')"
    );
    return row?.total ?? 0;
};

export const saveMeal = async (items: MealItemInput[], imagePath?: string) => {
    const database = await getDb();
    const datetime = new Date().toISOString();
    const totalKcal = items.reduce((s, i) => s + i.kcal, 0);

    await database.withTransactionAsync(async () => {
        const result = await database.runAsync(
            'INSERT INTO Meal (datetime, image_path, total_kcal) VALUES (?, ?, ?)',
            [datetime, imagePath ?? null, totalKcal]
        );
        const mealId = result.lastInsertRowId;
        for (const item of items) {
            await database.runAsync(
                'INSERT INTO MealItem (meal_id, food_name, portion_g, kcal, protein_g, fat_g, carbs_g) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mealId, item.food_name, item.portion_g, item.kcal, item.protein_g, item.fat_g, item.carbs_g]
            );
        }
    });
};

export const getMeals = async (): Promise<Meal[]> => {
    const database = await getDb();
    return database.getAllAsync<Meal>('SELECT * FROM Meal ORDER BY datetime DESC LIMIT 30');
};
