import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const EventListStyles = StyleSheet.create({
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
