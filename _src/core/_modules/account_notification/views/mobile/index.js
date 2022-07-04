import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {Colors} from '@app/styles';
import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import styles from '@app/_modules/account_notification/views/mobile/styles';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const NotificationView = ({t, notifications, readNotification, loading}) => {
  const NotificationItem = ({notification, onPress}) => {
    return (
      <Section style={styles.barContainer} onPress={onPress}>
        <Label
          style={[
            {
              color: notification.unread ? Colors.BLACK : Colors.GRAY_MEDIUM,
            },
          ]}>
          {notification.subject}
        </Label>
      </Section>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_notification.title.notification')}
      />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}>
        <Show when={!loading && notifications.length === 0}>
          <Label style={[styles.marginSpacing]}>
            {t('account_notification.view.noNotification')}
          </Label>
        </Show>
        <Show when={!loading}>
          {notifications.map((notification, index) => {
            return (
              <NotificationItem
                notification={notification}
                onPress={() => readNotification(notification.entityId)}
                key={notification.subject + '' + index}
              />
            );
          })}
        </Show>
        <Show when={loading}>
          <ActivityIndicator style={styles.marginSpacing} />
        </Show>
      </ScrollView>
    </>
  );
};

NotificationView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // shows loading
  loading: PropTypes.bool,
  // list of notifications
  notifications: PropTypes.array,
  //func to read notification
  readNotification: PropTypes.func,
};

export default NotificationView;
