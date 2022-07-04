import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {formatDateNotif} from '@app/helpers/General';
import Section from '@app/components/Section';
import NavBar from '@app/components/NavBar';
import Label from '@app/components/Label';
import styles from '@app/_modules/account_notification_detail/views/tablet/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import PropTypes from 'prop-types';

const NotificationDetailView = ({t, notification}) => {
  if (!notification) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('account_notification.title.notification')}
      />
      <Section style={styles.mainContainer}>
        <Label style={[styles.titleText]}>{notification.subject}</Label>
        <Label style={[styles.dateText]}>
          {formatDateNotif(notification.createdAt)}
        </Label>
        <Label>{notification.content}</Label>
      </Section>
    </>
  );
};

NotificationDetailView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // notification detail
  notification: PropTypes.array,
};

export default NotificationDetailView;
