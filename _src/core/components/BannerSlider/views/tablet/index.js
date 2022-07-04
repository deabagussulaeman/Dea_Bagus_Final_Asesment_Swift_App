import React, {useState} from 'react';
import {Colors, Mixins} from '@app/styles/index';
import PropTypes from 'prop-types';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';

import Shimmer from '@app/components/_Shimmer';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Section from '@app/components/Section';
import styles from '@app/components/BannerSlider/views/tablet/styles';
import BannerSliderImage from '@app/components/BannerSlider/atoms/BannerSliderImage';

const BannerSlider = ({
  style,
  styleFrame,
  data,
  clickable,
  autoplay = false,
  autoplayInterval = 3000,
  pagination = true,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant
   * ----------------------------------------- *
   */
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderWidth = Mixins.MAX_WIDTH * 0.75;
  const itemWidth = Mixins.MAX_WIDTH * 0.75;
  const sliderPaginationDotColor =
    getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY;

  /**
   * ----------------------------------------- *
   * @function _renderItem
   * @param {object} item
   * @summary load single item
   * @return Component
   * ----------------------------------------- *
   */
  const _renderItem = ({item, index}) => {
    const getBackground = {backgroundColor: Colors.TRANSPARENT};
    return (
      <Section style={[getBackground, styles.sliderFrame]}>
        <BannerSliderImage clickable={clickable} index={index} item={item} />
      </Section>
    );
  };

  /**
   * ----------------------------------------- *
   * @constant rendering
   * @dependency [loading, data, activeSlide]
   * @summary load banner slider
   * @return Sections
   * ----------------------------------------- *
   */
  const SectionStyle = {
    height: Mixins.MAX_HEIGHT * 0.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  };
  const carouselStyle = {
    overflow: 'visible',
    paddingBottom: 20,
    backgroundColor: 'transparent',
  };

  if (data.length < 1) {
    return (
      <Section centerHorizontal style={[styleFrame]}>
        <Section style={[styleFrame, SectionStyle]}>
          <Shimmer wrapperStyle={{height: SectionStyle.height - 20}} />
        </Section>
      </Section>
    );
  }
  return (
    <Section style={[styleFrame]}>
      <Section style={style}>
        <Carousel
          loop
          autoplay={autoplay}
          autoplayDelay={autoplayInterval}
          autoplayInterval={autoplayInterval}
          enableMomentum={false}
          lockScrollWhileSnapping
          data={data}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => setActiveSlide(index)}
          containerCustomStyle={carouselStyle}
        />
        {pagination ? (
          <Pagination
            containerStyle={styles.sliderPaginationStyles}
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            dotStyle={[
              styles.sliderPaginationDot,
              {backgroundColor: sliderPaginationDotColor},
            ]}
            inactiveDotStyle={styles.sliderPaginationDotInactive}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            dotContainerStyle={{
              marginHorizontal: data.length < 15 ? 5 : 1,
            }}
          />
        ) : (
          <></>
        )}
      </Section>
    </Section>
  );
};

BannerSlider.propTypes = {
  // styles prop
  style: PropTypes.any,
  // style frame
  styleFrame: PropTypes.any,
  // data
  data: PropTypes.any,
  // clickable
  clickable: PropTypes.bool,
  // auto play
  autoplay: PropTypes.bool,
  // auto play interval
  autoplayInterval: PropTypes.number,
  // pagination
  pagination: PropTypes.bool,
};

export default BannerSlider;
