import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';

const styles = StyleSheet.create({
  frameSearchbar: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    width: '100%',
    padding: 8,
  },
  frameSearchInput: {
    flexDirection: 'row',
  },
  frameSearchbarMainSearch: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    width: '100%',
    marginVertical: 5,
  },
  frameSearchInputMainSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  frameSearchText: {
    color: Colors.black,
    marginLeft: 5,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});

export default styles;
