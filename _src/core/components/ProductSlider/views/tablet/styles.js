import {normalize} from '@app/styles/mixins';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: normalize(20),
    marginVertical: normalize(10),
  },
  headerTitle: {
    fontSize: 12,
  },
  headerTitleRight: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  mainContainer: {
    padding: normalize(5),
  },
});

export default styles;
