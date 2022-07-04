import {StyleSheet} from 'react-native';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';

const styles = StyleSheet.create({
  attachmentImage: {
    height: normalize(100),
  },
  attachmentImageText: {
    fontSize: normalize(8),
  },
  cancelButton: {
    alignSelf: 'center',
    marginVertical: normalize(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_LIGHT,
  },
  listContainer: {
    // paddingHorizontal: normalize(20),
    paddingHorizontal: Mixins.MAX_WIDTH * 0.125,
    alignSelf: 'center',
  },
  mainContainer: {
    height: Mixins.MAX_HEIGHT,
  },
  messageInput: {
    width: Mixins.MAX_WIDTH * 0.7,
    marginVertical: normalize(20),
  },
  packageSentText: {
    marginHorizontal: normalize(10),
  },
  productImage: {
    height: normalize(90),
    width: normalize(75),
    marginRight: normalize(10),
  },
  hideMessasgesButton: {
    borderWidth: 0,
    alignSelf: 'center',
  },
  hideMessasgesButtonText: {
    textDecorationLine: 'underline',
  },
});

export default styles;
