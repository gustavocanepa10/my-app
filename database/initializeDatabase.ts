// initializeDatabase.ts
import { type SQLiteDatabase } from "expo-sqlite";

// Definição dos tipos
export type User = {
  id: number;
  userName: string;
};

export type EventDbEntry = {
  id: number;
  name: string;
  date: string;
  category: string;
  description?: string;
  manualLocation: string;
  gpsLocation?: string;
  imageUrl?: string;
  userId: number;
};

// SQL para criar as tabelas
const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL -- ALTERADO: Nome da coluna para consistência
  );
`;

const createEventsTableSQL = `
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE -- Adicionado ON DELETE CASCADE
  );
`;

export async function initializeDataBase(database: SQLiteDatabase) {
  // Executa a criação das tabelas dentro de uma transação
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    ${createUserTableSQL}
    ${createEventsTableSQL}
  `);
  console.log("Tabelas users e events inicializadas/verificadas.");
}