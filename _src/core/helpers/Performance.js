// import perf from '@react-native-firebase/perf';

export const NAME = {
  CART_PAYMENT: 'Cart Payment',
  HOMEPAGE_SLIDER: 'Homepage Slider',
  PLACE_ORDER: 'Place Order',
  PRODUCT_LIST: 'Product List',
  PRODUCT_DETAIL: 'Product Detail',
};

/**
 * [METRIC] Start metric
 * @param {string} name
 * @param {promise} refFirebase
 * @returns {object} isReturnValue
 */
export const setMetricStart = async ({name = '', refFirebase}) => {
  //   refFirebase.current = await perf().startTrace(name);
};

/**
 * [METRIC] End metric
 * @param {promise} refFirebase
 */
export const setMetricEnd = async ({refFirebase}) => {
  //   await refFirebase.current?.stop();
};
