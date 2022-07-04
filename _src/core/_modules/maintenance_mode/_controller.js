import React, {useState} from 'react';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/maintenance_mode/views';
import useStoreConfig from '@app/hooks/useStoreConfig';

const MaintenanceModeController = props => {
  if (!modules.maintenance_mode.enable) {
    return null;
  }

  const {t} = useTranslation();
  const {getStoreConfig} = useStoreConfig({useInitData: false});
  const [loading, setLoading] = useState(false);

  /**
   * ---------------------------------------------------- *
   * @function onTryAgain
   * @summary hit api to get store config for checking
   * ---------------------------------------------------- *
   */
  const onTryAgain = async () => {
    setLoading(true);
    await getStoreConfig();
    setLoading(false);
  };

  const controllerProps = {
    t,
    loading,
    setLoading,
    onTryAgain,
  };

  return <Views {...props} {...controllerProps} />;
};

export default MaintenanceModeController;
