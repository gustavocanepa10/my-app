import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const FormEventsStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: wp('5%'),
    paddingBottom: hp('10%'),

  },
  title: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'),
    textAlign: 'center',
    color: '#1D4ED8',
  },
  label: {
    fontWeight: '600',
    marginBottom: hp('1%'),
    fontSize: wp('4%'),
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp('2.5%'),
    padding: hp('2%'),
    marginBottom: hp('2.5%'), // Mantido o marginBottom para espaçamento entre inputs
    fontSize: wp('4%'),
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp('2.5%'),
    marginBottom: hp('3%'),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    width: '100%',
    height: hp('6%'),
    color: 'black',
  },
  map: {
    width: '100%',
    height: hp('20%'),
    marginBottom: hp('2.5%'),
    borderRadius: wp('2.5%'),
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    gap: wp('2.5%'),
  },
  imageButton: {
    backgroundColor: '#2563EB',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2.5%'),
    flex: 1,
    alignItems: 'center',
    // 'width: "80%"' é redundante com flex: 1 se o container for flex row e tiver gap.
    // Se quiser que não ocupe 50% cada, ajuste o flex ou remova o flex e defina a largura em wp.
    // Por enquanto, mantenho para não alterar seu comportamento original.
    width: "80%"
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
  },
  previewImage: {
    width: '100%',
    height: hp('25%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('2.5%'),
  },
  // ESTILOS DO MENU FLUTUANTE (MANTIDOS AQUI, MAS LEMBRE-SE QUE PODEM SER REMOVIDOS SE NÃO FOREM USADOS NO FormEvents.tsx)
  menuButton: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('5%'),
    backgroundColor: '#007BFF',
    padding: hp('2%'),
    borderRadius: wp('10%'),
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: '#FFFFFF',
  },
  menu: {
    position: 'absolute',
    bottom: hp('11.5%'),
    right: wp('5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2.5%'),
    elevation: 5,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    width: wp('40%'),
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: wp('2%'),
  },
  menuText: {
    fontSize: wp('4%'),
    color: '#1D4ED8',
  },
  // ESTILOS PARA O DATEPICKER
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp('2.5%'),
    padding: hp('2%'),
    marginBottom: hp('2.5%'),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: wp('4%'),
    color: '#000',
  },
  // NOVOS ESTILOS PARA O CAMPO DE BUSCA DE CIDADE E BOTÃO
  searchMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'), // Espaçamento após o contêiner de busca
    gap: wp('2.5%'), // Espaçamento entre o input e o botão
  },
  searchMapInput: {
    flex: 1, // Faz o input ocupar o espaço restante na linha
    marginBottom: 0, // Remove o marginBottom padrão do input para que o espaçamento seja controlado pelo searchMapContainer
  },
  searchMapButton: {
    backgroundColor: '#007BFF', // Azul principal para o botão de busca
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    // Não precisa de marginBottom aqui, pois o container já lida
  },
  searchMapButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
  },
  // ESTILOS PARA O BOTÃO DE LOCALIZAÇÃO GPS (USAR MEU GPS ATUAL)
  locationButton: {
    backgroundColor: '#1D4ED8', // Cor que combina com seu tema, ou um azul principal
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2.5%'), // Espaço abaixo do botão
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
});