import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';

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
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    }
  };

  const handleLogin = () => {
    navigation.navigate("ListadeEventos");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo4.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Faça seu login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  logo: {
    width: 200,
    height: 180,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '85%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    width: '85%',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  biometricButton: {
    height: 50,
    width: '85%',
    backgroundColor: '#34C759',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});