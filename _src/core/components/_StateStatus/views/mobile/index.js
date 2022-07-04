import React from 'react';
import Label from '@app/components/Label';
import {Colors} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import IconFeather from 'react-native-vector-icons/Feather';
import Section from '@app/components/Section';

const StatusState = ({iconName = 'alert-circle'}) => {
  const {t} = useTranslation();
  return (
    <Section verticalCenter horizontalCenter marginTop={40}>
      <IconFeather name={iconName} size={50} color={Colors.grey400} />
      <Label style={{color: Colors.grey400}}>{t('label.noData')}</Label>
    </Section>
  );
};

StatusState.propTypes = {
  // icon name
  iconName: PropTypes.string,
};

export default StatusState;
