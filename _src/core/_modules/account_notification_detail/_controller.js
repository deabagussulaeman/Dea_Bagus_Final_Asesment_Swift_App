import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Views from '@app/_modules/account_notification_detail/views';
import {modules} from '@root/swift.config';

const NotificationDetailController = ({route}) => {
  if (!modules.account_notification_detail.enable) {
    return null;
  }

  const [notification, setNotification] = useState(null);
  useEffect(() => {
    if (route.params) {
      setNotification(route.params.variables);
    }
  }, [route]);
  return <Views notification={notification} />;
};

NotificationDetailController.propTypes = {
  // route
  route: PropTypes.any,
};

export default NotificationDetailController;
