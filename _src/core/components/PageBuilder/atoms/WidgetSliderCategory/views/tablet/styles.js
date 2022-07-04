import {StyleSheet} from 'react-native';
import {MixinsNew} from '@app/styles';

const styles = StyleSheet.create({
  mainFrame: {
    width: MixinsNew.MAX_WIDTH,
  },
  categoryImageContainer: {},
  categoryImage: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignSelf: 'center',
  },

  categoryTitle: {
    textAlign: 'center',
    fontSize: 10,
    ...MixinsNew.margin({top: 10}),
  },
});

export default styles;
