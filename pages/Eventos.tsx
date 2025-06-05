// EventList.tsx (ou Eventos.tsx)
import React, { useState, useEffect } from 'react'; // Removido React.useCallback não utilizado diretamente aqui
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, Button } from 'react-native';
import { useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native'; // Adicionado RouteProp
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventListStyles } from '../styles/EventListStyles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Importe os hooks e o tipo EventDbEntry
import { useDatabase } from '../database/dataBaseContext'; // Ajuste o caminho se necessário
import { useAuth } from '../database/AuthContext';         // Ajuste o caminho se necessário
import { EventDbEntry } from '../database/initializeDatabase'; // Ou de onde você exportou EventDbEntry

// Ajuste RootStackParamList para que Formulario receba EventDbEntry
type RootStackParamList = {
  PaginaInicial: undefined;
  TeladeLogin: undefined;
  TelaCadastro: undefined; // Adicionamos esta tela
  Formulario: { eventToEdit?: EventDbEntry }; // Espera o objeto EventDbEntry completo
  ListadeEventos: undefined;
};

type EventListNavigationProp = StackNavigationProp<RootStackParamList, 'ListadeEventos'>;

export function EventList() {
  const navigation = useNavigation<EventListNavigationProp>();
  const { db } = useDatabase();
  const { currentUser, logout } = useAuth(); // Adicionado logout aqui

  const [events, setEvents] = useState<EventDbEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const handleShareDB = async () => {
  const dbName = "meuAppDB.db";
  const dbUri = FileSystem.documentDirectory + `SQLite/${dbName}`;

  try {
    // Verifica se o arquivo existe antes de tentar compartilhar
    const fileInfo = await FileSystem.getInfoAsync(dbUri);
    if (!fileInfo.exists) {
      alert("Arquivo do banco de dados não encontrado!");
      console.log("Arquivo do banco de dados não encontrado em:", dbUri);
      return;
    }

    // Verifica se o compartilhamento está disponível
    if (!(await Sharing.isAvailableAsync())) {
      alert("Compartilhamento não disponível neste dispositivo.");
      return;
    }

    await Sharing.shareAsync(dbUri, {
      dialogTitle: 'Compartilhar banco de dados meuAppDB.db',
      mimeType: 'application/octet-stream', // Tipo genérico para arquivos .db
    });
  } catch (error) {
    console.error("Erro ao compartilhar o banco de dados:", error);
    alert("Erro ao compartilhar o banco de dados.");
  }
};

  const fetchEvents = async () => {
    if (!db || !currentUser?.id) {
      setEvents([]);
      setIsLoading(false);
      if (!currentUser?.id) {
          console.log("[EventList] Nenhum usuário logado para buscar eventos.");
      }
      return;
    }
    console.log(`[EventList] Buscando eventos para userId: ${currentUser.id}`);
    setIsLoading(true);
    try {
      const fetchedEvents = await db.getAllAsync<EventDbEntry>(
        'SELECT * FROM events WHERE userId = ? ORDER BY date DESC, name ASC;',
        [currentUser.id]
      );
      setEvents(fetchedEvents || []);
      console.log(`[EventList] Eventos buscados: ${fetchedEvents?.length || 0}`);
    } catch (error) {
      console.error("[EventList] Erro ao buscar eventos:", error);
      Alert.alert("Erro ao Carregar", "Não foi possível carregar os eventos.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Este console.log é útil para ver quando a busca é acionada
      // console.log("[EventList] Tela ganhou foco. currentUser:", currentUser, "DB disponível:", !!db);
      if (currentUser && db) { // Garante que temos usuário e db antes de buscar
        fetchEvents();
      } else if (!currentUser) {
        // Se por algum motivo chegar aqui sem usuário, talvez redirecionar para login
        Alert.alert("Sessão Expirada", "Por favor, faça login novamente.", [
          { text: "OK", onPress: () => navigation.replace('TeladeLogin') }
        ]);
        setIsLoading(false); // Para não ficar em loading infinito se não tiver usuário
        setEvents([]); // Limpa eventos
      }
    }, [db, currentUser?.id]) // Dependência no currentUser.id para refazer se o usuário mudar
  );

  const handleEdit = (event: EventDbEntry) => {
    navigation.navigate('Formulario', { eventToEdit: event });
  };

  const handleDelete = (eventId: number) => {
    if (!db || !currentUser?.id) return;

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setIsLoading(true); // Feedback visual durante a exclusão
            try {
              await db.runAsync('DELETE FROM events WHERE id = ? AND userId = ?;', [eventId, currentUser.id]);
              Alert.alert('Sucesso', 'Evento excluído.');
              fetchEvents(); // Atualiza a lista
            } catch (error) {
              console.error("[EventList] Erro ao excluir evento:", error);
              Alert.alert("Erro ao Excluir", "Não foi possível excluir o evento.");
              setIsLoading(false); // Garante que o loading termine se houver erro
            }
            // setIsLoading(false) é coberto pelo fetchEvents no finally, ou aqui se fetchEvents falhar antes do finally
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    navigation.replace('TeladeLogin');
  }

  if (isLoading && !events.length) { // Mostra loading apenas se estiver carregando e não tiver eventos ainda
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
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View style={EventListStyles.eventItem}>
            {item.imageUrl && ( <Image source={{ uri: item.imageUrl }} style={EventListStyles.eventImage} /> )}
            <Text style={EventListStyles.eventName}>{item.name}</Text>
            <Text style={EventListStyles.eventText}>Data: {item.date}</Text>
            <Text style={EventListStyles.eventText}>Categoria: {item.category}</Text>
            {item.manualLocation && <Text style={EventListStyles.eventText}>Local: {item.manualLocation}</Text>}
            {item.gpsLocation && <Text style={EventListStyles.eventText}>GPS: {item.gpsLocation}</Text>}
            {item.description && <Text style={EventListStyles.eventText}>Descrição: {item.description}</Text>}
            <View style={EventListStyles.actionsContainer}>
              <TouchableOpacity style={EventListStyles.actionButton} onPress={() => handleEdit(item)}>
                <Icon name="edit" size={wp('5%')} color="#007BFF" />
              </TouchableOpacity>
              <TouchableOpacity style={EventListStyles.actionButton} onPress={() => handleDelete(item.id!)}>
                <Icon name="delete" size={wp('5%')} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoading && ( // Só mostra "nenhum evento" se não estiver carregando
            <View style={EventListStyles.emptyContainer}>
              <Text style={EventListStyles.emptyText}>
                {currentUser ? "Nenhum evento cadastrado ainda." : "Faça login para ver seus eventos."}
              </Text>
              {currentUser && (
                <TouchableOpacity
                    style={EventListStyles.menuItemButton} // Use um estilo de botão aqui
                    onPress={() => navigation.navigate('Formulario')}
                >
                    <Text style={EventListStyles.menuItemButtonText}>Criar Novo Evento</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        refreshing={isLoading} // Adiciona um indicador de refresh ao FlatList
        onRefresh={fetchEvents} // Permite "puxar para atualizar"
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
      <View>
        <Button title="Compartilhar Banco de Dados" onPress={handleShareDB} />

      </View>
      
    </View>
  );
}