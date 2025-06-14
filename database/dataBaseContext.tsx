// DatabaseProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { initializeDataBase } from './initializeDatabase';

interface DatabaseContextType {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let database: SQLite.SQLiteDatabase | null = null;

    async function setup() {
      try {
        console.log("DatabaseProvider: Abrindo banco de dados...");
        database = SQLite.openDatabaseSync("meuAppDB.db");
        await initializeDataBase(database);
        setDb(database);
        console.log("DatabaseProvider: Banco de dados pronto.");
      } catch (e) {
        console.error("DatabaseProvider: Erro ao inicializar o banco de dados:", e);
      } finally {
        setIsLoading(false);
      }
    }

    setup();

    // ADICIONADO: Função de limpeza para fechar o banco de dados
    return () => {
      if (database) {
        console.log("DatabaseProvider: Fechando a conexão com o banco de dados.");
        database.closeSync();
        setDb(null);
      }
    };
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