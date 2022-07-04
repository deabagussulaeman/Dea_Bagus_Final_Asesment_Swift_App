import React from 'react';
import {PropTypes} from 'prop-types';
import Label from '@app/components/Label';
import {modules} from '@root/swift.config';
/**
 * ---------------------------------------------------- *
 * @components Views
 * @summary this is expample views
 * ---------------------------------------------------- *
 */
const BlankView = ({t}) => {
  if (!modules.blank.enable) {
    return null;
  }
  return <Label>{t('_blank.view.blank')}</Label>;
};

BlankView.propTypes = {
  name: PropTypes.function /* @summary use for translation */,
};

export default BlankView;
