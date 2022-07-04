import {StyleSheet} from 'react-native';
import {Colors} from '@app/styles';

const styles = StyleSheet.create({
  borderRadius50: {borderRadius: 50},
  navbarRightFrame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  navbarRightIconFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  navbarRightIcon: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 50,
    marginRight: 5,
  },
  navbarRightCartIcon: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 50,
  },
  cartItems: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.RED,
    borderRadius: 10,
    padding: 3,
  },
});

export default styles;
