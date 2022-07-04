import React, {useEffect, useState, useRef} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_BANNER_SLIDER} from '@app/services/queries/banner';
import {NAME, setMetricStart, setMetricEnd} from '@app/helpers/Performance';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/main_home/views';
import PageBuilder from '@app/components/PageBuilder';
import {pageBuilder, modules, component_types} from '@root/swift.config';
import {SUBSCRIBE} from '@app/_modules/main_home/services/schema';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {rxAppSnackbar} from '@app/services/cache';

const MainHomeController = props => {
  if (!modules.main_home.enable) {
    return null;
  }

  if (pageBuilder.enable) {
    return <PageBuilder />;
  }

  /**
   * ---------------------------------------------------- *
   * @var hooks
   * @return {object}
   * ---------------------------------------------------- *
   */
  const refFirebaseSlider = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [bannerSlider, setBannerSlider] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(true);
  const {components} = modules.main_home;
  let hasBannerComponent =
    components.filter(
      component => component.name === component_types.banner_slider,
    ).length > 0;
  const {data: bannerSliderData, onRefetchData} = useCustomQuery({
    schema: GET_BANNER_SLIDER,
    useInitData: hasBannerComponent ? true : false,
  });
  const {onRefetchData: subscribe} = useCustomMutation({schema: SUBSCRIBE});
  const mount = useRef();
  const {t} = useTranslation();

  // ComponentDidMount
  useEffect(() => {
    mount.current = true;
    return () => (mount.current = false);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const getBannerSliderData = async () => {
      if (bannerSliderData === undefined || bannerSliderData.length === 0) {
        await setMetricStart({
          name: NAME.HOMEPAGE_SLIDER,
          refFirebase: refFirebaseSlider,
        });
      } else {
        setBannerSlider(bannerSliderData?.data.getHomepageSlider.images);
        await setMetricEnd({refFirebase: refFirebaseSlider});
      }
    };

    if (mount.current && hasBannerComponent) {
      getBannerSliderData();
    }
  }, [bannerSliderData]);

  const onRefresh = async () => {
    await setRefreshing(true);
    if (hasBannerComponent) {
      await onRefetchData({otherOpt: {fetchPolicy: 'network-only'}});
    }
    await setRefreshing(false);
  };

  /**
   * ---------------------------------------------------- *
   * @function onSubmitSubscription
   * @summary submit subscription
   * ---------------------------------------------------- *
   */
  const onSubmitSubscription = async data => {
    const res = await subscribe({
      params: {
        email: data.email,
      },
      paramsOpt: {isReturn: true},
    });

    if (res.data) {
      const statusResponse = res.data.subscribe.status.response;
      const statusMessage = res.data.subscribe.status.message;
      if (statusResponse === 'Success') {
        rxAppSnackbar({message: statusMessage});
        setModalVisibility(false);
      } else if (statusResponse === 'Failed') {
        rxAppSnackbar({message: statusMessage});
      }
    } else {
      rxAppSnackbar({message: t('main_home.error.subscribe')});
      setModalVisibility(false);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onCloseModal
   * @summary close modal subscription
   * ---------------------------------------------------- *
   */
  const onCloseModal = () => {
    setModalVisibility(false);
  };

  /**
   * ---------------------------------------------------- *
   * @constant controllerProps
   * @return {object}
   * ---------------------------------------------------- *
   */
  const controllerProps = {
    bannerSlider,
    t,
    refreshing,
    modalVisibility,
    onRefresh,
    onSubmitSubscription,
    onCloseModal,
  };

  return <Views {...props} {...controllerProps} />;
};

export default MainHomeController;
