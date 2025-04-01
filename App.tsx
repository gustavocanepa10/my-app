import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  Image } from 'react-native';
import { PaginaInicial } from './pages/PáginaInicial';
import { TeladeLogin } from './pages/TeladeLogin';
import {NavigationContainer, useNavigation} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import { Events } from './pages/Events';



const Stack = createStackNavigator()







export default function App() {
  
  




  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName='PaginaInicial'>

      <Stack.Screen name='PaginaInicial' component={PaginaInicial}/>



      

      <Stack.Screen   name='TeladeLogin' component={TeladeLogin}/>

      <Stack.Screen  name='Events' component={Events} />





      </Stack.Navigator>

      
      
      
     
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

