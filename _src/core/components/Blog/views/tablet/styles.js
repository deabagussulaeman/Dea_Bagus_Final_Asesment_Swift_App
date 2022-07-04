import {StyleSheet} from 'react-native';
import {MixinsNew} from '@app/styles/index';

const styles = StyleSheet.create({
  categoryRowContainer: {
    ...MixinsNew.padding({left: 20, right: 20}),
  },
  btnCategory: {
    ...MixinsNew.margin({right: 10}),
  },
});
export default styles;
