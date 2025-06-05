
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDatabase } from '../database/dataBaseContext'; 
import * as Crypto from 'expo-crypto';



type RootStackParamList = {
  TeladeLogin: undefined;
  TeladeCadastro: undefined;
 
};

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeladeCadastro'>;

export function TeladeCadastro() {
  const navigation = useNavigation<CadastroScreenNavigationProp>();
  
   const { db } = useDatabase(); 
  // const auth = useAuth(); // Descomentar depois se fizer auto-login

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

   const handleRegister = async () => {
    console.log('[handleRegister] Função iniciada.');
    setIsLoading(true);

    if (!userName.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      setIsLoading(false);
      console.log('[handleRegister] Validação de campos obrigatórios falhou.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas não conferem', 'As senhas digitadas não são iguais.');
      setIsLoading(false);
      console.log('[handleRegister] Validação de senhas não conferem falhou.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      console.log('[handleRegister] Validação de tamanho da senha falhou.');
      return;
    }
    if (!db) {
      Alert.alert('Erro', 'Banco de dados não disponível. Tente novamente mais tarde.');
      setIsLoading(false);
      console.log('[handleRegister] Banco de dados não disponível.');
      return;
    }

    console.log('[handleRegister] Validações passaram. Entrando no bloco try...');
    try {
      console.log('[handleRegister] Verificando se usuário existe para:', userName.trim());
      const existingUser = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM users WHERE userName = ?;',
        [userName.trim()]
      );
      console.log('[handleRegister] Resultado da verificação de usuário existente:', existingUser);

      if (existingUser) {
        Alert.alert('Usuário já existe', 'Este nome de usuário já está em uso. Por favor, escolha outro.');
        console.log('[handleRegister] Usuário já existe.');
        // O finally cuidará do setIsLoading(false)
        return;
      }

      console.log('[handleRegister] Preparando para hashear a senha...');
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      console.log('[handleRegister] Senha hasheada com sucesso.');

      console.log('[handleRegister] Preparando para inserir usuário no banco...');
      await db.runAsync(
        'INSERT INTO users (userName, password) VALUES (?, ?);',
        [userName.trim(), hashedPassword]
      );
      console.log('[handleRegister] Usuário inserido no banco com sucesso.');

      Alert.alert(
        'Cadastro Realizado!',
        'Sua conta foi criada com sucesso. Você será redirecionado para a tela de login.',
        [{ text: 'OK', onPress: () => navigation.replace('TeladeLogin') }]
      );
      setUserName('');
      setPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error("[handleRegister] ERRO NO BLOCO CATCH:", error);
      console.log("[handleRegister] Detalhes do erro:", JSON.stringify(error, null, 2));
      Alert.alert('Erro no Cadastro', `Não foi possível criar a conta: ${error.message || 'Erro desconhecido'}`);
    } finally {
      console.log('[handleRegister] Executando bloco finally.');
      setIsLoading(false);
    }

}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        placeholderTextColor="#999"
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        style={isLoading ? styles.buttonDisabled : styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('TeladeLogin')} 
        disabled={isLoading}
      >
        <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007BFF',
    fontSize: 16,
  },
});