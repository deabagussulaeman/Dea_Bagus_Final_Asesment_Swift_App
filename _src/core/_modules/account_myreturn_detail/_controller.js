import React, {useMemo, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_UPDATE_FORM_RMA} from '@app/_modules/account_myreturn_detail/services/schema';
import {rxUserInformation} from '@app/services/cache';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import RMAFormModal from '@app/_modules/account/atoms/RMAFormModal';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Section from '@app/components/Section';

const MyReturnDetailController = ({route}) => {
  if (!modules.account_myreturn_detail.enable) {
    return null;
  }
  const {t} = useTranslation();
  const getRxUserInformation = useReactiveVar(rxUserInformation);
  const {increment_id, order_number} = route.params;
  const [rmaFormVisibility, setRmaFormVisibility] = useState(true);
  const {data, loading, error} = useCustomQuery({
    schema: GET_UPDATE_FORM_RMA,
    useInitData: true,
    variables: {
      email: getRxUserInformation.email,
      increment_id,
    },
    opts: {fetchPolicy: 'network-only'},
  });

  const rmaFormData = useMemo(() => {
    if (data?.data) {
      return data?.data.getUpdateFormDataAwRma?.detail_rma;
    }
    return null;
  }, [data]);

  const customFieldFormData = useMemo(() => {
    if (data?.data) {
      return data?.data.getUpdateFormDataAwRma?.form_data;
    }
    return null;
  }, [data]);

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return (
      <Section horizontalCenter verticalCenter>
        <Label>{t('account_myreturn_detail.error.message')}</Label>
      </Section>
    );
  }

  return (
    <>
      <Show when={rmaFormData}>
        <RMAFormModal
          type="update-request"
          orderNumber={order_number}
          incrementId={increment_id}
          rmaFormData={rmaFormData}
          customFieldFormData={customFieldFormData}
          visible={rmaFormVisibility}
          setVisible={setRmaFormVisibility}
        />
      </Show>
    </>
  );
};

MyReturnDetailController.propTypes = {
  // route
  route: PropTypes.any,
};

export default MyReturnDetailController;
