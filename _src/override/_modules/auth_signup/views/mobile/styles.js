import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 30,
    marginBottom: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  caption: {
    paddingHorizontal: 20,
  },
  labelBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footerForm: {
    marginTop: -55,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  // start add script for asesment task (author: Dea Bagus Sulaeman)
    button: {
      marginTop: 10,
      marginBottom: 15,
      paddingVertical: 5,
      backgroundColor: '#F7B0BB',
      borderRadius: 20,
    },
  // end add script for asesment task (author: Dea Bagus Sulaeman)
});

export default styles;
