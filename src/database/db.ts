import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

function getDatabase(): SQLite.SQLiteDatabase {
    if (!db) {
        db = SQLite.openDatabaseSync('caloria.db');

        // Criação das tabelas usando runSync (compatível com todas as versões)
        db.runSync(`
      CREATE TABLE IF NOT EXISTS Meal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datetime TEXT NOT NULL,
        image_path TEXT,
        total_kcal REAL,
        notes TEXT
      );
    `);

        db.runSync(`
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

export const getTodayTotalKcal = (): number => {
    const database = getDatabase();
    const result = database.getFirstSync<{ total: number }>(
        "SELECT COALESCE(SUM(total_kcal), 0) as total FROM Meal WHERE date(datetime) = date('now')"
    );
    return result?.total ?? 0;
};

export const saveMeal = (items: any[], imagePath?: string): void => {
    const database = getDatabase();
    const datetime = new Date().toISOString();
    const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
    const notes = items.map(i => `${i.food_name} (${i.portion_g}g)`).join(', ');

    const insertMeal = database.prepareSync(
        'INSERT INTO Meal (datetime, image_path, total_kcal, notes) VALUES (?, ?, ?, ?)'
    );
    const result = insertMeal.executeSync([datetime, imagePath || null, totalKcal, notes]);
    const mealId = result.lastInsertRowId;

    const insertItem = database.prepareSync(
        'INSERT INTO MealItem (meal_id, food_name, portion_g, kcal, protein_g, fat_g, carbs_g) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    for (const item of items) {
        insertItem.executeSync([mealId, item.food_name, item.portion_g, item.kcal, item.protein_g, item.fat_g, item.carbs_g]);
    }
};

export const getMeals = (): any[] => {
    const database = getDatabase();
    return database.getAllSync<any>('SELECT * FROM Meal ORDER BY datetime DESC LIMIT 30');
};
