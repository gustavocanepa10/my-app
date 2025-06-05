
import React, {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialIcons } from "@expo/vector-icons";
import { LoginStyles } from "../styles/TeladeLoginStyles";

import { useAuth } from "../database/AuthContext";

type RootStackParamList = {
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
  TeladeCadastro: undefined
  
};

export function TeladeLogin() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const auth = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
    }
    checkBiometrics();
  }, []);

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha o nome de usuário e a senha."
      );
      return;
    }

    try {
      const success = await auth.login(userName, password);
      if (success) {
        navigation.replace("ListadeEventos");
      } else {
        Alert.alert("Falha no Login", "Nome de usuário ou senha inválidos.");
      }
    } catch (error) {

      console.error("Erro na tentativa de login:", error);
      Alert.alert(
        "Erro no Login",
        "Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes."
      );
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para continuar",
      });

      if (result.success) {
        if (auth.currentUser) {
          navigation.replace("ListadeEventos");
        } else {
          Alert.alert(
            "Biometria Concluída",
            "Autenticação local bem-sucedida. Faça login com suas credenciais para acessar os dados da sua conta."
          );
        }
      }
    } catch (error) {
      console.error("Falha na autenticação biométrica:", error);
      Alert.alert(
        "Erro na Biometria",
        "Não foi possível autenticar usando biometria."
      );
    }
  };

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.logoContainer}>
        <Image
          source={require("../assets/logo4.png")}
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
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            editable={!auth.isLoadingAuth}
          />
        </View>

        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Senha"
            secureTextEntry
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            editable={!auth.isLoadingAuth}
          />
        </View>

        <TouchableOpacity
          style={
            auth.isLoadingAuth
              ? LoginStyles.loginButtonDisabled
              : LoginStyles.loginButton
          }
          onPress={handleLogin}
          disabled={auth.isLoadingAuth}
        >
          {auth.isLoadingAuth ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={LoginStyles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {biometricAvailable && (
          <TouchableOpacity
            style={
              auth.isLoadingAuth
                ? LoginStyles.loginButtonDisabled
                : LoginStyles.biometricButton
            } // Use um estilo apropriado para desabilitado se tiver
            onPress={handleBiometricAuth}
            disabled={auth.isLoadingAuth}
          >
            <MaterialIcons name="fingerprint" size={24} color="#FFF" />
            <Text style={LoginStyles.buttonText}>Entrar com Biometria</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={LoginStyles.registerButton} // Você precisará criar este estilo
          onPress={() => navigation.navigate('TeladeCadastro')} // Navega para a tela de cadastro
          disabled={auth.isLoadingAuth} // Pode desabilitar durante o login também
        >
          <Text style={LoginStyles.registerButtonText}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
} 
