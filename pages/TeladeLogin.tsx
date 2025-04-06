import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';

type RootStackParamList = {
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos : undefined
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

    
      navigation.navigate("ListadeEventos")

   
      

    

       
   
    
  };

  return (


    <View style={styles.container}>

      

      <Image 
              source={require('../assets/logo4.png')} 
              style={{ width: 200, height: 150, marginBottom : 10, alignSelf : "center", marginLeft : 9 }}
            />
        

      

      <View style = {styles.containerinput}>

          <Text style={styles.title}>Faça seu login</Text>

          <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          placeholderTextColor="#999"
          />

        <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor="#999"
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



      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : 40,
    backgroundColor: '#FFF',
    alignItems : "center",
    gap : "4%"
    
  },
  containerinput : {
    flex : 1,
    
    alignItems : "center",
    width : "100%",

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
    width : "80%"
    
  },
  loginButton: {
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width : "80%"
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
    width : "80%"
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});