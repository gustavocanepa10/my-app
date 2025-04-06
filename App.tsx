import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { PaginaInicial } from './pages/PaginaInicial';
import { TeladeLogin } from './pages/TeladeLogin';
import { FormEvents } from './pages/Formulario';
import { EventList } from './pages/Eventos';

// Definindo os tipos das rotas
type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
};

// Tipo para a navegação
type AppNavigationProp = NavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

// Tipo do evento (pode ser movido para um arquivo de tipos separado se desejar)
type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
};

export default function App() {
  const [listEvents, setListEvents] = useState<EventType[]>([]);

  // Função para adicionar evento com tipagem mais segura
  const handleAddEvent = (newEvent: EventType, navigation: AppNavigationProp) => {
    setListEvents(prevEvents => [...prevEvents, newEvent]);
    console.log('Evento adicionado:', newEvent);
    navigation.navigate('ListadeEventos');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PaginaInicial"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true
        }}
      >
        {/* Tela de Splash/Inicial */}
        <Stack.Screen 
          name="PaginaInicial" 
          component={PaginaInicial} 
        />
        
        {/* Tela de Login */}
        <Stack.Screen 
          name="TeladeLogin" 
          component={TeladeLogin} 
        />
        
        {/* Tela de Formulário */}
        <Stack.Screen name="Formulario">
          {(props) => (
            <FormEvents 
              {...props}
              handleAddEvent={(event) => handleAddEvent(event, props.navigation)} 
            />
          )}
        </Stack.Screen>
        
        {/* Tela de Lista de Eventos */}
        <Stack.Screen 
          name="ListadeEventos" 
          options={{ 
            headerShown: true,
            title: 'Meus Eventos',
            headerBackTitle: 'Voltar'
          }}
        >
          {(props) => <EventList {...props} events={listEvents} />}
        </Stack.Screen>
      </Stack.Navigator>
      
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}