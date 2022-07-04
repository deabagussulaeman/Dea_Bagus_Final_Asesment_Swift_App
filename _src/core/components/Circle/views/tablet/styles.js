import {StyleSheet} from 'react-native';
import {Typography} from '@app/styles';

const styles = StyleSheet.create({
  circlePosition: {
    position: 'absolute',
    alignSelf: 'center',
  },

  circleText: {
    textAlign: 'center',
    ...Typography.FONT_BOLD,
  },
});

export default styles;
