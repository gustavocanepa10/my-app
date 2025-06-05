// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './initializeDatabase'; 
import { useDatabase } from './dataBaseContext'; 
import * as Crypto from 'expo-crypto'; 



interface AuthContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  login: (userName: string, passwordAttempt: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { db, isLoading: isLoadingDb } = useDatabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => { if (!isLoadingDb) {
    console.log('[AuthContext] useEffect: DB pronto (isLoadingDb=false). Definindo isLoadingAuth para false.');
    setIsLoadingAuth(false); // Define como false quando o DB está pronto
  } else {
    console.log('[AuthContext] useEffect: DB ainda não está pronto (isLoadingDb=true). isLoadingAuth permanece true.');
  } }, [isLoadingDb]);

  const login = async (userName: string, passwordAttempt: string): Promise<boolean> => {
    if (!db) {
      console.error("AuthContext: Banco de dados não está pronto para login.");
      return false;
    }
    setIsLoadingAuth(true);
     console.log('[AuthContext] login: isLoadingAuth definido como true');
    try {
      console.log(`Tentando login para: ${userName}`);

      // 1. Buscar o usuário pelo nome de usuário para obter o HASH da senha armazenada
      const userFromDb = await db.getFirstAsync<{ id: number, userName: string, password_hash: string }>( // Supondo que a coluna se chame 'password' e contenha o hash
        'SELECT id, userName, password as password_hash FROM users WHERE userName = ? LIMIT 1;',
        [userName.trim()]
      );

      if (userFromDb && userFromDb.password_hash) {
        // 2. Criar o hash da senha que o usuário tentou logar
        const hashedAttempt = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          passwordAttempt
        );

        // 3. Comparar os hashes
        if (hashedAttempt === userFromDb.password_hash) {
          console.log("Login bem-sucedido (hashes conferem):", { id: userFromDb.id, userName: userFromDb.userName });
          setCurrentUser({ id: userFromDb.id, userName: userFromDb.userName });
          setIsLoadingAuth(false);
          return true;
        }
      }

      // Se o usuário não foi encontrado ou os hashes não conferem
      console.log("Falha no login: usuário ou senha inválidos (ou hash não confere).");
      setCurrentUser(null);
      setIsLoadingAuth(false);
      return false;

    } catch (error) {
      console.error("Erro durante o login:", error);
      console.error("[AuthContext] Erro durante o login:", error);
      setCurrentUser(null);
      setIsLoadingAuth(false);
      return false;
    }
   finally {
    console.log('[AuthContext] login: Executando finally, isLoadingAuth será false');
    setIsLoadingAuth(false); // << GARANTA QUE ESTÁ AQUI
  }
  };


  const logout = async (): Promise<void> => {
    console.log("Logout");
    setCurrentUser(null);

  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, login, logout }}>
      {!isLoadingDb && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};