import {StyleSheet} from 'react-native';
import {normalize, MAX_WIDTH} from '@app/styles/mixins';

const styles = StyleSheet.create({
  changePasswordButton: {
    alignSelf: 'center',
    marginVertical: normalize(20),
  },
  errorLabel: {
    marginTop: normalize(30),
  },

  subContainer: {
    paddingTop: normalize(20),
    width: MAX_WIDTH * 0.75,
    alignSelf: 'center',
  },
});

export default styles;
