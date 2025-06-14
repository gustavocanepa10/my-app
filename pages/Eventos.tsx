// pages/Eventos.tsx - VERSÃO ATUALIZADA COM BACKEND

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventListStyles } from '../styles/EventListStyles';

import { useAuth } from '../database/AuthContext';
import { EventDbEntry } from '../database/initializeDatabase';

// Definindo a URL da API aqui também.
// Lembre-se de usar o mesmo IP do AuthContext!
const API_URL = 'http://192.168.3.111:3000'; 

type RootStackParamList = {
  TeladeLogin: undefined;
  Formulario: { eventToEdit?: EventDbEntry };
  ListadeEventos: undefined;
};

type EventListNavigationProp = StackNavigationProp<RootStackParamList, 'ListadeEventos'>;

export function EventList() {
  const navigation = useNavigation<EventListNavigationProp>();
  const { currentUser, logout } = useAuth();

  const [events, setEvents] = useState<EventDbEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchEvents = async () => {
    if (!currentUser?.id) {
      // Se não há usuário, não há o que buscar. Limpa a lista.
      setEvents([]);
      setIsLoading(false);
      navigation.replace('TeladeLogin'); // Redireciona para o login
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/events`);
      if (!response.ok) {
        throw new Error('Falha ao buscar eventos do servidor.');
      }
      const fetchedEvents = await response.json();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("[EventList] Erro ao buscar eventos:", error);
      Alert.alert("Erro ao Carregar", "Não foi possível carregar os eventos do servidor.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useFocusEffect é ótimo para recarregar os dados sempre que a tela recebe foco.
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [currentUser?.id])
  );

  const handleEdit = (event: EventDbEntry) => {
    navigation.navigate('Formulario', { eventToEdit: event });
  };

  const handleDelete = (eventId: number) => {
    if (!currentUser?.id) return;

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                // O backend que criamos precisa do userId para autorizar a exclusão
                body: JSON.stringify({ userId: currentUser.id })
              });

              if (!response.ok) {
                 throw new Error('Você não tem permissão para excluir este evento ou o evento não foi encontrado.');
              }

              Alert.alert('Sucesso', 'Evento excluído.');
              // Re-busca os eventos para atualizar a lista
              fetchEvents(); 
            } catch (error: any) {
              console.error("[EventList] Erro ao excluir evento:", error);
              Alert.alert("Erro ao Excluir", error.message || "Não foi possível excluir o evento.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleLogout = () => {
    setMenuVisible(false);
    logout(); // A função de logout do contexto já limpa o usuário
    navigation.replace('TeladeLogin');
  }

  if (isLoading) {
    return (
      <View style={EventListStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={EventListStyles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={EventListStyles.eventItem}>
            {item.imageUrl && ( <Image source={{ uri: item.imageUrl }} style={EventListStyles.eventImage} /> )}
            <Text style={EventListStyles.eventName}>{item.name}</Text>
            <Text style={EventListStyles.eventText}>Data: {item.date}</Text>
            <Text style={EventListStyles.eventText}>Categoria: {item.category}</Text>
            {item.manualLocation && <Text style={EventListStyles.eventText}>Local: {item.manualLocation}</Text>}
            <View style={EventListStyles.actionsContainer}>
              <TouchableOpacity style={EventListStyles.actionButton} onPress={() => handleEdit(item)}>
                <Icon name="edit" size={24} color="#007BFF" />
              </TouchableOpacity>
              <TouchableOpacity style={EventListStyles.actionButton} onPress={() => handleDelete(item.id!)}>
                <Icon name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={EventListStyles.emptyContainer}>
            <Text style={EventListStyles.emptyText}>Nenhum evento cadastrado ainda.</Text>
            <TouchableOpacity
                style={EventListStyles.menuItemButton}
                onPress={() => navigation.navigate('Formulario')}
            >
                <Text style={EventListStyles.menuItemButtonText}>Criar Primeiro Evento</Text>
            </TouchableOpacity>
          </View>
        }
        onRefresh={fetchEvents}
        refreshing={isLoading}
      />

      <TouchableOpacity style={EventListStyles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
        <Image source={require('../assets/form.png')} style={EventListStyles.icon} />
      </TouchableOpacity>

      {menuVisible && (
        <View style={EventListStyles.menu}>
          <TouchableOpacity style={EventListStyles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Formulario'); }}>
            <Text style={EventListStyles.menuText}>Criar Evento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={EventListStyles.menuItem} onPress={handleLogout} >
            <Text style={EventListStyles.menuText}>Sair (Logout)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}