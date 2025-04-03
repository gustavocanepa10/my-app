import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';

type RootStackParamList = {
  TeladeLogin: undefined;
  Formulario: undefined;
};

export function TeladeLogin() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Verifica se a biometria está disponível
  useEffect(() => {
    async function checkBiometrics() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && hasBiometrics);
    }
    checkBiometrics();
  }, []);

  // Função para autenticação com biometria
  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        navigation.navigate('Formulario'); // Navega para criar evento
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    }
  };

  // Função para login tradicional (simplificado)
  const handleLogin = () => {
    // Aqui você implementaria a lógica de login normal
    Alert.alert('Login', 'Implemente sua lógica de login aqui');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça seu login</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* MOSTRA O BOTÃO DE BIOMETRIA SOMENTE SE DISPONÍVEL */}
      {biometricAvailable && (
        <TouchableOpacity 
          style={styles.biometricButton}
          onPress={handleBiometricAuth}
        >
          <MaterialIcons name="fingerprint" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Entrar com Biometria</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  biometricButton: {
    height: 50,
    backgroundColor: '#34C759',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});