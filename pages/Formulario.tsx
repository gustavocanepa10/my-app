import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, ScrollView, 
  Alert, TouchableOpacity, Image 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

type EventType = {
  name: string;
  date: string;
  category: string;
  description: string;
  location: string;
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


export function FormEvents({ handleAddEvent, navigation }: { 
  handleAddEvent: (event: EventType, navigation: any) => void;
  navigation: any;
}) {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    category: categories[0],
    description: '',
    location: '',
    imageUrl: ''
  });

  const [menuVisible, setMenuVisible] = useState(false);

  const handleSubmit = () => {
    if (!event.name || !event.date || !event.location) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    handleAddEvent(event, navigation);
    
    // Limpa o formulário
    setEvent({
      name: '',
      date: '',
      category: categories[0],
      description: '',
      location: '',
      imageUrl: ''
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CRIAR EVENTO</Text>

      <Text style={styles.label}>Nome do Evento *</Text>
      <TextInput
        style={styles.input}
        value={event.name}
        onChangeText={(text) => setEvent({...event, name: text})}
        placeholder="Ex: Festa de Aniversário"
      />

      <Text style={styles.label}>Data (DD/MM/AAAA) *</Text>
      <TextInput
        style={styles.input}
        value={event.date}
        onChangeText={(text) => setEvent({...event, date: text})}
        placeholder="Ex: 25/12/2025"
      />

      <Text style={styles.label}>Local *</Text>
      <TextInput
        style={styles.input}
        value={event.location}
        onChangeText={(text) => setEvent({...event, location: text})}
        placeholder="Ex: Centro de Convenções"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={event.description}
        onChangeText={(text) => setEvent({...event, description: text})}
        placeholder="Detalhes sobre o evento"
        multiline
      />

      <Text style={styles.label}>URL da Imagem (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={event.imageUrl || ''}
        onChangeText={(text) => setEvent({...event, imageUrl: text})}
        placeholder="Ex: https://exemplo.com/imagem.jpg"
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={event.category}
          onValueChange={(itemValue) => setEvent({...event, category: itemValue})}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Criar Evento" 
          onPress={handleSubmit} 
          color="#007BFF"
        />
      </View>

      <Text style={styles.requiredText}>* Campos obrigatórios</Text>

      {/* Botão de menu */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Image source={require('../assets/form.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* Menu suspenso */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ListadeEventos');
            }}
          >
           
            <Text style={styles.menuText}>Ver Eventos</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  requiredText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  menuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 30,
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
    padding: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#007BFF',
  },
});
