import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
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

type AppNavigationProp = NavigationProp<RootStackParamList>;

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

  const handleAddEvent = (newEvent: EventType, navigation: AppNavigationProp, index?: number) => {
    if (typeof index === 'number') {
      // Edição de evento existente
      setListEvents(prevEvents => {
        const updatedEvents = [...prevEvents];
        updatedEvents[index] = newEvent;
        return updatedEvents;
      });
    } else {
      // Adição de novo evento
      setListEvents(prevEvents => [...prevEvents, newEvent]);
    }
    navigation.navigate('ListadeEventos');
  };

  const handleDeleteEvent = (index: number) => {
    setListEvents(prevEvents => {
      const updatedEvents = [...prevEvents];
      updatedEvents.splice(index, 1);
      return updatedEvents;
    });
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
              handleAddEvent={(event) => handleAddEvent(
                event, 
                props.navigation,
                props.route.params?.eventIndex
              )} 
              initialEvent={props.route.params?.eventToEdit}
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
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}