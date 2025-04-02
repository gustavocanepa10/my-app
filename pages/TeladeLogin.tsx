import { View, Text, TextInput, Alert, Button, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";

type RootStackParamList = {
  PaginaInicial: undefined;
  Events: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, "PaginaInicial">;

export function TeladeLogin() {
  const navigation = useNavigation<InitialPageNavigationProp>();
  const { control } = useForm();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function verifyAvailableAuthentication() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    console.log("Dispositivo compatível:", compatible);

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log("Tipos de autenticação disponíveis:", types.map(type => LocalAuthentication.AuthenticationType[type]));
  }

  async function handleAuthentication() {
    try {
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isBiometricEnrolled) {
        Alert.alert("Login", "Nenhuma biometria encontrada");
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se com biometria",
        fallbackLabel: "Use a senha",
      });

      if (authResult.success) {
        setIsAuthenticated(true);
        Alert.alert("Sucesso", "Autenticação realizada com sucesso!");
      } else {
        Alert.alert("Erro", "Falha na autenticação.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro durante a autenticação.");
      console.error(error);
    }
  }

  useEffect(() => {
    verifyAvailableAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entre com a sua conta</Text>

      <Text style={styles.label}>Nome de usuário</Text>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Digite seu nome de usuário" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Senha</Text>
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry value={value} onChangeText={onChange} />
        )}
      />

      <Text>Usuário conectado: {isAuthenticated ? "Sim" : "Não"}</Text>

      <Button title="Entrar" onPress={handleAuthentication} />

      {isAuthenticated && <Button title="Entrar" onPress={() => navigation.navigate("Formulario")} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    padding: 20,
    fontSize: 24,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: 230,
    height: 45,
  },
});
