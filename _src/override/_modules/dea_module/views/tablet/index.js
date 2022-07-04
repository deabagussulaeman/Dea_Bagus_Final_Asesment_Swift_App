import React from 'react';
import {
  Button,
  useTheme,
  Avatar,
  TouchableRipple,
  Caption,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {SafeAreaView, ScrollView} from 'react-native';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import Section from '@app/components/Section/index';
import styles from '@app/_modules/dea_module/views/tablet/styles';
import NavBar from '@app/components/NavBar';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const DeaModuleTabletView = ({
  t,
  onLogOut,
  userData,
  onEditProfile,
  onNavigateMenuPage,
}) => {
  const theme = useTheme();
  const {disabled} = _.get(theme, 'colors');
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavBar
        type={TYPE_APPBAR}
        title={t('dea_module.title.name')}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Section style={{paddingHorizontal: 20, marginBottom: 10}}>
          <Label>Dea Module Tablet</Label>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

DeaModuleTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // use for displaying label from translation module
  onLogOut: PropTypes.func,
  // for condition render
  userData: PropTypes.object,
  // function for edit profile
  onEditProfile: PropTypes.func,
  // function for navigate
  onNavigateMenuPage: PropTypes.func,
};

export default DeaModuleTabletView;
