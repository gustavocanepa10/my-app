// database.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openDb() {
  return open({
    filename: './eventcheck.db',
    driver: sqlite3.Database
  }).then(async (db) => {
    await db.exec('PRAGMA foreign_keys = ON;');
    
    // ATUALIZADO: Corrigido o nome da coluna para `password_hash`
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userName TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL 
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        manualLocation TEXT,
        gpsLocation TEXT,
        imageUrl TEXT,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log("Banco de dados 'eventcheck.db' pronto.");
    return db;
  });
}

module.exports = openDb;