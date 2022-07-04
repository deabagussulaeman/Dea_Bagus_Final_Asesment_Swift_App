import React from 'react';
import {Colors} from 'react-native-paper';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {rxAppSnackbar, rxUserToken} from '@root/_src/core/services/cache';
import {useReactiveVar} from '@apollo/client';
import Section from '@app/components/Section';
import IconFeather from 'react-native-vector-icons/Feather';
import styles from '@app/_modules/main_home/atoms/NavBarRight/views/tablet/styles';
import {useTranslation} from 'react-i18next';

const NavBarRight = () => {
  const getRxUserToken = useReactiveVar(rxUserToken);
  const {t} = useTranslation();
  /**
   * ---------------------------------------------------- *
   * @function {onNavigateTrackNotification}
   * @summary for navigate to notification page
   * ---------------------------------------------------- *
   */
  const onNavigateTrackNotification = () => {
    if (getRxUserToken === null) {
      rxAppSnackbar({message: t('label.pleaseLoginFirst')});
    } else {
      navigateTo(
        modules.account_notification.enable,
        modules.account_notification.name,
      );
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function {onNavigateTrackOrder}
   * @summary for navigate to track order page
   * ---------------------------------------------------- *
   */
  const onNavigateTrackOrder = () => {
    if (getRxUserToken === null) {
      rxAppSnackbar({message: t('label.pleaseLoginFirst')});
    } else {
      navigateTo(
        modules.account_trackorder.enable,
        modules.account_trackorder.name,
      );
    }
  };

  return (
    <Section style={styles.navbarRightFrame}>
      <Section style={styles.navbarRightIconFrame}>
        <IconFeather
          name="file-text"
          color={Colors.white}
          onPress={() => onNavigateTrackOrder()}
          size={18}
        />
      </Section>
      <Section style={styles.navbarRightIconFrame}>
        <IconFeather
          name="bell"
          color={Colors.white}
          onPress={() => onNavigateTrackNotification()}
          size={18}
        />
      </Section>
    </Section>
  );
};

export default NavBarRight;
