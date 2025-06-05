import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import { LoginStyles } from '../styles/TeladeLoginStyles'; // Importa os estilos do arquivo separado

type RootStackParamList = {
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
};

export function TeladeLogin() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && hasBiometrics);
    }
    checkBiometrics();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        navigation.navigate('ListadeEventos'); 
      }
    } catch (error) {
      console.error('Falha na autenticação biométrica:', error); 
    }
  };

  const handleLogin = () => {
    navigation.navigate("ListadeEventos");
  };

  return (
    <View style={LoginStyles.container}> 
      <View style={LoginStyles.logoContainer}> 
        <Image 
          source={require('../assets/logo4.png')} 
          style={LoginStyles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.title}>Faça seu login</Text>

        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#999"
          />
        </View>

        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Senha"
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={LoginStyles.loginButton} 
          onPress={handleLogin}
        >
          <Text style={LoginStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {biometricAvailable && (
          <TouchableOpacity 
            style={LoginStyles.biometricButton}
            onPress={handleBiometricAuth}
          >
            <MaterialIcons name="fingerprint" size={24} color="#FFF" />
            <Text style={LoginStyles.buttonText}>Entrar com Biometria</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
