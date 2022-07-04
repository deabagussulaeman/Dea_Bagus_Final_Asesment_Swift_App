import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Storage} from '@app/helpers/Storage';
import {modules, languages} from '@root/swift.config';
import Views from '@app/_modules/account_languages/views';

const LanguagesController = () => {
  if (!modules.account_languages.enable) {
    return null;
  }
  const {i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    checkCurrentLanguage();
  }, []);

  const checkCurrentLanguage = async () => {
    const currentLanguage = await Storage.get(Storage.name.USER_LANGUAGE);
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage.language);
    } else {
      setSelectedLanguage(languages[0]);
    }
  };

  const changeLanguage = async language => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    Storage.set(Storage.name.USER_LANGUAGE, {
      language: language,
    });
  };

  const controllerProps = {
    languages,
    selectedLanguage,
    changeLanguage,
  };

  return <Views {...controllerProps} />;
};

export default LanguagesController;
