import {StyleSheet} from 'react-native';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {Typography} from '@app/styles/index';

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.GRAY_MEDIUM,
    borderTopWidth: 0.5,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  mainContainer: {
    marginTop: 40,
    paddingBottom: 15,
    paddingHorizontal: (Mixins.MAX_WIDTH * 0.25) / 2,
  },
  listContainer: {
    width: Mixins.MAX_WIDTH * 0.75,
    marginTop: 10,
  },
  paymentButtonContainer: {
    height: normalize(35),
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 0,
    width: '90%',
    marginBottom: 20,
  },
  paymentButtonContainerDisabled: {
    backgroundColor: Colors.GRAY_MEDIUM,
  },
  paymentButtonText: {
    fontWeight: 'bold',
    fontSize: normalize(10),
  },
  priceBlockContainer: {
    borderColor: Colors.GRAY_MEDIUM,
    borderTopWidth: 0.5,
    width: Mixins.MAX_WIDTH,
    paddingVertical: normalize(10),
    backgroundColor: Colors.WHITE,
  },
  priceBlockTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(25),
  },
  subTotalSubContainer: {
    borderTopWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    paddingHorizontal: 20,
  },
  subtotal: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
  },
  navbarTitleStyle: {...Typography.FONT_BOLD, fontWeight: 'bold'},
  containerStyle: {paddingBottom: 50},
});

export default styles;
