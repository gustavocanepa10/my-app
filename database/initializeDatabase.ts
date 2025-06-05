// No seu arquivo de setup do banco (ex: database.ts, db.ts, ou onde estiver initializeDataBase)
import { type SQLiteDatabase } from "expo-sqlite";

// Schema da tabela users (como antes, mas garanta que está presente)
const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL -- LEMBRETE: Idealmente, isso deveria ser um hash
  );
`;

// Novo schema da tabela events (conforme concordamos)
const createEventsTableSQL = `
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,          -- Armazenará a data como string (ex: "DD/MM/AAAA")
    category TEXT NOT NULL,
    description TEXT,
    manualLocation TEXT,
    gpsLocation TEXT,            -- Pode ser NULL
    imageUrl TEXT,               -- Pode ser NULL
    userId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) -- Chave estrangeira para users.id
  );
`;

export async function initializeDataBase(database: SQLiteDatabase) {
  await database.execAsync(`
    ${createUserTableSQL}
    ${createEventsTableSQL}
  `);
  console.log("Tabelas users e events inicializadas/verificadas.");
}

// Definição do tipo EventDbEntry (pode colocar aqui ou em um arquivo de tipos separado)
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

// (Opcional) Definição do tipo User (pode colocar aqui ou em um arquivo de tipos separado)
export type User = {
    id: number;
    userName: string;
    // Não inclua password aqui por segurança ao buscar dados do usuário para o app
};