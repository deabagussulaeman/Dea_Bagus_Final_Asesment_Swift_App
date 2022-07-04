import React, {useEffect, useState} from 'react';
import {modules} from '@root/swift.config';
import {
  GET_SUBSCRIPTION_STATUS,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from '@app/_modules/account_newsletter/services/schema';
import {useReactiveVar} from '@apollo/client';
import useCustomQuery from '@app/hooks/useCustomQuery';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {rxAppSnackbar, rxUserInformation} from '@app/services/cache';
import {useTranslation} from 'react-i18next';
import View from '@app/_modules/account_newsletter/views';

const NewsletterController = () => {
  if (!modules.account_newsletter.enable) {
    return null;
  }
  const {t} = useTranslation();
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const [isSubscribed, setIsSubscribed] = useState();

  const {
    data: subscriptionData,
    onRefetchData: onRefetchNewsletterData,
    loading,
  } = useCustomQuery({
    schema: GET_SUBSCRIPTION_STATUS,
    useInitData: true,
    opts: {fetchPolicy: 'no-cache', context: {method: 'POST'}},
  });
  const {onRefetchData: subscribe} = useCustomMutation({
    schema: SUBSCRIBE,
  });
  const {onRefetchData: unsubscribe} = useCustomMutation({
    schema: UNSUBSCRIBE,
  });

  useEffect(() => {
    if (subscriptionData?.data?.customer) {
      setIsSubscribed(subscriptionData?.data?.customer.is_subscribed);
    }
  }, [subscriptionData]);

  const onSubmit = async () => {
    if (!isSubscribed) {
      const res = await subscribe({
        params: {
          email: getRxUserInformation.email,
        },
        paramsOpt: {isReturn: true},
      });
      rxAppSnackbar({message: res.data.subscribe.status.message});
    } else {
      const res = await unsubscribe({
        params: {
          email: getRxUserInformation.email,
        },
        paramsOpt: {isReturn: true},
      });
      rxAppSnackbar({message: res.data.unSubscribe.status.message});
    }

    onRefetchNewsletterData({
      params: null,
    });
  };

  const controllerProps = {
    t,
    loading,
    onSubmit,
    isSubscribed,
  };

  return <View {...controllerProps} />;
};

export default NewsletterController;
