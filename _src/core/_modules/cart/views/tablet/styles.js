import {StyleSheet} from 'react-native';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';

const styles = StyleSheet.create({
  cartItemActionIcon: {
    borderRadius: normalize(25),
    backgroundColor: Colors.GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(5),
  },

  cartItemContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.GRAY_MEDIUM,
  },

  cartItemDetailText: {
    marginBottom: normalize(3),
  },

  cartItemImage: {
    height: normalize(140),
    width: Mixins.MAX_WIDTH * 0.3,
    borderColor: Colors.GRAY_MEDIUM,
    borderWidth: 1,
    borderRadius: normalize(10),
    resizeMode: 'contain',
  },

  checkOutButtonContainer: {
    height: normalize(40),
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 0,
    width: '60%',
  },

  checkOutButtonText: {
    fontWeight: 'bold',
    fontSize: normalize(11),
  },

  listContainer: {
    width: Mixins.MAX_WIDTH,
    paddingHorizontal: (Mixins.MAX_WIDTH * 0.25) / 2,
    alignSelf: 'center',
    // paddingTop: normalize(20),
    marginBottom: 5,
  },

  subTotalSubContainer: {
    // width: '40%',
    borderColor: Colors.GRAY_LIGHT,
  },

  wishlistIcon: {
    // backgroundColor: Colors.GRAY_LIGHT,
    // borderRadius: normalize(25),
    // padding: normalize(6),
    borderRadius: normalize(25),
    backgroundColor: Colors.GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(5),
    marginRight: 15,
  },
});

export default styles;
