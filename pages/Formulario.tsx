import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, ScrollView, 
  Alert, TouchableOpacity, Image 
} from 'react-native';
import MapView , {Marker} from "react-native-maps"
import { Picker } from '@react-native-picker/picker';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject
  , watchPositionAsync,
  LocationAccuracy
} from "expo-location"
import { SafeAreaView } from 'react-native-safe-area-context';

type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
};

const categories = [
  'Festa',
  'Conferência',
  'Esportivo',
  'Cultural',
  'Educativo',
  'Social'
];


export function FormEvents({ handleAddEvent, navigation }: { 
  handleAddEvent: (event: EventType, navigation: any) => void;
  navigation: any;
}) {
  

  const [location, setLocation] = useState<LocationObject | null>(null)


  

  

  const mapRef = useRef<MapView>(null)


  async function requestLocationPermissions() {

    const {granted} = await requestForegroundPermissionsAsync();


    if (granted) {
      const currentPosition = await getCurrentPositionAsync()
      setLocation(currentPosition)
      console.log(currentPosition);
      
      
    }
    
  }

  useEffect(() => {
    requestLocationPermissions()
  }, [])

  useEffect(() => {
    watchPositionAsync({
      accuracy : LocationAccuracy.Highest,
      timeInterval : 1000,
      distanceInterval : 1
    }, (response) => {
      setLocation(response)
      mapRef.current?.animateCamera({
        pitch : 70,
        center : response.coords
      })
      

    })
  }, [])

  useEffect(() => {
    if (location) {
      setEvent(prev => ({
        ...prev,
        location: `${location.coords.latitude},${location.coords.longitude}`
      }))
    }
  }, [location])

  const [menuVisible, setMenuVisible] = useState(false);

  const [event, setEvent] = useState({
    name: '',
    date: '',
    category: categories[0],
    description: '',
    location: '',
    
  });

  const handleSubmit = () => {
    if (!event.name || !event.date) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    handleAddEvent(event, navigation);
    
    // Limpa o formulário
    setEvent({
      name: '',
      date: '',
      category: categories[0],
      description: '',
      location: '',
      
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CRIAR EVENTO</Text>

      <Text style={styles.label}>Nome do Evento *</Text>
      <TextInput
        style={styles.input}
        value={event.name}
        onChangeText={(text) => setEvent({...event, name: text})}
        placeholder="Ex: Festa de Aniversário"
      />

      <Text style={styles.label}>Data (DD/MM/AAAA) *</Text>
      <TextInput
        style={styles.input}
        value={event.date}
        onChangeText={(text) => setEvent({...event, date: text})}
        placeholder="Ex: 25/12/2025"
      />

      <Text style={styles.label}>Local *</Text>
      <TextInput
        style={styles.input}
        value={event.location}
        onChangeText={(text) => setEvent({...event, location: text})}
        placeholder="Ex: Centro de Convenções"
      />
  
      <Text  style={styles.label}>
        Localização em tempo real *
      </Text>
      {/* MAPS VEM AQUI */}
      <Text>
        
      </Text>
      {location && (<MapView ref = {mapRef}  style = {styles.map}
      initialRegion = {{
        latitude : location.coords.latitude,
        longitude : location.coords.longitude,
        latitudeDelta : 0.005,
        longitudeDelta : 0.005
      }}  >
        <Marker  coordinate={{
           latitude : location.coords.latitude,
           longitude : location.coords.longitude,
        }} />
      </MapView>)

      

      }


      

      

      

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={event.description}
        onChangeText={(text) => setEvent({...event, description: text})}
        placeholder="Detalhes sobre o evento"
        multiline
      />

      

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={event.category}
          onValueChange={(itemValue) => setEvent({...event, category: itemValue})}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      

        

        <Button 
          title="Salvar" 
          onPress={handleSubmit} 
          color="#007BFF"
          
        />

        
        
      

      <Text style={styles.requiredText}>* Campos obrigatórios</Text>

      {/* Botão de menu */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Image source={require('../assets/form.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* Menu suspenso */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ListadeEventos');
            }}
          >
           
            <Text style={styles.menuText}>Ver Eventos</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent : "space-between",
    padding : 20
    
   
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  
  
  requiredText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  menuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 30,
    marginTop : 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button : {
    alignContent : "center"
    

  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  menu: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 10,
    width: 150,
  },
  menuItem: {
    
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#007BFF',
  },
  map : {
  width: '100%',
  height: 150, // ou qualquer altura que faça sentido
  marginBottom: 16,
  borderRadius: 10
  }
});
