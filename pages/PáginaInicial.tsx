import React from 'react';
import { View, Image, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  InitialPage: undefined;
  LoginPage: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'InitialPage'>;

export function PaginaInicial() {
  const navigation = useNavigation<InitialPageNavigationProp>();

  return (
    <View style={{ padding: 20, flex: 1, justifyContent : "center", alignItems: "center" }}>
      <Image 
        source={require('../assets/logo.png')} 
        style={{ width: 200, height: 200 }}
      />

      <Button  title='Ir para página de login' onPress={() => navigation.navigate("LoginPage")}   >

      </Button>
     
      
    </View>
  );
}