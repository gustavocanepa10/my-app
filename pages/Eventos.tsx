import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
  Formulario: undefined;
  ListadeEventos: undefined;
};

type InitialPageNavigationProp = StackNavigationProp<RootStackParamList, 'ListadeEventos'>;

export function EventList({ events }: { events: EventType[] }) {
  const navigation = useNavigation<InitialPageNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventText}>Data: {item.date}</Text>
            <Text style={styles.eventText}>Categoria: {item.category}</Text>
            {item.description && <Text style={styles.eventText}>Descrição: {item.description}</Text>}
            {item.location && <Text style={styles.eventText}>Local: {item.location}</Text>}
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
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ListadeEventos');
            }}
          >
           
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
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
    // padding: 10,
    alignItems: 'center',
    justifyContent : "center",
    borderRadius : 8
  },
  menuText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

