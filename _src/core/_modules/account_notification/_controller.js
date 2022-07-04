import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {
  GET_NOTIFICATIONS,
  READ_NOTIFICATION,
} from '@app/_modules/account_notification/services/schema';
import Views from '@app/_modules/account_notification/views';
import {useTranslation} from 'react-i18next';

const NotificationController = () => {
  if (!modules.account_notification.enable) {
    return null;
  }

  const [notifications, setNotifications] = useState([]);
  const {data, loading} = useCustomQuery({
    schema: GET_NOTIFICATIONS,
    useInitData: true,
  });
  const {onRefetchData: readNotificationHook} = useCustomMutation({
    schema: READ_NOTIFICATION,
  });
  const {t} = useTranslation();

  useEffect(() => {
    if (data?.data) {
      setNotifications(data?.data.customerNotificationList.items);
    }
  }, [data]);

  const readNotification = entityId => {
    const notification = notifications.filter(
      notif => notif.entityId === entityId,
    );
    readNotificationHook({
      params: {
        entityId,
      },
    });
    navigateTo(
      modules.account_notification_detail.enable,
      modules.account_notification_detail.name,
      notification[0],
    );
  };

  const controllerProps = {
    t,
    loading,
    notifications,
    readNotification,
  };

  return <Views {...controllerProps} />;
};

export default NotificationController;
