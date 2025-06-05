
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { initializeDataBase } from './initializeDatabase'; 
import * as FileSystem from 'expo-file-system';

interface DatabaseContextType {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean; 
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let database: SQLite.SQLiteDatabase;
    async function setup() {
      try {
        console.log("DatabaseProvider: Abrindo e inicializando banco de dados...");
        const dbName = "meuAppDB.db"; // Seu nome de banco
        database = SQLite.openDatabaseSync(dbName);

        // << 2. ADICIONE O LOG DO CAMINHO AQUI >>
        const dbFilePath = FileSystem.documentDirectory + `SQLite/${dbName}`;
        console.log(`[DatabaseProvider] Caminho do arquivo do banco de dados: ${dbFilePath}`);
        // No Android, o FileSystem.documentDirectory geralmente aponta para algo como:
        // file:///data/user/0/host.exp.exponent/files/
        // Então o caminho completo seria file:///data/user/0/host.exp.exponent/files/SQLite/meuAppDB.db

        
        await initializeDataBase(database); 

        setDb(database);
        console.log("DatabaseProvider: Banco de dados pronto e tabelas inicializadas!");
      } catch (e) {
        console.error("DatabaseProvider: Erro ao inicializar o banco de dados:", e);
        
      } finally {
        setIsLoading(false);
      }
    }

    setup();

    
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase deve ser usado dentro de um DatabaseProvider');
  }
  return context;
};