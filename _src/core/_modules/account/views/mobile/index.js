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
import styles from '@app/_modules/account/views/mobile/styles';
import NavBar from '@app/components/NavBar';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const AccountMobileView = ({
  t,
  onLogOut,
  userData,
  onEditProfile,
  onNavigateMenuPage,
}) => {
  const theme = useTheme();
  const {disabled} = _.get(theme, 'colors');
  const NavigationBar = ({label, icon, onPress, mode, style}) => {
    return (
      <Button
        mode={mode}
        onPress={onPress}
        style={
          style || {
            width: '100%',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: disabled,
          }
        }
        contentStyle={
          !style && {
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
          }
        }
        compact={!mode && true}
        icon={({size, color}) => (
          <Icon color={mode ? color : disabled} size={size} name={icon} />
        )}>
        {label}
      </Button>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavBar
        type={TYPE_APPBAR}
        title={t('account.title.accountPreferences')}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Section style={{paddingHorizontal: 20, marginBottom: 10}}>
          <Show when={userData && userData?.firstname}>
            <TouchableRipple onPress={onEditProfile}>
              <Section horizontalCenter row paddingVertical={30}>
                <Avatar.Text
                  style={{marginRight: -20}}
                  labelStyle={{fontSize: 18}}
                  size={75}
                  label={_.first(_.words(userData?.firstname)) || 'U'}
                />
                <Badge style={{marginRight: 20}}>
                  <Icon name={'edit'} />
                </Badge>
                <Section>
                  <Show when={userData === null}>
                    <Label>{t('account.view.loading')}</Label>
                  </Show>
                  <Section horizontalStart>
                    <Show when={userData !== null}>
                      <Label large bold>
                        {_.startCase(userData?.firstname)}{' '}
                        {_.startCase(userData?.lastname)}
                      </Label>
                      <Caption>{userData?.email}</Caption>
                    </Show>
                  </Section>
                </Section>
              </Section>
            </TouchableRipple>
          </Show>
          {modules.account.atoms.menus.map((item, index) => {
            return (
              item.enable && (
                <NavigationBar
                  key={'navigation-bar-' + index}
                  label={t(`account.menu.${item.key}`)}
                  icon={item.icon}
                  onPress={() => onNavigateMenuPage(item)}
                />
              )
            );
          })}

          <NavigationBar
            label={t('account.btn.logout')}
            mode={'contained'}
            icon={'log-out'}
            onPress={onLogOut}
            style={{marginVertical: 20}}
          />
          <Label center>
            {DeviceInfo.getVersion()}
            {Config.MODE_ACTIVE === 'development' ||
            Config.MODE_ACTIVE === 'staging'
              ? ` (${Config.MODE_ACTIVE})`
              : ''}
          </Label>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

AccountMobileView.propTypes = {
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

export default AccountMobileView;
