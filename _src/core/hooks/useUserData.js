import {useEffect, useState, useRef, useCallback} from 'react';
import {Storage} from '@app/helpers/Storage';
import {rxUserToken, rxUserType} from '@app/services/cache';

const useUserData = ({useInitData = false}) => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const [loading, setLoading] = useState(false);
  const mount = useRef();
  const onRefetchData = useCallback(async () => {
    setLoading(true);
    const getUserToken = await Storage.get(Storage.name.TOKEN);
    const getUserType = await Storage.get(Storage.name.USER_TYPE);
    rxUserToken(getUserToken);
    rxUserType(getUserType);
    setLoading(false);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current && useInitData) {
      onRefetchData();
    }
    return () => (mount.current = false);
  }, []);

  return {loading};
};

export default useUserData;
