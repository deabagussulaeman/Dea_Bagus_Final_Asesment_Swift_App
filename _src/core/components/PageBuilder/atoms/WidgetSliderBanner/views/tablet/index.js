import React from 'react';
import BannerSlider from '@app/components/BannerSlider';
import styles from '@app/components/PageBuilder/atoms/WidgetSliderBanner/views/tablet/styles';
import PropTypes from 'prop-types';

const WidgetSliderBanner = ({
  data,
  autoplay = false,
  autoplayInterval = 3000,
  clickable = true,
  pagination = true,
}) => {
  return (
    <BannerSlider
      key={'node-1'}
      autoplay={autoplay}
      data={data}
      clickable={clickable}
      styleFrame={styles.bannerFrame}
      autoplayInterval={autoplayInterval}
      pagination={pagination}
    />
  );
};

WidgetSliderBanner.propTypes = {
  // data
  data: PropTypes.any,
  // auto play
  autoplay: PropTypes.bool,
  // auto play interval
  autoplayInterval: PropTypes.number,
  // clickable
  clickable: PropTypes.bool,
  // pagination
  pagination: PropTypes.bool,
};

export default WidgetSliderBanner;
