import {useEffect, useRef} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {modules} from '@root/swift.config';

const useRemoteConfig = ({useInitData = false}) => {
  const mount = useRef();

  const getRemoteConfig = async () => {
    await remoteConfig()
      .setDefaults({
        pwa_checkout: modules.cart_checkout_pwa.enable,
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(fetchedRemotely => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      });
  };

  useEffect(() => {
    mount.current = true;
    if (mount.current && useInitData) {
      getRemoteConfig();
    }
    return () => (mount.current = false);
  }, []);

  return {getRemoteConfig};
};

export default useRemoteConfig;
