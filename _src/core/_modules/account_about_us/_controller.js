import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_ABOUT_CMS} from '@app/_modules/account_about_us/services/schema';
import {modules} from '@root/swift.config';
import Views from '@app/_modules/account_about_us/views';

const AboutUsController = props => {
  if (!modules.account_about_us.enable) {
    return null;
  }

  const [aboutCMS, setAboutCMS] = useState(null);
  const [title, setTitle] = useState(null);
  const {data, loading} = useCustomQuery({
    schema: GET_ABOUT_CMS,
    useInitData: true,
  });

  /**
   * [METHOD]
   * get data cms from server
   */
  useEffect(() => {
    if (data?.data?.cmsPage) {
      setAboutCMS(data?.data.cmsPage.content);
      setTitle(data?.data.cmsPage.title);
    }
  }, [data]);

  /**
   * [PROPS]
   * set controller props
   */
  const controllerProps = {
    loading,
    aboutCMS,
    title,
  };

  return <Views {...props} {...controllerProps} />;
};

export default AboutUsController;
