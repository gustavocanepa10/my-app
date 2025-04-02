import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { PaginaInicial } from './pages/PaginaInicial';
import { TeladeLogin } from './pages/TeladeLogin';
import { FormEvents } from './pages/Formulario';
import { EventList } from './pages/Eventos';

const Stack = createStackNavigator();

// Definição do tipo de evento
type EventType = {
  name: string;
  date: string;
  hour: string;
  category: string;
};

export default function App() {
  const [listEvents, setListEvents] = useState<EventType[]>([]);

  function handleEvents(newEvent: EventType) {
    setListEvents((prevList) => [...prevList, newEvent]);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaginaInicial">
        <Stack.Screen name="PaginaInicial" component={PaginaInicial} />
        <Stack.Screen name="TeladeLogin" component={TeladeLogin} />
        <Stack.Screen name="Formulario">
          {(props) => <FormEvents {...props} handleEvents={handleEvents} />}
        </Stack.Screen>
        
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
