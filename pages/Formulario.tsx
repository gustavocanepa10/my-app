import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

type EventData = {
  name: string;
  date: string;
  hour: string;
  category: string;
};

type Props = {
  handleEvents: (event: EventData) => void;
};

export function FormEvents({ handleEvents }: Props) {
  const { control, handleSubmit } = useForm<EventData>();

  const navigation = useNavigation()

  const onSubmit = (data: EventData) => {
    handleEvents(data); 
    navigation.navigate('ListadeEventos'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR EVENTO</Text>
      <Text style={styles.subtitle}>Acrescente as informações do seu evento</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome</Text>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Nome é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do evento"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Data</Text>
        <Controller
          name="date"
          control={control}
          rules={{ required: "Data é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Digite a data (DD/MM/AAAA)"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Hora</Text>
        <Controller
          name="hour"
          control={control}
          rules={{ required: "Hora é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Digite a hora (HH:MM)"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Categoria</Text>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Categoria é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Digite a categoria"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <Button 
            title="Criar Evento" 
            onPress={handleSubmit(onSubmit)} 

          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    gap: 16,
    alignItems: "center", 
    fontStyle : "italic"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#666"
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 4,
    fontWeight: "500"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: "90%",
    height: 45,
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    marginTop: 20,
    width: "90%"
  }
});