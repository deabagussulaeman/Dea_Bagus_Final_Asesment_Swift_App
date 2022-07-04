import React, {useMemo, useState} from 'react';
import Label from '@app/components/Label';
import {ActivityIndicator} from 'react-native-paper';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {useReactiveVar} from '@apollo/client';
import {rxUserInformation} from '@app/services/cache';
import {
  GET_CUSTOMER_ORDER,
  GET_FORM_DATA_RMA,
} from '@app/_modules/account_purchases_detail/services/schema';
import Views from '@app/_modules/account_purchases_detail/views';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

const PurchasesDetailController = ({route}) => {
  if (!modules.account_purchases_detail.enable) {
    return null;
  }
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const email = getRxUserInformation.email;
  const {order_number} = route.params;
  const [rmaFormVisibility, setRmaFormVisibility] = useState(false);

  const {
    data: formDataRMAData,
    loading: formDataRMALoading,
    onRefetchData: loadFormDataRMA,
  } = useCustomQuery({
    schema: GET_FORM_DATA_RMA,
    useInitData: false,
    variables: {
      email: email,
      order_number: order_number,
    },
  });
  const {t} = useTranslation();

  const onRequestReturn = async () => {
    await loadFormDataRMA({
      params: {
        email: email,
        order_number: order_number,
      },
    });
  };

  const rmaFormData = useMemo(() => {
    if (formDataRMAData?.data) {
      setRmaFormVisibility(true);
      return formDataRMAData.data.getNewFormDataAwRma;
    }
    return null;
  }, [formDataRMAData]);

  const {data, loading, error} = useCustomQuery({
    schema: GET_CUSTOMER_ORDER,
    useInitData: true,
    variables: {
      email: email,
      order_number: order_number,
    },
  });
  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Label>{JSON.stringify(error)}</Label>;
  }

  const controllerProps = {
    t,
    rmaFormData,
    rmaFormVisibility,
    formDataLoading: formDataRMALoading,
    item: data,
    onRequestReturn,
    setRmaFormVisibility,
  };

  return <Views {...controllerProps} />;
};

PurchasesDetailController.propTypes = {
  // route
  route: PropTypes.any,
};

export default PurchasesDetailController;
