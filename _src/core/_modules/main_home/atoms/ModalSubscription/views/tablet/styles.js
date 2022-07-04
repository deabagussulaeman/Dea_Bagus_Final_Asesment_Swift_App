import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  modalContainer: {
    width: Dimensions.get('screen').width * 0.6,
    alignSelf: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
});

export default styles;
