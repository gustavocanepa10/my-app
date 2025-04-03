import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { PaginaInicial } from './pages/PaginaInicial';
import { TeladeLogin } from './pages/TeladeLogin';
import { FormEvents } from './pages/Formulario';
import { EventList } from './pages/Eventos';

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: undefined;
  ListadeEventos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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

  const handleAddEvent = (newEvent: EventType, navigation: any) => {
    const updatedEvents = [...listEvents, newEvent];
    setListEvents(updatedEvents);
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
        <Stack.Screen name="PaginaInicial" component={PaginaInicial} />
        <Stack.Screen name="TeladeLogin" component={TeladeLogin} />
        <Stack.Screen name="Formulario">
          {(props) => (
            <FormEvents 
              {...props}
              handleAddEvent={(event) => handleAddEvent(event, props.navigation)} 
            />
          )}
        </Stack.Screen>
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