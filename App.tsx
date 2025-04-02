import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  Image } from 'react-native';
import { PaginaInicial } from './pages/PáginaInicial';
import { TeladeLogin } from './pages/TeladeLogin';
import {NavigationContainer, useNavigation} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import { Events } from './pages/FormEvents';
import { useState } from 'react';



const Stack = createStackNavigator()


type Props = {
  name: string;
  date: string;
  hour: string;
  category: string;
};

export default function App() {

  const [listEvents, setListEvents] = useState<Props[]>([]); 

  function handleEvents(newEvent: Props) {
    setListEvents((prevList) => [...prevList, newEvent]); 
  }


  
  




  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName='PaginaInicial'>

      <Stack.Screen name='PaginaInicial' component={PaginaInicial}/>



      

      <Stack.Screen   name='TeladeLogin' component={TeladeLogin}/>

      <Stack.Screen children={() => handleEvents(newEvent)}  name='Events' component={Events} />

      





      </Stack.Navigator>

      
      
      
     
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

