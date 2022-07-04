import React from 'react';
import FastImage from 'react-native-fast-image';
import Section from '@root/_src/core/components/Section/index';
import styles from '@root/_src/core/components/BannerSlider/atoms/_BannerItem/views/tablet/styles';
import PropTypes from 'prop-types';

const BannerItem = ({
  keyIndex,
  clickable,
  imageSource,
  onPress,
  onError,
  onLoadEnd,
  isPressableItem,
  onPressItemData,
}) => {
  const imageProps = {
    onLoadEnd,
    onError,
    key: keyIndex.toString(),
    style: styles.sliderImage,
    resizeMode: FastImage.resizeMode.cover,
    source: {
      uri: imageSource,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    },
  };

  if (!clickable) {
    return <FastImage {...imageProps} />;
  }

  return (
    <Section onPress={onPress} style={styles.frameContainer}>
      <FastImage {...imageProps} />
    </Section>
  );
};

BannerItem.propTypes = {
  // key index
  keyIndex: PropTypes.any,
  // clickable
  clickable: PropTypes.bool,
  // image uri
  imageSource: PropTypes.string,
  // function click image
  onPress: PropTypes.func,
  // func error
  onError: PropTypes.func,
  // func load
  onLoadEnd: PropTypes.func,
  // bool pressable
  isPressableItem: PropTypes.bool,
  // func press item
  onPressItemData: PropTypes.func,
};

export default React.memo(BannerItem);
