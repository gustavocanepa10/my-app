import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'PaginaInicial'>;

export function PaginaInicial() {
  const navigation = useNavigation<InitialPageNavigationProp>();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  async function handleBiometricAuth() {
    try {
      // Verifica se o dispositivo tem hardware de biometria
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Erro', 'Seu dispositivo não suporta autenticação biométrica');
        navigation.replace('TeladeLogin');
        return;
      }

      // Verifica se há biometria cadastrada
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo');
        navigation.replace('TeladeLogin');
        return;
      }

      // Tenta autenticar com biometria
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar',
        fallbackLabel: 'Usar senha',
      });

      if (authResult.success) {
        // Autenticação bem-sucedida - navega para a tela principal
        navigation.replace('Formulario');
      } else {
        // Se falhar, vai para tela de login normal
        navigation.replace('TeladeLogin');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      navigation.replace('TeladeLogin');
    } finally {
      setIsAuthenticating(false);
    }
  }

  useEffect(() => {
    // Tenta autenticar automaticamente após 1 segundo (tempo para a logo aparecer)
    const timer = setTimeout(() => {
      handleBiometricAuth();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#fff',
      padding: 20,
      gap: 20
    }}>
      <Image 
        source={require('../assets/logo4.png')} 
        style={{ width: 200, height: 200 }}
      />
      
      {isAuthenticating && (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Autenticando com biometria...</Text>
        </>
      )}
    </View>
  );
}