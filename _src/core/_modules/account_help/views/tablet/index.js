import WebViewContent from '@app/components/WebViewContent';
import {ActivityIndicator} from 'react-native-paper';
import React from 'react';
import NoData from '@app/components/NoData';
import PropTypes from 'prop-types';

const HelpView = ({loading, title, customerServiceCMS}) => {
  if (loading) {
    return <ActivityIndicator />;
  }
  if (!customerServiceCMS) {
    return <NoData />;
  }
  return <WebViewContent htmlBlock={customerServiceCMS} title={title} />;
};

HelpView.propTypes = {
  // shows loading
  loading: PropTypes.bool,
  // shows title
  title: PropTypes.string,
  //shows htmlblock
  customerServiceCMS: PropTypes.string,
};

export default HelpView;
