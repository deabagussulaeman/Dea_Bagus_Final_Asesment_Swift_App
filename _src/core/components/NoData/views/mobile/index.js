import React from 'react';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

const NoData = ({condition, children}) => {
  const {t} = useTranslation();
  return (
    <Section flex horizontalCenter verticalCenter>
      <Label center> {t('label.noData')}</Label>
    </Section>
  );
};

NoData.propTypes = {
  // condition
  condition: PropTypes.any,
  // children
  children: PropTypes.any,
};

export default NoData;
