import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  bannerFrame: {
    width: Mixins.MAX_WIDTH,
    alignSelf: 'center',
  },
  itemContainer: {
    flex: 0.5,
    width: Mixins.MAX_WIDTH * 0.5,
    alignItems: 'center',
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    padding: 15,
  },
  buttonFilter: {
    position: 'absolute',
    bottom: 20,
    left: '35%',
    right: '35%',
    zIndex: 1,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 4,
  },
  itemImage: {
    height: normalize(180),
    width: Mixins.MAX_WIDTH / 2 - 30,
    marginBottom: 20,
  },
});

export default styles;
