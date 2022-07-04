import React from 'react';
import {Button} from 'react-native-paper';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import PropTypes from 'prop-types';

const MaintenanceModeView = ({t, onTryAgain, loading}) => {
  return (
    <Section flex alignCenter horizontalCenter verticalCenter>
      <Section horizontalCenter verticalCenter margin={30}>
        <Label xlarge>{t('maintenance_mode.title')}</Label>
        <Label center>{t('maintenance_mode.subtitle')}</Label>
      </Section>
      <Section marginVertical={10}>
        <Button
          loading={loading}
          disabled={loading}
          mode="contained"
          style={{width: 150}}
          onPress={onTryAgain}>
          {t('maintenance_mode.button')}
        </Button>
      </Section>
    </Section>
  );
};

MaintenanceModeView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // function in button
  onTryAgain: PropTypes.func,
  // loading state
  loading: PropTypes.bool,
};

export default MaintenanceModeView;
