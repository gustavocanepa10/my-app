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
  Formulario: { eventToEdit?: EventType; eventIndex?: number };
  ListadeEventos: undefined;
};

type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [listEvents, setListEvents] = useState<EventType[]>([]);

  const handleAddEvent = (newEvent: EventType, navigation: any, index?: number) => {
    if (typeof index === 'number') {
      setListEvents(prevEvents => {
        const updatedEvents = [...prevEvents];
        updatedEvents[index] = newEvent;
        return updatedEvents;
      });
    } else {
      setListEvents(prevEvents => [...prevEvents, newEvent]);
    }
    navigation.navigate('ListadeEventos');
  };

  const handleDeleteEvent = (index: number) => {
    setListEvents(prevEvents => prevEvents.filter((_, i) => i !== index));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaginaInicial">
        {/* Telas sem header */}
        <Stack.Screen name="PaginaInicial" component={PaginaInicial} options={{ headerShown: false }} />
        <Stack.Screen name="TeladeLogin" component={TeladeLogin} options={{ headerShown: false }} />

        {/* Tela de Eventos SEM seta de voltar */}
        <Stack.Screen 
          name="ListadeEventos"
          options={{ 
            headerShown: true,
            title: 'Meus Eventos',
            headerLeft: () => null // Remove a seta
          }}
        >
          {(props) => (
            <EventList 
              {...props} 
              events={listEvents}
              onEditEvent={(index, event) => props.navigation.navigate('Formulario', { 
                eventToEdit: event, 
                eventIndex: index 
              })}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </Stack.Screen>

        {/* Tela de Formulário COM seta de voltar */}
        <Stack.Screen 
          name="Formulario" 
          options={{ 
            headerShown: true,
            title: ({ route }) => route.params?.eventToEdit ? 'Editar Evento' : 'Criar Evento',
            headerBackTitle: 'Voltar' // Seta visível
          }}
        >
          {(props) => (
            <FormEvents 
              {...props}
              handleAddEvent={handleAddEvent}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}