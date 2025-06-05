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
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Adicionado RouteProp
import { StackNavigationProp } from '@react-navigation/stack';
import { FormEventsStyles } from '../styles/FormEventsStyles';

// 1. Importe os hooks do DB e Auth, e o tipo EventDbEntry
import { useDatabase } from '../database/dataBaseContext'; // Ajuste o caminho se necessário
import { useAuth } from '../database/AuthContext';         // Ajuste o caminho se necessário
import { EventDbEntry } from '../database/initializeDatabase'; // Ou de onde você exportou EventDbEntry

// 2. Ajuste a RootStackParamList para refletir os novos params
//    (eventToEdit agora deve ser do tipo EventDbEntry)
type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: { eventToEdit?: EventDbEntry }; // eventIndex não é mais necessário aqui
  ListadeEventos: undefined;
};

// Tipagem para a rota
type FormularioRouteProp = RouteProp<RootStackParamList, 'Formulario'>;

// Props do componente (handleAddEvent será removido)
// type FormEventsProps = {
//   navigation: StackNavigationProp<RootStackParamList, 'Formulario'>;
//   route: FormularioRouteProp;
// };
// Não precisamos mais de props complexas se pegarmos tudo do route e contextos

const categories = [
  'Festa', 'Conferência', 'Esportivo', 'Cultural', 'Educativo', 'Social'
];

export function FormEvents() { // Removidas as props, pegaremos via hooks
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Formulario'>>();
  const route = useRoute<FormularioRouteProp>();
  const { db } = useDatabase(); // Hook do banco de dados
  const { currentUser } = useAuth(); // Hook de autenticação

  const [isSubmitting, setIsSubmitting] = useState(false); // Para feedback de carregamento

  // 3. Estado do evento inicializado para EventDbEntry (parcialmente)
  const initialEventState: Partial<EventDbEntry> = { // Usar Partial para campos opcionais
    name: '',
    date: '', // A data será formatada como string DD/MM/AAAA
    category: categories[0],
    description: '',
    manualLocation: '',
    gpsLocation: '',
    imageUrl: undefined,
    // id e userId serão definidos depois
  };

  const [event, setEvent] = useState<Partial<EventDbEntry>>(
    route.params?.eventToEdit || initialEventState
  );

  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [image, setImage] = useState<string | null>(route.params?.eventToEdit?.imageUrl || null); // Inicializa imagem se editando
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Mantém para o picker

  // Efeito para popular o formulário se estiver editando
  useEffect(() => {
    const eventToEdit = route.params?.eventToEdit;
    if (eventToEdit) {
      setEvent(eventToEdit); // eventToEdit já deve ser do tipo EventDbEntry
      if (eventToEdit.imageUrl) {
        setImage(eventToEdit.imageUrl);
      }
      if (eventToEdit.date) {
        // Converte a data "DD/MM/AAAA" de volta para um objeto Date para o picker
        const parts = eventToEdit.date.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          setSelectedDate(new Date(year, month - 1, day)); // Mês é 0-indexed
        }
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

  // Permissões de Imagem e Localização (mantidas como antes)
  useEffect(() => { /* ... permissões de imagem ... */
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);
  useEffect(() => { /* ... permissões de localização e watch ... */
    requestLocationPermissions();
    let subscription: any;
    const startWatching = async () => {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) return;
      subscription = await watchPositionAsync(
        { accuracy: LocationAccuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (response) => {
          setLocation(response);
          mapRef.current?.animateCamera({ center: response.coords, pitch: 70 });
          setEvent(prev => ({ ...prev, gpsLocation: `${response.coords.latitude},${response.coords.longitude}` }));
        }
      );
    };
    startWatching();
    return () => { if (subscription) subscription.remove(); };
  }, []);
  async function requestLocationPermissions() { /* ... */
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      // Define gpsLocation no evento se ainda não estiver editando um com gpsLocation
      if (!event.gpsLocation && currentPosition) {
        setEvent(prev => ({ ...prev, gpsLocation: `${currentPosition.coords.latitude},${currentPosition.coords.longitude}` }));
      }
    }
  }


  const pickImage = async () => { /* ... como antes ... */
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };
  const takePhoto = async () => { /* ... como antes ... */
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setEvent({ ...event, imageUrl: result.assets[0].uri });
    }
  };

  // 4. handleSubmit modificado para salvar no banco
  const handleSubmit = async () => {
    if (!db || !currentUser?.id) {
      Alert.alert('Erro', 'Usuário não autenticado ou banco de dados não disponível.');
      return;
    }
    if (!event.name?.trim() || !event.date?.trim() || !event.manualLocation?.trim()) {
      Alert.alert('Campos obrigatórios', 'Nome, Data e Local manual são obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    const eventDataToSave: EventDbEntry = {
      id: event.id, // Será undefined para novos eventos
      name: event.name!,
      date: event.date!,
      category: event.category!,
      description: event.description || '', // Garante que não é undefined
      manualLocation: event.manualLocation!,
      gpsLocation: event.gpsLocation || undefined,
      imageUrl: event.imageUrl || undefined,
      userId: currentUser.id, // ID do usuário logado
    };

    try {
      if (eventDataToSave.id) { // Se tem ID, é uma atualização (UPDATE)
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
      } else { // Sem ID, é uma inserção (INSERT)
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
        // Limpa o formulário apenas se for um novo evento
        setEvent(initialEventState);
        setImage(null);
        setSelectedDate(new Date());
      }
      navigation.navigate('ListadeEventos'); // Ou navigation.goBack();
    } catch (e) {
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
          {/* Ajuste para verificar se event.id existe para o título */}
          {event.id ? 'EDITAR EVENTO' : 'CRIAR EVENTO'}
        </Text>

        {/* Campos do formulário (TextInput, Picker, etc.) como antes,
            usando os valores de 'event' e as funções 'setEvent' */}

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
            value={selectedDate} // Usa selectedDate para o valor inicial do picker
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
          placeholder="Ex: Centro de Convenções"
          editable={!isSubmitting}
        />

        <Text style={FormEventsStyles.label}>Localização em tempo real (GPS)</Text>
        {location && ( /* Mapa como antes */
          <MapView
            ref={mapRef}
            style={FormEventsStyles.map}
            initialRegion={{
              latitude: location.coords.latitude, longitude: location.coords.longitude,
              latitudeDelta: 0.005, longitudeDelta: 0.005
            }}
          >
            <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} />
          </MapView>
        )}
        {/* Exibir GPSLocation do evento se estiver editando e não houver 'location' atual do GPS */}
        {!location && event.gpsLocation && (
            <Text style={FormEventsStyles.label}>GPS Salvo: {event.gpsLocation}</Text>
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
        {/* Menu flutuante removido para simplificar, pode adicionar de volta se necessário */}
      </ScrollView>
    </SafeAreaView>
  );
}

// Não precisa mais do export default FormEvents se o nome da função já é FormEvents
// e você está exportando-a diretamente.