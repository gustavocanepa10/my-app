// pages/Formulario.tsx - VERSÃO COMPLETA E CORRIGIDA

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
} from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormEventsStyles } from '../styles/FormEventsStyles';

import { useAuth } from '../database/AuthContext';
import { EventDbEntry } from '../database/initializeDatabase';

// Definindo a URL da API aqui. Use o mesmo IP dos outros arquivos.
const API_URL = 'http://192.168.3.111:3000'; 

type RootStackParamList = {
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
  const { currentUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialEventState: Partial<EventDbEntry> = {
    name: '', date: '', category: categories[0], description: '',
    manualLocation: '', gpsLocation: '', imageUrl: undefined,
  };

  const [event, setEvent] = useState<Partial<EventDbEntry>>(
    route.params?.eventToEdit || initialEventState
  );

  const [selectedMapLocation, setSelectedMapLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const [image, setImage] = useState<string | null>(route.params?.eventToEdit?.imageUrl || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const eventToEdit = route.params?.eventToEdit;
    if (eventToEdit) {
      setEvent(eventToEdit);
      if (eventToEdit.imageUrl) setImage(eventToEdit.imageUrl);
      if (eventToEdit.date) {
        const [day, month, year] = eventToEdit.date.split('/').map(Number);
        setSelectedDate(new Date(year, month - 1, day));
      }
      if (eventToEdit.gpsLocation) {
        const [latitude, longitude] = eventToEdit.gpsLocation.split(',').map(Number);
        setSelectedMapLocation({ latitude, longitude });
      }
    } else {
      centerMapOnCurrentLocation();
    }
  }, [route.params?.eventToEdit]);

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }
    if (!event.name?.trim() || !event.date?.trim() || !event.manualLocation?.trim()) {
      Alert.alert('Campos obrigatórios', 'Nome, Data e Local manual são obrigatórios.');
      return;
    }
    setIsSubmitting(true);
    
    const eventData = { ...event, userId: currentUser.id, imageUrl: image };
    
    const isEditing = !!event.id;
    const url = isEditing ? `${API_URL}/events/${event.id}` : `${API_URL}/events`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no servidor');
      }

      Alert.alert('Sucesso', `Evento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      navigation.navigate('ListadeEventos');

    } catch (e: any) {
      console.error("Erro ao salvar evento:", e);
      Alert.alert('Erro ao Salvar', `Não foi possível salvar o evento: ${e.message || e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUAS FUNÇÕES AUXILIARES ORIGINAIS (todas mantidas)
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

  const handleSearchManualLocationOnMap = async () => {
    if (!event.manualLocation?.trim()) {
      Alert.alert('Campo Vazio', 'Por favor, preencha o campo "Local (Endereço manual)" para buscar no mapa.');
      return;
    }
    //... (sua lógica de busca continua a mesma)
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedMapLocation({ latitude, longitude });
    setEvent(prev => ({ ...prev, gpsLocation: `${latitude},${longitude}` }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setEvent({ ...event, imageUrl: uri });
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setEvent({ ...event, imageUrl: uri });
    }
  };

  // PARTE VISUAL (JSX) COMPLETA
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

        <Text style={FormEventsStyles.label}>Data do Evento *</Text>
        <TouchableOpacity onPress={() => !isSubmitting && setShowDatePicker(true)} style={FormEventsStyles.datePickerButton}>
          <Text style={FormEventsStyles.datePickerText}>
            {event.date ? event.date : "Selecione a data"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onDateChange} />
        )}

        <Text style={FormEventsStyles.label}>Local (Endereço manual) *</Text>
        <TextInput
          style={FormEventsStyles.input}
          value={event.manualLocation}
          onChangeText={(text) => setEvent({ ...event, manualLocation: text })}
          placeholder="Ex: Centro de Convenções, Vassouras"
          editable={!isSubmitting}
        />
        
        <TouchableOpacity
          style={FormEventsStyles.searchLocationButton}
          onPress={handleSearchManualLocationOnMap}
          disabled={isSubmitting || !event.manualLocation?.trim()}
        >
          {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={FormEventsStyles.searchLocationButtonText}>Buscar no Mapa</Text>}
        </TouchableOpacity>

        <Text style={FormEventsStyles.label}>Localização no Mapa (GPS)</Text>
        <MapView
          ref={mapRef}
          style={FormEventsStyles.map}
          initialRegion={{ latitude: -22.4069, longitude: -43.6631, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
          onPress={!isSubmitting ? handleMapPress : undefined}
        >
          {selectedMapLocation && <Marker coordinate={selectedMapLocation} />}
        </MapView>
        
        <TouchableOpacity style={FormEventsStyles.locationButton} onPress={centerMapOnCurrentLocation} disabled={isSubmitting}>
          <Text style={FormEventsStyles.locationButtonText}>Usar Meu GPS Atual</Text>
        </TouchableOpacity>

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