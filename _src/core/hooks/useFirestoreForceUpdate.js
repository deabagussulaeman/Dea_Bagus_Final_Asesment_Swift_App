import {useEffect, useState, useRef} from 'react';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';
import FirestoreHelper from '../helpers/Firestore';
import {
  STOREURL_ANDROID,
  STOREID_ANDROID,
  STOREURL_IOS,
  STOREID_IOS,
} from '@app/helpers/Constants';
import {GLOBAL} from '@root/swift.config';

const useFirestoreForceUpdate = () => {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState(false);
  const mount = useRef();

  const onCheckAppVersion = async () => {
    try {
      const check = await checkVersion({
        version: DeviceInfo.getVersion(),
        iosStoreURL: `${STOREURL_IOS}/${STOREID_IOS}?mt=8`,
        androidStoreURL: `${STOREURL_ANDROID}?id=${STOREID_ANDROID}`,
        country: 'id',
      });
      if (check.result === 'new' && GLOBAL.APP_FORCE_UPDATE) {
        setUpdates(true);
      }
    } catch (e) {
      console.log('[err] check version: ', e);
    }
  };

  const onInitFirestore = async () => {
    const FirestoreListener = new FirestoreHelper();
    FirestoreListener.onSnapshot(FirestoreListener.doc.MODULES, snapshot => {
      if (snapshot !== null) {
        const modules = snapshot.data();
        if (modules !== undefined) {
          if (modules.forceUpdate === true) {
            onCheckAppVersion();
          }
        }
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      onInitFirestore();
    }
    return () => (mount.current = false);
  }, [updates]);

  return {
    loading,
    updates,
  };
};

export default useFirestoreForceUpdate;
