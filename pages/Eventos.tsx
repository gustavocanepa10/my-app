import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.eventItem}>
            {item.imageUrl && (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.eventImage}
              />
            )}
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventText}>Data: {item.date}</Text>
            <Text style={styles.eventText}>Categoria: {item.category}</Text>
            {item.description && <Text style={styles.eventText}>Descrição: {item.description}</Text>}
            {item.location && <Text style={styles.eventText}>Local: {item.location}</Text>}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleEdit(index, item)}
              >
                <Icon name="edit" size={wp('5%')} color="#007BFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleDelete(index)}
              >
                <Icon name="delete" size={wp('5%')} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum evento cadastrado ainda.</Text>
        }
      />

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
              navigation.navigate('Formulario');
            }}
          >
            <Text style={styles.menuText}>Criar Evento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#f5f5f5',
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.5%'),
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.2%'),
  },
  eventName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  eventText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: hp('6%'),
    fontSize: wp('4%'),
    color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp('1%'),
    gap: wp('3%'),
  },
  actionButton: {
    padding: wp('2%'),
  },
  menuButton: {
    position: 'absolute',
    bottom: hp('2.5%'),
    right: wp('5%'),
    backgroundColor: '#007BFF',
    padding: wp('4%'),
    borderRadius: wp('8%'),
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    tintColor: '#fff',
  },
  menu: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('5%'),
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    elevation: 5,
    paddingVertical: hp('1.5%'),
    width: wp('40%'),
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: wp('2%'),
  },
  menuText: {
    fontSize: wp('4%'),
    color: '#007BFF',
  },
});

export default EventList;