// pages/TeladeCadastro.tsx - VERSÃO ATUALIZADA
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../database/AuthContext'; 

type RootStackParamList = {
  TeladeLogin: undefined;
  TeladeCadastro: undefined;
};

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeladeCadastro'>;

export function TeladeCadastro() {
  const navigation = useNavigation<CadastroScreenNavigationProp>();
  const auth = useAuth();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!userName.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas não conferem', 'As senhas digitadas não são iguais.');
      return;
    }
    
    // Chama a função de registro do contexto, que se comunica com o backend
    const success = await auth.register(userName, password);

    if (success) {
      // O AuthContext já mostra o alerta de sucesso. Apenas navegamos.
      navigation.replace('TeladeLogin');
    }
  };

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
        editable={!auth.isLoadingAuth}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!auth.isLoadingAuth}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!auth.isLoadingAuth}
      />

      <TouchableOpacity
        style={auth.isLoadingAuth ? styles.buttonDisabled : styles.button}
        onPress={handleRegister}
        disabled={auth.isLoadingAuth}
      >
        {auth.isLoadingAuth ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('TeladeLogin')} 
        disabled={auth.isLoadingAuth}
      >
        <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Seus estilos originais. Mantenha-os no final do arquivo.
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
    input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    buttonDisabled: { backgroundColor: '#A9A9A9', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    loginLink: { marginTop: 15, alignItems: 'center' },
    loginLinkText: { color: '#007BFF', fontSize: 16 },
});