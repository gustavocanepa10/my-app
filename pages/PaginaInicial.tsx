import React from 'react';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'PaginaInicial'>;

export function PaginaInicial() {
  const navigation = useNavigation<InitialPageNavigationProp>();

  React.useEffect(() => {
    // Redireciona diretamente para a tela de login após um breve delay
    const timer = setTimeout(() => {
      navigation.replace('TeladeLogin');
    }, 2000);

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
    </View>
  );
}