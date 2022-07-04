import React from 'react';
import Label from '@app/components/Label';
import {useTranslation} from 'react-i18next';
import {modules} from '@root/swift.config';

const ReturnsView = () => {
  const {t} = useTranslation();

  if (!modules.account_returns.enable) {
    return null;
  }
  return <Label>{t('account_returns.view.blankView')}</Label>;
};

export default ReturnsView;
