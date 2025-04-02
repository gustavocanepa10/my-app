import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  InitialPage: undefined;
  LoginPage: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'TelaInicial'>;

export function PaginaInicial() {
  const navigation = useNavigation<InitialPageNavigationProp>();

  
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('TeladeLogin'); 
    }, 5000);
  }, []);

  return (
    <View style={{ padding: 20, flex : 1, justifyContent : "center", gap : 12, alignItems : "center" }}>
      
      <Image 
        source={require('../assets/logo4.png')} 
        style={{ width: 200, height: 200, backgroundColor : "none" }}
      />
    </View>
  );
}
