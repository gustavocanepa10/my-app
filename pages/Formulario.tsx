import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, ScrollView, 
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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {route?.params?.eventToEdit ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        </Text>

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
          onChangeText={(text) => {
            const formattedDate = formatDate(text);
            setEvent({ ...event, date: formattedDate });
          }}
          placeholder="Ex: 25/12/2025"
          keyboardType="numeric"
          maxLength={10}
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
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Text style={styles.imageButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
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

        <Button 
          title={route?.params?.eventToEdit ? "Atualizar Evento" : "Salvar Evento"} 
          onPress={handleSubmit} 
          color="#007BFF" 
        />
      </ScrollView>

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
            <Text style={styles.menuText}>Ver eventos</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: wp('5%'),
    paddingBottom: hp('10%'),
  },
  title: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'),
    textAlign: 'center',
    color: '#1D4ED8',
  },
  label: {
    fontWeight: '600',
    marginBottom: hp('1%'),
    fontSize: wp('4%'),
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp('2.5%'),
    padding: hp('2%'),
    marginBottom: hp('2.5%'),
    fontSize: wp('4%'),
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp('2.5%'),
    marginBottom: hp('3%'),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    width: '100%',
    height: hp('6%'),
    color: 'black',
  },
  map: {
    width: '100%',
    height: hp('20%'),
    marginBottom: hp('2.5%'),
    borderRadius: wp('2.5%'),
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    gap: wp('2.5%'),
  },
  imageButton: {
    backgroundColor: '#2563EB',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2.5%'),
    flex: 1,
    alignItems: 'center',
    width: "80%"
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
  },
  previewImage: {
    width: '100%',
    height: hp('25%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('2.5%'),
  },
  menuButton: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('5%'),
    backgroundColor: '#007BFF',
    padding: hp('2%'),
    borderRadius: wp('10%'),
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: '#FFFFFF',
  },
  menu: {
    position: 'absolute',
    bottom: hp('11.5%'),
    right: wp('5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2.5%'),
    elevation: 5,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    width: wp('40%'),
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: wp('2%'),
  },
  menuText: {
    fontSize: wp('4%'),
    color: '#1D4ED8',
  },
});

export default FormEvents;