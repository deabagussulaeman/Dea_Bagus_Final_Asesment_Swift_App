import {StyleSheet} from 'react-native';
import {Mixins, MixinsNew} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {Colors} from 'react-native-paper';

const styles = StyleSheet.create({
  categoryImageContainer: {
    flex: 1,
    width: normalize(60),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  categoryImage: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(10),
    borderColor: Colors.GRAY_MEDIUM,
    alignSelf: 'center',
    borderWidth: 0.5,
  },

  categoryTitle: {
    textAlign: 'center',
    fontSize: 10,
    ...MixinsNew.margin({top: 8}),
  },

  listContainer: {
    height: normalize(40),
    width: Mixins.MAX_WIDTH * 0.75,
    paddingTop: normalize(15),
  },
});

export default styles;
