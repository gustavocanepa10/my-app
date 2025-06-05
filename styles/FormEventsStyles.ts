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
    marginBottom: hp('2.5%'),
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
  // NOVOS ESTILOS PARA O DATEPICKER
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
    color: '#000', // Ou a cor de texto padrão
  },
});
