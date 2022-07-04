import React, {useEffect, useState, useRef} from 'react';
import Views from '@app/_modules/cart_thankyou/views';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {useReactiveVar} from '@apollo/client';
import {rxCartOrderId, rxCartSelectedPaymentMethod} from '@app/services/cache';
import {navigateTo, navReset} from '@app/helpers/Navigation';
import {tabsApp} from '@root/swift.config';

const ThankyouController = () => {
  if (!modules.cart_thankyou.enable) {
    return null;
  }

  const {t} = useTranslation();
  const [loadingReset, setLoadingReset] = useState(false);
  const getRxCartOrderId = useReactiveVar(rxCartOrderId);
  const getRxCartSelectedPaymentMethod = useReactiveVar(
    rxCartSelectedPaymentMethod,
  );
  const mount = useRef();
  const timerReset = useRef(null);

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
      clearTimeout(timerReset.current);
    };
  }, []);

  const onResetToHome = () => {
    setLoadingReset(true);
    timerReset.current = setTimeout(() => {
      setLoadingReset(true);
      navReset(tabsApp.name);
      rxCartOrderId(null);
    }, 500);
  };

  const onResetToConfirmPayment = () => {
    setLoadingReset(true);
    timerReset.current = setTimeout(() => {
      setLoadingReset(true);
      navigateTo(
        modules.account_confirm_payment.enable,
        modules.account_confirm_payment.name,
      );
      setLoadingReset(false);
      rxCartOrderId(null);
    }, 500);
  };

  const controllerProps = {
    t,
    loadingReset,
    orderId: getRxCartOrderId,
    onResetToHome,
    onResetToConfirmPayment,
    getRxCartSelectedPaymentMethod,
  };

  return <Views {...controllerProps} />;
};

ThankyouController.propTypes = {
  // route
  route: PropTypes.any,
};

export default ThankyouController;
