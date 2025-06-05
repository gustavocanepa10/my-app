import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, Button, ScrollView, 
  Alert, TouchableOpacity, Image, SafeAreaView 
} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { Picker } from '@react-native-picker/picker';
import { 
  requestForegroundPermissionsAsync, 
  getCurrentPositionAsync, 
  LocationObject, 
  watchPositionAsync, 
  LocationAccuracy 
} from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormEventsStyles } from '../styles/FormEventsStyles'; 

type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  manualLocation: string;
  gpsLocation?: string;
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

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: { eventToEdit?: EventType; eventIndex?: number };
  ListadeEventos: undefined;
};

type FormEventsProps = {
  handleAddEvent: (event: EventType, navigation: any, index?: number) => void;
  initialEvent?: EventType;
  navigation: StackNavigationProp<RootStackParamList, 'Formulario'>;
  route?: any;
};

export function FormEvents({ handleAddEvent, navigation, route }: FormEventsProps) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [image, setImage] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [event, setEvent] = useState<EventType>(route?.params?.eventToEdit || {
    name: '',
    date: '',
    category: categories[0],
    description: '',
    manualLocation: '',
    gpsLocation: '',
    imageUrl: undefined
  });

  // Função para formatar e validar a data
  const formatDate = (input: string): string => {
    // Remove tudo que não é número
    let cleaned = input.replace(/\D/g, '');
    
    // Limita o tamanho máximo
    cleaned = cleaned.slice(0, 8);
    
    // Adiciona as barras automaticamente
    if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    
    return cleaned;
  };

  useEffect(() => {
    if (route?.params?.eventToEdit?.imageUrl) {
      setImage(route.params.eventToEdit.imageUrl);
    }
  }, [route?.params?.eventToEdit]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera e galeria para adicionar fotos');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    let subscription: any;

    const startWatching = async () => {
      subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (response) => {
          setLocation(response);
          mapRef.current?.animateCamera({
            pitch: 70,
            center: response.coords
          });
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location) {
      setEvent(prev => ({
        ...prev,
        gpsLocation: `${location.coords.latitude},${location.coords.longitude}`
      }));
    }
  }, [location]);

  const handleSubmit = () => {
    
    if (!event.name || !event.date || !event.manualLocation) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(event.date)) {
      Alert.alert('Data inválida', 'Por favor, insira uma data válida no formato DD/MM/AAAA');
      return;
    }

    
    const [day, month, year] = event.date.split('/').map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      Alert.alert('Data inválida', 'Por favor, insira uma data válida');
      return;
    }

    handleAddEvent(
      event, 
      navigation,
      route?.params?.eventIndex
    );
    
    if (!route?.params?.eventToEdit) {
      setEvent({
        name: '',
        date: '',
        category: categories[0],
        description: '',
        manualLocation: '',
        gpsLocation: '',
        imageUrl: undefined
      });
      setImage(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={FormEventsStyles.container}>
        <Text style={FormEventsStyles.title}>
          {route?.params?.eventToEdit ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        </Text>

        <Text style={FormEventsStyles.label}>Nome do Evento *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.name}
          onChangeText={(text) => setEvent({ ...event, name: text })}
          placeholder="Ex: Festa de Aniversário"
        />

        <Text style={FormEventsStyles.label}>Data (DD/MM/AAAA) *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.date}
          onChangeText={(text) => {
            const formattedDate = formatDate(text);
            setEvent({ ...event, date: formattedDate });
          }}
          placeholder="Ex: 25/12/2025"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={FormEventsStyles.label}>Local (Endereço manual) *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.manualLocation}
          onChangeText={(text) => setEvent({ ...event, manualLocation: text })}
          placeholder="Ex: Centro de Convenções"
        />

        <Text style={FormEventsStyles.label}>Localização em tempo real (GPS)</Text>
        {location && (
          <MapView
            ref={mapRef}
            style={FormEventsStyles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            }}
          >
            <Marker coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }} />
          </MapView>
        )}

        <Text style={FormEventsStyles.label}>Imagem do Evento</Text>
        <View style={FormEventsStyles.imageButtonsContainer}>
          <TouchableOpacity style={FormEventsStyles.imageButton} onPress={takePhoto}>
            <Text style={FormEventsStyles.imageButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={FormEventsStyles.imageButton} onPress={pickImage}>
            <Text style={FormEventsStyles.imageButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image source={{ uri: image }} style={FormEventsStyles.previewImage} />
        )}

        <Text style={FormEventsStyles.label}>Descrição</Text>
        <TextInput
          style={[FormEventsStyles.input, { height: 100 }]} // Mantido estilo inline para altura para flexibilidade
          value={event.description}
          onChangeText={(text) => setEvent({ ...event, description: text })}
          placeholder="Detalhes sobre o evento"
          multiline
        />

        <Text style={FormEventsStyles.label}>Categoria</Text>
        <View style={FormEventsStyles.pickerContainer}>
          <Picker
            selectedValue={event.category}
            onValueChange={(itemValue) => setEvent({ ...event, category: itemValue })}
            style={FormEventsStyles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Button 
          title={route?.params?.eventToEdit ? "Atualizar Evento" : "Salvar Evento"} 
          onPress={handleSubmit} 
          color="#007BFF" 
        />
      </ScrollView>

      <TouchableOpacity 
        style={FormEventsStyles.menuButton} 
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Image source={require('../assets/form.png')} style={FormEventsStyles.icon} />
      </TouchableOpacity>

      {menuVisible && (
        <View style={FormEventsStyles.menu}>
          <TouchableOpacity 
            style={FormEventsStyles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ListadeEventos');
            }}
          >
            <Text style={FormEventsStyles.menuText}>Ver eventos</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default FormEvents;
