import React, {useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import Views from '@app/_modules/account_settings/views';
import {modules} from '@root/swift.config';
import {rxUserTheme} from '@app/services/cache';
import {Storage} from '@app/helpers/Storage';
import {DARK, LIGHT} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';

const SettingsController = () => {
  if (!modules.account_settings.enable) {
    return null;
  }

  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const [isDarkMode, setIsDarkMode] = useState(
    getRxUserTheme === 'dark' ? true : false,
  );
  const {t} = useTranslation();

  const onSwitchTheme = dark => {
    if (dark) {
      setIsDarkMode(true);
      rxUserTheme(DARK);
      Storage.set(Storage.name.USER_THEME, DARK);
    } else {
      setIsDarkMode(false);
      rxUserTheme(LIGHT);
      Storage.set(Storage.name.USER_THEME, LIGHT);
    }
  };

  const controllerProps = {
    t,
    isDarkMode,
    onSwitchTheme,
  };

  return <Views {...controllerProps} />;
};

export default SettingsController;
