import { StyleSheet } from 'react-native';

export const PaginaInicialStyles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 20,
    gap: 20 // Note: 'gap' é uma propriedade CSS Flexbox mais recente, pode não ser suportada em todas as versões antigas do React Native
  },
  logo: {
    width: 200, 
    height: 200
  },
});
