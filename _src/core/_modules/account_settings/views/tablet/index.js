import React from 'react';
import {Switch} from 'react-native';
import {useTheme} from 'react-native-paper';
import NavBar from '@app/components/NavBar';
import FontSizeSelector from '@app/components/FontSizeSelector';
import FontFamilySelector from '@app/components/FontFamilySelector';
import _ from 'lodash';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import PropTypes from 'prop-types';

const SettingsView = ({t, isDarkMode, onSwitchTheme}) => {
  const theme = useTheme();
  const {disabled} = _.get(theme, 'colors');
  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('account_settings.title.settings')}
        useBack
      />
      <Section
        style={{
          width: '100%',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: disabled,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Label large>{t('account_settings.view.darkAppearance')}</Label>
        <Switch value={isDarkMode} onValueChange={onSwitchTheme} />
      </Section>
      <FontSizeSelector />
      <Section
        style={{
          borderBottomWidth: 1,
          borderBottomColor: disabled,
        }}
      />
      <FontFamilySelector />
    </>
  );
};

SettingsView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // bool of dark mode
  isDarkMode: PropTypes.bool,
  // func to switch theme
  onSwitchTheme: PropTypes.func,
};

export default SettingsView;
