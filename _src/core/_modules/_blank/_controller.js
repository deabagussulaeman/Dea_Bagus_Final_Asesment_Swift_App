import React from 'react';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/_blank/views';

const BlankController = props => {
  const {t} = useTranslation();
  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @return {object}
   * ---------------------------------------------------- *
   */
  const controllerProps = {t};

  return <Views {...props} {...controllerProps} />;
};

export default BlankController;
