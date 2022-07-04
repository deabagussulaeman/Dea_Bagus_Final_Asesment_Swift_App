import {StyleSheet} from 'react-native';
import {Colors, Mixins} from '@app/styles/index';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 55,
  },
  containerCheckWhatsApp: {
    marginTop: -15,
    marginBottom: 20,
  },
  containerCheckBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  containerCheck: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    marginStart: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonLoading: {
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  centerButton: {
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 5,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY,
    width: Mixins.MAX_WIDTH / 2,
  },
  buttonChangePassword: {
    marginTop: 10,
    paddingVertical: 2,
    marginBottom: 25,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    width: '60%',
  },
  buttonRow: {
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    width: '45%',
  },
  buttonCol: {
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY,
    width: '45%',
  },
});

export default styles;
