import WebViewContent from '@app/components/WebViewContent';
import {ActivityIndicator} from 'react-native-paper';
import PropTypes from 'prop-types';
import React from 'react';
import NoData from '@app/components/NoData';

const AboutUsView = ({loading, title, aboutCMS}) => {
  if (loading) {
    return <ActivityIndicator />;
  }
  if (!aboutCMS) {
    return <NoData />;
  }
  return <WebViewContent htmlBlock={aboutCMS} title={title} />;
};

AboutUsView.propTypes = {
  // shows loading
  loading: PropTypes.bool,
  // shows title
  title: PropTypes.string,
  // shows htmlBlock
  aboutCMS: PropTypes.string,
};

export default AboutUsView;
