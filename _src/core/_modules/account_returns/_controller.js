import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {GET_RETURN_CMS} from '@app/_modules/account_returns/services/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import WebViewContent from '@app/components/WebViewContent';
import {modules} from '@root/swift.config';

const ReturnsController = () => {
  if (!modules.account_returns.enable) {
    return null;
  }

  const [returnsCMS, setReturnsCMS] = useState(null);
  const [title, setTitle] = useState(null);
  const {data, loading} = useCustomQuery({
    schema: GET_RETURN_CMS,
    useInitData: true,
  });

  useEffect(() => {
    if (data && data?.data) {
      setReturnsCMS(data?.data.cmsPage.content);
      setTitle(data?.data.cmsPage.title);
    }
  }, [data]);

  if (loading) {
    return <ActivityIndicator />;
  }
  return <WebViewContent htmlBlock={returnsCMS} title={title} />;
};

export default ReturnsController;
