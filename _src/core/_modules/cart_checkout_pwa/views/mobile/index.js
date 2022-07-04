import React from 'react';
import {modules} from '@root/swift.config';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';

/**
 * ---------------------------------------------------- *
 * @components CartChecoutPWaView
 * @summary View for Cart Checkout Pwa
 * ---------------------------------------------------- *
 */
const CheckoutPwaView = ({pwaUrl, webviewRef}) => {
  if (!modules.cart_checkout_pwa.enable) {
    return null;
  }

  return <WebView ref={webviewRef} source={{uri: pwaUrl}} style={{flex: 1}} />;
};

CheckoutPwaView.propTypes = {
  // use for uri source
  pwaUrl: PropTypes.string,
  // use for ref in WebView
  webviewRef: PropTypes.string,
};

export default CheckoutPwaView;
