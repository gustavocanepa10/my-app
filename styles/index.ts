// styles/index.ts
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Estilos para PaginaInicial
export const initialPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    gap: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
});

// Estilos para TeladeLogin
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  logo: {
    width: 200,
    height: 180,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '85%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    width: '85%',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  biometricButton: {
    height: 50,
    width: '85%',
    backgroundColor: '#34C759',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

// Estilos para EventList
export const eventListStyles = StyleSheet.create({
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

// Estilos para FormEvents
export const formStyles = StyleSheet.create({
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
});