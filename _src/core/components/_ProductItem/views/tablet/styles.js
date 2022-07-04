import {StyleSheet} from 'react-native';
import {MixinsNew} from '@app/styles/index';

const styles = StyleSheet.create({
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
  },
  frameProductItem: {
    ...MixinsNew.padding(10),
    width: 140,
  },
  productItemName: {
    ...MixinsNew.margin({top: 10}),
    fontSize: 11,
    marginHorizontal: 5,
  },
  productItemPrice: {
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 5,
  },
});

export default styles;
