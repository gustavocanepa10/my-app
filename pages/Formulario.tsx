import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, ScrollView, 
  Alert, TouchableOpacity, Image 
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
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
  Formulario: undefined;
  ListadeEventos: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'Formulario'>;

export function FormEvents({ handleAddEvent }: { 
  handleAddEvent: (event: EventType) => void;
  navigation: any;
}) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [image, setImage] = useState<string | null>(null);
   const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation<InitialPageNavigationProp>()

  const [event, setEvent] = useState<EventType>({
    name: '',
    date: '',
    category: categories[0],
    description: '',
    manualLocation: '',
    gpsLocation: '',
    imageUrl: undefined
  });

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
    if (!event.name || !event.date) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    handleAddEvent(event);
    navigation.goBack();

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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>CRIAR EVENTO</Text>

        <Text style={styles.label}>Nome do Evento *</Text>
        <TextInput
          style={styles.input}
          value={event.name}
          onChangeText={(text) => setEvent({ ...event, name: text })}
          placeholder="Ex: Festa de Aniversário"
        />

        <Text style={styles.label}>Data (DD/MM/AAAA) *</Text>
        <TextInput
          style={styles.input}
          value={event.date}
          onChangeText={(text) => setEvent({ ...event, date: text })}
          placeholder="Ex: 25/12/2025"
        />

        <Text style={styles.label}>Local (Endereço manual) *</Text>
        <TextInput
          style={styles.input}
          value={event.manualLocation}
          onChangeText={(text) => setEvent({ ...event, manualLocation: text })}
          placeholder="Ex: Centro de Convenções"
        />

        <Text style={styles.label}>Localização em tempo real (GPS)</Text>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
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

        <Text style={styles.label}>Imagem do Evento</Text>
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={takePhoto}
          >
            <Text style={styles.imageButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={pickImage}
          >
            <Text style={styles.imageButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
          />
        )}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={event.description}
          onChangeText={(text) => setEvent({ ...event, description: text })}
          placeholder="Detalhes sobre o evento"
          multiline
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={event.category}
            onValueChange={(itemValue) => setEvent({ ...event, category: itemValue })}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>

          
        </View>

        <TouchableOpacity 
                  style={styles.menuButton} 
                  onPress={() => setMenuVisible(!menuVisible)}
                >
                  <Image source={require('../assets/form.png')} style={styles.icon} />
                </TouchableOpacity>
          
                {menuVisible && (
                  <View style={styles.menu}>
                    <TouchableOpacity 
                      style={styles.menuItem} 
                      onPress={() => {
                        setMenuVisible(false);
                        navigation.navigate('ListadeEventos');
                      }}
                    >
                      <Text style={styles.menuText}>Criar Evento</Text>
                    </TouchableOpacity>
                  </View>
                )}

        <Button
          title="Salvar"
          onPress={handleSubmit}
          color="#007BFF"
        />

        <Text style={styles.requiredText}>* Campos obrigatórios</Text>
      </ScrollView>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1D4ED8',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#111827',
  },
  map: {
    width: '100%',
    height: 160,
    marginBottom: 18,
    borderRadius: 10,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10
  },
  imageButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  requiredText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 12,
    
  },
  menuButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 40,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  menu: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 160,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1D4ED8',
  },
});


