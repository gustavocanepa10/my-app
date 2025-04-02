import {Text, View, TextInput, TextInputScrollEventData, Button} from "react-native"
import { Controller, useForm } from "react-hook-form";
import DatePicker from 'react-native-date-picker';

export function Events() {

    const {control, handleSubmit} = useForm()


    return (
        <View style = {{padding: 20, flex : 1, justifyContent : "center", gap : 16, alignItems : "center" }}>

        <Text style = {{fontSize : 24}} >
            CRIAR EVENTO
        </Text>

        <Text style = {{fontSize : 16}}>

            Acrescente as informações do seu evento

        </Text>

        <View style={{  flex : 1, alignItems : "center", gap : 12 }}>
        <Text>
            Nome 
        </Text>
        <Controller
        name="EventName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width : 230, height: 45, borderRadius : 8 }}
            placeholder="Digite seu nome de usuário"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

        <Text>
            Data
        </Text>
        <Controller
        name="date"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
          
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width : 230, height: 45, borderRadius : 8 }}
            placeholder="Digite a data do evento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

        <Text>
            Hora
        </Text>
        <Controller
        name="hour"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
          
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width : 230, height: 45, borderRadius : 8 }}
            placeholder="Digite a data do evento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

        <Text>
            Categoria
        </Text>
        <Controller
        name="hour"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
          
            style={{ borderWidth: 1, padding: 10, marginBottom: 10, width : 230, height: 45, borderRadius : 8 }}
            placeholder="Digite a data do evento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />    


        <Button title="Criar Evento"/>

        


        </View>
        


        


        

        </View>
        
    )
}