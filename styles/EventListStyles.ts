import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const EventListStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#f5f5f5',
  },
  // Novo: Estilo para o container de carregamento
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Mesma cor de fundo do container principal
    padding: wp('5%'),
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
  // Novo: Estilo para o container da mensagem de lista vazia
  emptyContainer: {
    flex: 1, // Para ocupar o espaço disponível se a lista estiver vazia
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'), // Para não colar nas laterais
  },
  emptyText: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: '#888',
    marginBottom: hp('3%'), // Espaço antes do botão "Criar Novo Evento"
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
    bottom: hp('10%'),
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
    bottom: hp('18%'), 
    right: wp('5%'),
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    elevation: 6,
    paddingVertical: hp('1%'),
    width: wp('45%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  menuText: {
    fontSize: wp('4%'),
    color: '#007BFF',
    textAlign: 'left',
  },
  menuItemButton: {
    backgroundColor: '#007BFF',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
    elevation: 2,
    marginTop: hp('2%'),
  },
  menuItemButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});