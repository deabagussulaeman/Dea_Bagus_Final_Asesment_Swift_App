import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  // start add script for asesment task (author: Dea Bagus Sulaeman)
  deaHeader:{
    backgroundColor: '#F7B0BB',
  },
  // end add script for asesment task (author: Dea Bagus Sulaeman)
  frameNavbar: {
    flexDirection: 'row',
    backgroundColor: '#F7B0BB',
    color: 'blue'
  },
  frameBackButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '22%',
  },
  frameLogo: {
    width: 60,
    left: 10,
    resizeMode: 'contain',
  },
  frameSearch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameRightChildren: {width: '20%', flexDirection: 'row'},
});

export default styles;
