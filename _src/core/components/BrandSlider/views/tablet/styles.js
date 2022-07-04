import {StyleSheet} from 'react-native';
import {Colors, MixinsNew} from '@app/styles';
import {normalize} from '@app/styles/mixins';

const styles = StyleSheet.create({
  brandIconContainer: {
    flex: 1,
    width: normalize(70),
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconImage: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(10),
    borderColor: Colors.GRAY_MEDIUM,
    alignSelf: 'center',
    borderWidth: 0.5,
  },
  brandIconTitle: {
    textAlign: 'center',
    fontSize: 12,
    ...MixinsNew.margin({top: 8}),
  },
  headerText: {
    marginVertical: normalize(10),
    fontSize: 12,
    ...MixinsNew.padding({left: 10}),
  },
});

export default styles;
