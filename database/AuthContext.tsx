// database/AuthContext.tsx - VERSÃO COMPLETA E ATUALIZADA

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

// Este tipo pode vir do seu arquivo de tipos, se tiver um.
export type User = {
    id: number;
    userName: string;
};

// COLOQUE O IP DA SUA MÁQUINA AQUI!
const API_URL = 'http://192.168.3.111:3000'; 

interface AuthContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  login: (userName: string, passwordAttempt: string) => Promise<boolean>;
  logout: () => void;
  // Adicionamos a função de registro ao contexto para usá-la na tela de cadastro
  register: (userName: string, passwordAttempt: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false); // Este estado agora controla o loading das chamadas de rede

  // --- FUNÇÃO DE LOGIN ATUALIZADA ---
  const login = async (userName: string, passwordAttempt: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim(), password: passwordAttempt }),
      });
      
      const data = await response.json();

      if (!response.ok) { // Trata erros como 401 (Não Autorizado)
        Alert.alert("Falha no Login", data.error || 'Usuário ou senha inválidos.');
        return false;
      }
      
      setCurrentUser({ id: data.id, userName: data.userName });
      return true;

    } catch (error) {
      console.error("Erro de rede no login:", error);
      Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP está correto.");
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // --- NOVA FUNÇÃO DE REGISTRO ---
  const register = async (userName: string, passwordAttempt: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim(), password: passwordAttempt }),
      });
      const data = await response.json();

      if (!response.ok) { // Trata erros como 409 (Conflito - usuário já existe)
        Alert.alert("Falha no Cadastro", data.error || 'Não foi possível criar a conta.');
        return false;
      }

      Alert.alert("Sucesso!", "Sua conta foi criada. Por favor, faça o login.");
      return true;

    } catch (error) {
      console.error("Erro de rede no cadastro:", error);
      Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor.");
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // --- FUNÇÃO DE LOGOUT SIMPLIFICADA ---
  const logout = () => {
    setCurrentUser(null); // Apenas limpa o estado local
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, login, logout, register }}>
      {children}
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