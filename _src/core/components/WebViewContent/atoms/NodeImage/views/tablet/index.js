import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

const NodeImage = ({uri}) => {
  return (
    <FastImage
      style={{width: 300, height: 200}}
      source={{
        uri: uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

NodeImage.propTypes = {
  // uri
  uri: PropTypes.string,
};

export default NodeImage;
