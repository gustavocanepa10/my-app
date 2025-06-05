// FormEvents.tsx (ou Formulario.tsx)
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, Button, ScrollView,
  Alert, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator
} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  geocodeAsync,
  LocationAccuracy
} from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormEventsStyles } from '../styles/FormEventsStyles';

import { useDatabase } from '../database/dataBaseContext';
import { useAuth } from '../database/AuthContext';
import { EventDbEntry } from '../database/initializeDatabase';

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: { eventToEdit?: EventDbEntry };
  ListadeEventos: undefined;
};

type FormularioRouteProp = RouteProp<RootStackParamList, 'Formulario'>;

const categories = [
  'Festa', 'Conferência', 'Esportivo', 'Cultural', 'Educativo', 'Social'
];

export function FormEvents() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Formulario'>>();
  const route = useRoute<FormularioRouteProp>();
  const { db } = useDatabase();
  const { currentUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialEventState: Partial<EventDbEntry> = {
    name: '',
    date: '',
    category: categories[0],
    description: '',
    manualLocation: '',
    gpsLocation: '',
    imageUrl: undefined,
  };

  const [event, setEvent] = useState<Partial<EventDbEntry>>(
    route.params?.eventToEdit || initialEventState
  );

  const [selectedMapLocation, setSelectedMapLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const [image, setImage] = useState<string | null>(route.params?.eventToEdit?.imageUrl || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // REMOVIDO: const [citySearchInput, setCitySearchInput] = useState('');

  // Efeito para popular o formulário se estiver editando
  useEffect(() => {
    const eventToEdit = route.params?.eventToEdit;
    if (eventToEdit) {
      setEvent(eventToEdit);
      if (eventToEdit.imageUrl) {
        setImage(eventToEdit.imageUrl);
      }
      if (eventToEdit.date) {
        const parts = eventToEdit.date.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          setSelectedDate(new Date(year, month - 1, day));
        }
      }
      // Se estiver editando e o evento tiver GPS, define como a localização inicial do mapa
      if (eventToEdit.gpsLocation) {
        const [latitude, longitude] = eventToEdit.gpsLocation.split(',').map(Number);
        setSelectedMapLocation({ latitude, longitude });
        // NÃO PRECISAMOS MAIS DE setCitySearchInput(eventToEdit.manualLocation);
      }
    }
  }, [route.params?.eventToEdit]);


  const formatDisplayDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (e: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setEvent({ ...event, date: formatDisplayDate(date) });
    }
  };

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  async function centerMapOnCurrentLocation() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setSelectedMapLocation(currentPosition.coords);
      mapRef.current?.animateCamera({ center: currentPosition.coords, zoom: 15, pitch: 0 });
      setEvent(prev => ({ ...prev, gpsLocation: `${currentPosition.coords.latitude},${currentPosition.coords.longitude}` }));
    } else {
      Alert.alert('Permissão de Localização', 'Permissão para acessar a localização foi negada.');
    }
  }

  useEffect(() => {
    if (!route.params?.eventToEdit?.gpsLocation) {
        centerMapOnCurrentLocation();
    }
  }, []);

  // FUNÇÃO handleSearchCityOnMap AGORA USA event.manualLocation
  const handleSearchManualLocationOnMap = async () => {
    if (!event.manualLocation?.trim()) { // Usa o valor do campo manualLocation
      Alert.alert('Campo Vazio', 'Por favor, preencha o campo "Local (Endereço manual)" para buscar no mapa.');
      return;
    }
    setIsSubmitting(true);
    try {
      const locations = await geocodeAsync(event.manualLocation.trim());
      if (locations && locations.length > 0) {
        const { latitude, longitude } = locations[0];
        setSelectedMapLocation({ latitude, longitude });
        mapRef.current?.animateCamera({ center: { latitude, longitude }, zoom: 15, pitch: 0 });
        setEvent(prev => ({
            ...prev,
            gpsLocation: `${latitude},${longitude}` // Atualiza o GPS com a coordenada encontrada
        }));
      } else {
        Alert.alert('Localização Não Encontrada', 'Não foi possível encontrar as coordenadas para o local informado. Tente ser mais específico.');
        setEvent(prev => ({ ...prev, gpsLocation: undefined }));
      }
    } catch (error) {
      console.error("Erro ao buscar local no mapa:", error);
      Alert.alert('Erro na Busca', 'Ocorreu um erro ao buscar a localização. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedMapLocation({ latitude, longitude });
    setEvent(prev => ({ ...prev, gpsLocation: `${latitude},${longitude}` }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!db || !currentUser?.id) {
      Alert.alert('Erro', 'Usuário não autenticado ou banco de dados não disponível.');
      return;
    }
    if (!event.name?.trim() || !event.date?.trim() || !event.manualLocation?.trim()) {
      Alert.alert('Campos obrigatórios', 'Nome, Data e Local manual são obrigatórios.');
      return;
    }
    if (!event.id && !event.gpsLocation) {
        Alert.alert('Campo Obrigatório', 'Por favor, selecione a localização do evento no mapa (busque por nome ou use seu GPS atual).');
        return;
    }

    setIsSubmitting(true);

    const eventDataToSave: EventDbEntry = {
      id: event.id,
      name: event.name!,
      date: event.date!,
      category: event.category!,
      description: event.description || '',
      manualLocation: event.manualLocation!,
      gpsLocation: event.gpsLocation || undefined,
      imageUrl: event.imageUrl || undefined,
      userId: currentUser.id,
    };

    try {
      if (eventDataToSave.id) {
        await db.runAsync(
          `UPDATE events SET name = ?, date = ?, category = ?, description = ?, manualLocation = ?,
           gpsLocation = ?, imageUrl = ?, userId = ? WHERE id = ?;`,
          [
            eventDataToSave.name, eventDataToSave.date, eventDataToSave.category, eventDataToSave.description,
            eventDataToSave.manualLocation, eventDataToSave.gpsLocation, eventDataToSave.imageUrl,
            eventDataToSave.userId, eventDataToSave.id
          ]
        );
        Alert.alert('Sucesso', 'Evento atualizado!');
      } else {
        const result = await db.runAsync(
          `INSERT INTO events (name, date, category, description, manualLocation,
           gpsLocation, imageUrl, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            eventDataToSave.name, eventDataToSave.date, eventDataToSave.category, eventDataToSave.description,
            eventDataToSave.manualLocation, eventDataToSave.gpsLocation, eventDataToSave.imageUrl,
            eventDataToSave.userId
          ]
        );
        Alert.alert('Sucesso', `Evento criado com ID: ${result.lastInsertRowId}!`);
        setEvent(initialEventState);
        setImage(null);
        setSelectedDate(new Date());
        setSelectedMapLocation(null);
        // REMOVIDO: setCitySearchInput('');
      }
      navigation.navigate('ListadeEventos');
    } catch (e: any) {
      console.error("Erro ao salvar evento:", e);
      Alert.alert('Erro ao Salvar', `Não foi possível salvar o evento: ${e.message || e}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={FormEventsStyles.container}>
        <Text style={FormEventsStyles.title}>
          {event.id ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        </Text>

        <Text style={FormEventsStyles.label}>Nome do Evento *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.name}
          onChangeText={(text) => setEvent({ ...event, name: text })}
          placeholder="Ex: Festa de Aniversário"
          editable={!isSubmitting}
        />

        <Text style={FormEventsStyles.label}>Data do Evento</Text>
        <TouchableOpacity onPress={() => !isSubmitting && setShowDatePicker(true)} style={FormEventsStyles.datePickerButton}>
          <Text style={FormEventsStyles.datePickerText}>
            {event.date ? event.date : "Selecione a data"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={FormEventsStyles.label}>Local (Endereço manual) *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.manualLocation}
          onChangeText={(text) => setEvent({ ...event, manualLocation: text })}
          placeholder="Ex: Centro de Convenções, Vassouras" // Adicione exemplos de cidade/estado
          editable={!isSubmitting}
        />

        {/* BOTÃO DE BUSCA AGORA LIGADO AO CAMPO MANUAL LOCATION */}
        <TouchableOpacity
            style={FormEventsStyles.searchLocationButton} // NOVO ESTILO
            onPress={handleSearchManualLocationOnMap} // NOVA FUNÇÃO
            disabled={isSubmitting || !event.manualLocation?.trim()}
        >
            {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <Text style={FormEventsStyles.searchLocationButtonText}>Buscar no Mapa</Text>
            )}
        </TouchableOpacity>

        <Text style={FormEventsStyles.label}>Localização Selecionada no Mapa (GPS)</Text>
        {/* Renderiza o mapa apenas se houver uma localização inicial ou selecionada */}
        {(selectedMapLocation || event.gpsLocation) && (
          <MapView
            ref={mapRef}
            style={FormEventsStyles.map}
            initialRegion={selectedMapLocation ? {
                latitude: selectedMapLocation.latitude,
                longitude: selectedMapLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            } : (event.gpsLocation ? {
                latitude: parseFloat(event.gpsLocation.split(',')[0]),
                longitude: parseFloat(event.gpsLocation.split(',')[1]),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            } : undefined)}
            onPress={handleMapPress}
          >
            {selectedMapLocation && (
              <Marker coordinate={selectedMapLocation} />
            )}
            {!selectedMapLocation && event.gpsLocation && (
              <Marker coordinate={{ latitude: parseFloat(event.gpsLocation.split(',')[0]), longitude: parseFloat(event.gpsLocation.split(',')[1]) }} />
            )}
          </MapView>
        )}

        {/* Botão para centrar na localização atual do dispositivo */}
        <TouchableOpacity
          style={FormEventsStyles.locationButton}
          onPress={centerMapOnCurrentLocation}
          disabled={isSubmitting}
        >
          <Text style={FormEventsStyles.locationButtonText}>Usar Meu GPS Atual</Text>
        </TouchableOpacity>

        {/* Exibir o GPS selecionado/salvo */}
        {(selectedMapLocation || event.gpsLocation) && (
          <Text style={FormEventsStyles.label}>
            GPS Selecionado: {selectedMapLocation ? `${selectedMapLocation.latitude.toFixed(6)},${selectedMapLocation.longitude.toFixed(6)}` : event.gpsLocation}
          </Text>
        )}


        <Text style={FormEventsStyles.label}>Imagem do Evento</Text>
        <View style={FormEventsStyles.imageButtonsContainer}>
          <TouchableOpacity style={FormEventsStyles.imageButton} onPress={pickImage} disabled={isSubmitting}>
            <Text style={FormEventsStyles.imageButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={FormEventsStyles.imageButton} onPress={takePhoto} disabled={isSubmitting}>
            <Text style={FormEventsStyles.imageButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
        {image && (<Image source={{ uri: image }} style={FormEventsStyles.previewImage} />)}


        <Text style={FormEventsStyles.label}>Descrição</Text>
        <TextInput
          style={[FormEventsStyles.input, { height: 100 }]}
          value={event.description}
          onChangeText={(text) => setEvent({ ...event, description: text })}
          placeholder="Detalhes sobre o evento"
          multiline
          editable={!isSubmitting}
        />

        <Text style={FormEventsStyles.label}>Categoria</Text>
        <View style={FormEventsStyles.pickerContainer}>
          <Picker
            selectedValue={event.category}
            onValueChange={(itemValue) => setEvent({ ...event, category: itemValue })}
            style={FormEventsStyles.picker}
            enabled={!isSubmitting}
          >
            {categories.map((cat) => (<Picker.Item key={cat} label={cat} value={cat} />))}
          </Picker>
        </View>

        <Button
          title={isSubmitting ? "Salvando..." : (event.id ? "Atualizar Evento" : "Salvar Evento")}
          onPress={handleSubmit}
          color="#007BFF"
          disabled={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}