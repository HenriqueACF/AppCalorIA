import * as SQLite from 'expo-sqlite';
import { Meal, MealItem, MealItemInput } from '@/types/meal';

let db: SQLite.SQLiteDatabase | null = null;

const migrations: ((database: SQLite.SQLiteDatabase) => void)[] = [
    // 0 -> 1: schema inicial
    (database) => {
        database.runSync(`
      CREATE TABLE IF NOT EXISTS Meal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datetime TEXT NOT NULL,
        image_path TEXT,
        total_kcal REAL,
        notes TEXT
      );
    `);
        database.runSync(`
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
    },
    // 1 -> 2: configurações (meta diária)
    (database) => {
        database.runSync(`
      CREATE TABLE Settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
        database.runSync(
            `INSERT INTO Settings (key, value) VALUES ('daily_goal_kcal', '2000')`
        );
    },
];

function runMigrations(database: SQLite.SQLiteDatabase): void {
    const { user_version } = database.getFirstSync<{ user_version: number }>(
        'PRAGMA user_version'
    ) ?? { user_version: 0 };

    for (let v = user_version; v < migrations.length; v++) {
        database.withTransactionSync(() => {
            migrations[v](database);
            database.execSync(`PRAGMA user_version = ${v + 1}`);
        });
    }
}

function getDatabase(): SQLite.SQLiteDatabase {
    if (!db) {
        db = SQLite.openDatabaseSync('caloria.db');
        db.execSync('PRAGMA foreign_keys = ON;');
        runMigrations(db);
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

export const saveMeal = (items: MealItemInput[], imagePath?: string): void => {
    const database = getDatabase();
    const datetime = new Date().toISOString();
    const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
    const notes = items.map((i) => `${i.food_name} (${i.portion_g}g)`).join(', ');

    database.withTransactionSync(() => {
        const result = database.runSync(
            'INSERT INTO Meal (datetime, image_path, total_kcal, notes) VALUES (?, ?, ?, ?)',
            [datetime, imagePath ?? null, totalKcal, notes]
        );
        const mealId = result.lastInsertRowId;

        for (const item of items) {
            database.runSync(
                'INSERT INTO MealItem (meal_id, food_name, portion_g, kcal, protein_g, fat_g, carbs_g) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mealId, item.food_name, item.portion_g, item.kcal, item.protein_g, item.fat_g, item.carbs_g]
            );
        }
    });
};

export const getMeals = (limit = 30, offset = 0): Meal[] => {
    const database = getDatabase();
    return database.getAllSync<Meal>(
        'SELECT * FROM Meal ORDER BY datetime DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );
};

export const getMealItems = (mealId: number): MealItem[] => {
    const database = getDatabase();
    return database.getAllSync<MealItem>(
        'SELECT * FROM MealItem WHERE meal_id = ? ORDER BY id',
        [mealId]
    );
};

export const deleteMeal = (mealId: number): void => {
    const database = getDatabase();
    database.runSync('DELETE FROM Meal WHERE id = ?', [mealId]);
};

export const getDailyGoal = (): number => {
    const database = getDatabase();
    const row = database.getFirstSync<{ value: string }>(
        "SELECT value FROM Settings WHERE key = 'daily_goal_kcal'"
    );
    return row ? Number(row.value) : 2000;
};

export const setDailyGoal = (kcal: number): void => {
    const database = getDatabase();
    database.runSync(
        `INSERT INTO Settings (key, value) VALUES ('daily_goal_kcal', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [String(kcal)]
    );
};
