import {StyleSheet} from 'react-native';
import {normalize, MAX_WIDTH} from '@app/styles/mixins';

const styles = StyleSheet.create({
  saveButton: {
    alignSelf: 'center',
    marginVertical: normalize(50),
  },
  subContainer: {
    paddingTop: normalize(20),
    width: MAX_WIDTH * 0.75,
    alignSelf: 'center',
  },
  labelBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    marginTop: -55,
  },
  footer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default styles;
