import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_CUSTOMER_SERVICE_CMS} from '@app/_modules/account_help/services/schema';
import Views from '@app/_modules/account_help/views';
import {modules} from '@root/swift.config';

const HelpController = props => {
  if (!modules.account_help.enable) {
    return null;
  }

  const [customerServiceCMS, setCustomerServiceCMS] = useState(null);
  const [title, setTitle] = useState(null);
  const {data, loading} = useCustomQuery({
    schema: GET_CUSTOMER_SERVICE_CMS,
    useInitData: true,
  });

  /**
   * [METHOD]
   * get data cms from server
   */
  useEffect(() => {
    if (data?.data?.cmsPage) {
      setCustomerServiceCMS(data?.data.cmsPage.content);
      setTitle(data?.data.cmsPage.title);
    }
  }, [data]);

  /**
   * [PROPS]
   * set controller props
   */
  const controllerProps = {
    loading,
    customerServiceCMS,
    title,
  };

  return <Views {...props} {...controllerProps} />;
};

export default HelpController;
