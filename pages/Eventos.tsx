import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventListStyles } from '../styles/EventListStyles'; // Importa os estilos

type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
};

type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  Formulario: { eventToEdit?: EventType; eventIndex?: number };
  ListadeEventos: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'ListadeEventos'>;

export function EventList({ events, onEditEvent, onDeleteEvent }: { 
  events: EventType[];
  onEditEvent: (index: number, updatedEvent: EventType) => void;
  onDeleteEvent: (index: number) => void;
}) {
  const navigation = useNavigation<InitialPageNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleEdit = (index: number, event: EventType) => {
    navigation.navigate('Formulario', { eventToEdit: event, eventIndex: index });
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => onDeleteEvent(index) }
      ]
    );
  };

  return (
    <View style={EventListStyles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={EventListStyles.eventItem}>
            {item.imageUrl && (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={EventListStyles.eventImage}
              />
            )}
            <Text style={EventListStyles.eventName}>{item.name}</Text>
            <Text style={EventListStyles.eventText}>Data: {item.date}</Text>
            <Text style={EventListStyles.eventText}>Categoria: {item.category}</Text>
            {item.description && <Text style={EventListStyles.eventText}>Descrição: {item.description}</Text>}
            {item.location && <Text style={EventListStyles.eventText}>Local: {item.location}</Text>}
            
            <View style={EventListStyles.actionsContainer}>
              <TouchableOpacity 
                style={EventListStyles.actionButton} 
                onPress={() => handleEdit(index, item)}
              >
                <Icon name="edit" size={wp('5%')} color="#007BFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={EventListStyles.actionButton} 
                onPress={() => handleDelete(index)}
              >
                <Icon name="delete" size={wp('5%')} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={EventListStyles.emptyText}>Nenhum evento cadastrado ainda.</Text>
        }
      />

      <TouchableOpacity 
        style={EventListStyles.menuButton} 
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Image source={require('../assets/form.png')} style={EventListStyles.icon} />
      </TouchableOpacity>

      {menuVisible && (
        <View style={EventListStyles.menu}>
          <TouchableOpacity 
            style={EventListStyles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Formulario');
            }}
          >
            <Text style={EventListStyles.menuText}>Criar Evento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default EventList;
