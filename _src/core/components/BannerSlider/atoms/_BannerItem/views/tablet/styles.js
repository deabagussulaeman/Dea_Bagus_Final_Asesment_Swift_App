/* eslint-disable no-undef */
import {StyleSheet} from 'react-native';
import {Colors, Mixins} from '@app/styles/index';

const sliderHeight = {
  height: 180,
};

export default styles = StyleSheet.create({
  frameContainer: {borderRadius: 8, backgroundColor: 'transparent'},
  sliderImage: {
    backgroundColor: Colors.TRANSPARENT,
    width: Mixins.MAX_WIDTH * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    ...sliderHeight,
  },
});
