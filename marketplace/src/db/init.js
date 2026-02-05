import dbPromise from './config';

const initDatabase = async () => {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      bannedBy TEXT
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      sellerId INTEGER,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (sellerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      items TEXT,
      totalAmount REAL,
      status TEXT DEFAULT 'pending',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Insert default admin if not exists
  const adminExists = await db.get('SELECT 1 FROM admins WHERE username = ?', ['admin']);
  if (!adminExists) {
    await db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', 'admin123']);
  }
};

initDatabase().catch(console.error);
