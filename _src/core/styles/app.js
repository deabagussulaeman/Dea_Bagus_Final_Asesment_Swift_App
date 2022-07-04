/* eslint-disable no-undef */
import Normalize from 'react-native-normalize';
import * as Mixins from '@app/styles/mixins';
import * as Colors from '@app/styles/colors';
import * as Typography from '@app/styles/typography';
import {StyleSheet} from 'react-native';

export default appStyles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  textCenter: {textAlign: 'center'},
  fontBold: {
    ...Typography.FONT_BOLD,
    fontSize: Normalize(12),
    fontWeight: 'bold',
  },
  fontRegular: {
    ...Typography.FONT_REGULAR,

    fontSize: Normalize(12),
  },
  H3: {
    ...Typography.FONT_REGULAR,
    fontSize: Normalize(14),
  },
  matchParent: {width: '100%', height: '100%'},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  button: {
    ...Mixins.margin(0, 0, 0, 0),
    ...Mixins.padding(10, 0, 10, 0),
    width: 130,
  },
  buttonText: {
    fontSize: Mixins.scaleFont(11),
    ...Mixins.padding(0, 0, 0, 0),
    ...Typography.FONT_BOLD,
  },
  buttonTextRegular: {
    fontSize: Mixins.scaleFont(11),
    ...Typography.FONT_REGULAR,
  },
});
