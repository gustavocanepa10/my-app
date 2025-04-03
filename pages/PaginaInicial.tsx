import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'PaginaInicial'>;

export function PaginaInicial() {
  const navigation = useNavigation<InitialPageNavigationProp>();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  async function handleBiometricAuth() {
    try {

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Erro', 'Seu dispositivo não suporta autenticação biométrica');
        navigation.replace('TeladeLogin');
        return;
      }

      
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo');
        navigation.replace('TeladeLogin');
        return;
      }

      
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar',
        fallbackLabel: 'Usar senha',
      });

      if (authResult.success) {
      
        navigation.replace('ListadeEventos');
      } else {
        
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