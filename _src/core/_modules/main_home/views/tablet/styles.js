import {StyleSheet} from 'react-native';
import {Mixins, MixinsNew} from '@app/styles';

const styles = StyleSheet.create({
  containerScroll: {
    width: Mixins.MAX_WIDTH * 0.75,
    alignSelf: 'center',
    ...MixinsNew.padding({bottom: 70}),
  },
});

export default styles;
