import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { PaginaInicial } from "./pages/PaginaInicial";
import { TeladeLogin } from "./pages/TeladeLogin";
import { FormEvents } from "./pages/Formulario";
import { EventList } from "./pages/Eventos";
import { TeladeCadastro } from './pages/TeladeCadastro';

import { DatabaseProvider } from "./database/dataBaseContext"; 
import { AuthProvider } from "./database/AuthContext"; 


type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;

};

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  TeladeCadastro: undefined
  
  Formulario: {
    eventToEdit?: EventType;
    eventIndex?: number;
    eventToEditId?: number;
  };
  ListadeEventos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  

  return (
    
    <DatabaseProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="PaginaInicial">
           
            <Stack.Screen
              name="PaginaInicial"
              component={PaginaInicial}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
            name="TeladeCadastro" 
            component={TeladeCadastro} 
            options={{ title: 'Cadastro' }} /> 
            <Stack.Screen
              name="TeladeLogin"
              component={TeladeLogin}
              options={{ headerShown: false }}
            />

            {/* Tela de Eventos SEM seta de voltar */}
            <Stack.Screen
              name="ListadeEventos"
              options={{
                headerShown: true,
                title: "Meus Eventos",
                headerLeft: () => null, 
              }}
            >
              {(props) => <EventList {...props} />}
            </Stack.Screen>

            <Stack.Screen
              name="Formulario"
              options={({ route }) => ({
                headerShown: true,

                title: route.params?.eventToEdit
                  ? "Editar Evento"
                  : "Criar Evento",
                headerBackTitle: "Voltar",
              })}
            >
              {(props) => <FormEvents {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
          <StatusBar style="dark" />
        </NavigationContainer>
      </AuthProvider>
    </DatabaseProvider>
  );
}
