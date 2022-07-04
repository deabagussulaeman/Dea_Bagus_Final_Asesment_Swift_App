import {StyleSheet} from 'react-native';

import {Mixins} from '@app/styles';

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    marginTop: 40,
  },
  blogImageContainer: {
    width: '100%',
    height: Mixins.MAX_HEIGHT * 0.28,
  },
});

export default styles;
