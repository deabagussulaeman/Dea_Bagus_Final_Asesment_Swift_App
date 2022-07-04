import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';

class Firestore {
  doc = {
    VERSION: 'version',
    MODULES: 'modules',
    DYNAMIC_LINK: 'dynamic_link',
  };

  constructor() {
    this.collection = firestore().collection(Config.MODE_ACTIVE);
  }

  onSnapshot(doc, callback) {
    this.collection.doc(doc).onSnapshot(
      snapshot => {
        callback(snapshot || null);
      },
      err => console.log(err),
    );
  }
}

export const firestoreHelper = async doc => {
  const res = await firestore().collection(Config.MODE_ACTIVE).doc(doc).get();
  if (res) {
    return res;
  }

  return null;
};

export default Firestore;
