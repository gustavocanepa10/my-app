import { View, Text, TextInput, Button, Pressable, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  InitialPage: undefined;
  LoginPage: undefined;
};


type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'TelaLogin'>;


export function TeladeLogin() {
  const navigation = useNavigation<InitialPageNavigationProp>()
  const { control, handleSubmit } = useForm();

  function onSubmit(data : any) {
    
    
    console.log("Dados do formulário:", data);

  }

  return (
    <View style={{ padding: 20, flex : 1, justifyContent : "center", gap : 12 }}>
      <Text>
        
      </Text>
      <Text>Usuário</Text>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width : 250, height: 45 }}
            placeholder="Digite seu nome"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      
      <Text>Senha</Text>
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            placeholder="Digite sua senha"
            secureTextEntry={true} // Oculta o texto
            value={value}
            onChangeText={onChange}
          />
        )}
      />

<TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text onPress={() => navigation.navigate('Events')} style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}
