import * as SQLite from 'expo-sqlite';

let db: SQLite.WebSQLDatabase;

export const initDatabase = async () => {
    db = SQLite.openDatabase('nutriai.db');
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Meal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datetime TEXT NOT NULL,
        image_path TEXT,
        total_kcal REAL,
        notes TEXT
      );`
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS MealItem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_id INTEGER,
        food_name TEXT,
        portion_g REAL,
        kcal REAL,
        protein_g REAL,
        fat_g REAL,
        carbs_g REAL,
        FOREIGN KEY (meal_id) REFERENCES Meal(id) ON DELETE CASCADE
      );`
        );
    });
};

export const getTodayTotalKcal = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT COALESCE(SUM(total_kcal), 0) as total FROM Meal WHERE date(datetime) = date('now')",
                [],
                (_, result) => resolve(result.rows.item(0).total),
                (_, error) => { reject(error); return false; }
            );
        });
    });
};

export const saveMeal = (items: any[], imagePath?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const datetime = new Date().toISOString();
        const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Meal (datetime, image_path, total_kcal) VALUES (?, ?, ?)',
                [datetime, imagePath || null, totalKcal],
                (_, result) => {
                    const mealId = result.insertId;
                    items.forEach(item => {
                        tx.executeSql(
                            'INSERT INTO MealItem (meal_id, food_name, portion_g, kcal, protein_g, fat_g, carbs_g) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [mealId, item.food_name, item.portion_g, item.kcal, item.protein_g, item.fat_g, item.carbs_g]
                        );
                    });
                    resolve();
                },
                (_, error) => { reject(error); return false; }
            );
        });
    });
};

export const getMeals = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Meal ORDER BY datetime DESC LIMIT 30',
                [],
                (_, result) => resolve(result.rows._array),
                (_, error) => { reject(error); return false; }
            );
        });
    });
};
