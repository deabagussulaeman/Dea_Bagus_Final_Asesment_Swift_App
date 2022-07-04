import {useEffect, useState, useRef} from 'react';
import {GET_STORE_CONFIG} from '@app/services/queries/config';
import {useApolloClient} from '@apollo/client';
import {rxAppMaintenance} from '../services/cache';

const useStoreConfig = ({useInitData = false}) => {
  const [storeConfig, setStoreConfig] = useState(null);
  const client = useApolloClient();
  const mount = useRef();

  const getStoreConfig = async () => {
    try {
      const storeConfigData = await client.query({query: GET_STORE_CONFIG});
      if (storeConfigData) {
        const config = JSON.stringify(storeConfigData.data)
          .replace(/\\n/g, '')
          .replace(/\\r/g, '')
          .replace(/\\t/g, '');
        setStoreConfig(JSON.parse(config).storeConfig);
      }
      rxAppMaintenance(false);
    } catch (error) {
      rxAppMaintenance(true);
    }
  };

  useEffect(() => {
    mount.current = true;
    if (mount.current && useInitData) {
      getStoreConfig();
    }
    return () => (mount.current = false);
  }, []);

  return {storeConfig, getStoreConfig};
};

export default useStoreConfig;
