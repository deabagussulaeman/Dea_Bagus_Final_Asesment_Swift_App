import {Platform} from 'react-native';
/**
 * ---------------------------------------------------- *
 * @constant {user}
 * @summary this constants condition for user
 * ---------------------------------------------------- *
 */
export const IS_IOS = Platform.OS === 'ios';

/**
 * ---------------------------------------------------- *
 * @constant {user}
 * @summary this constants condition for user
 * ---------------------------------------------------- *
 */
export const USER_GUEST = 'guest';
export const USER_CUSTOMER = 'customer';

/**
 * ---------------------------------------------------- *
 * @constant {breakpoint}
 * @summary this constants use for define
 * breakpoint
 * ---------------------------------------------------- *
 */
export const SCREEN_XS = 0;
export const SCREEN_SM = 600;
export const SCREEN_MD = 900;
export const SCREEN_LG = 1200;
export const SCREEN_XL = 1536;

/**
 * ---------------------------------------------------- *
 * @constant {size}
 * @summary this constants use for styling
 * ---------------------------------------------------- *
 */
export const SMALL = {label: 'Small', size: 0.8};
export const MEDIUM = {label: 'Medium', size: 1};
export const LARGE = {label: 'Large', size: 1.35};

/**
 * ---------------------------------------------------- *
 * @constant {key item}
 * @summary this constants use for key on items
 * ---------------------------------------------------- *
 */
export const TOTAL_PRICE_BLOCK = 'total-price-block-';

/**
 * ---------------------------------------------------- *
 * @summary use for Form Field types
 * ---------------------------------------------------- *
 */
export const FORM_FIELD = {
  CHECKBOX: 'Checkbox',
  DATE: 'Date',
  INPUT: 'Input',
  INPUT_DROPDOWN: 'InputDropDown',
  CUSTOM: 'Custom',
};

/**
 * ----------------------------------------- *
 * @constant {crashlytics}
 * @summary this constants use for
 * crashlytics attributes
 * ----------------------------------------- *
 */
export const CART_ID = 'CART ID';
export const USER_TYPE = 'USER TYPE';
export const BEARER = 'BEARER';
export const COUPONS = 'COUPONS';
export const DARK = 'dark';
export const EMAIL = 'EMAIL';
export const LIGHT = 'light';
export const REMOVE = 'REMOVE';
export const SHIPPING_ADDRESS_ID = 'SHIPPING ADDRESS ID';
export const SHIPPING_METHOD_CODE = 'SHIPPING ADDRESS CODE';
export const PAYMENT_METHOD = 'PAYMENT METHOD';
export const STACKTRACE_DETAIL = 'STACKTRACE DETAIL';

/**
 * ---------------------------------------------------- *
 * @const {typeProducts}
 * @summary this constant use for product type name
 * from graphql
 * ---------------------------------------------------- *
 */
export const TYPENAME_SIMPLE = 'SimpleProduct';
export const TYPENAME_CONFIGURABLE = 'ConfigurableProduct';
export const TYPENAME_BUNDLE = 'BundleProduct';
export const TYPENAME_VIRTUAL = 'VirtualProduct';
export const CATEGORY = 'category';
export const PRODUCT = 'product';
export const BRAND = 'brand';

/**
 * ---------------------------------------------------- *
 * @const {productStatus}
 * @summary this constant use for product status
 * in oms or backoffice
 * ---------------------------------------------------- *
 */
export const IN_STOCK = 'IN_STOCK';
export const PRODUCT_TAB_DETAIL = 'details';
export const PRODUCT_TAB_REVIEW = 'review';

/**
 * ---------------------------------------------------- *
 * @const {typeHTMLNode}
 * @summary this constant use for atom decision
 * on WebViewContent component
 * ---------------------------------------------------- *
 */
export const NODE_IMG = 'img';

/**
 * @const {storeURL}
 * @summary this constant use for version checking
 * in useFirestoreForceUpdate and Version helper
 * ---------------------------------------------------- *
 */
export const STOREURL_ANDROID = 'http://play.google.com/store/apps/details';
export const STOREID_ANDROID = 'com.getmystore.app';
export const STOREURL_IOS = 'itms-apps://itunes.apple.com/us/app/apple-store';
export const STOREID_IOS = '1527722475';

/**
 * @const {errorMessage}
 * @summary this constant use checking condition
 * based on error message
 * ---------------------------------------------------- *
 */
export const ERROR_UNAUTHORIZHED = "The current customer isn't authorized.";

/**
 * @const {remoteConfigParameterTypes}
 * @summary this constant use for define
 * remote config parameter types
 * ---------------------------------------------------- *
 */
export const TYPE_BOOLEAN = 'boolean';
export const TYPE_NUMBER = 'number';
export const TYPE_STRING = 'string';

/**
 * @const {remoteConfigParameters}
 * @summary this constant use for define
 * remote config parameters
 * ---------------------------------------------------- *
 */
export const PWA_CHECKOUT_PARAMETER = 'pwa_checkout';

/**
 * @const {categoryList}
 * @summary this constant use for define
 * Category List
 * ---------------------------------------------------- *
 */
export const WHATS_NEW = "What's New";
export const WOMEN = 'Women';
export const MEN = 'Men';
export const GEAR = 'Gear';
export const SALE = 'Sale';
export const TRAINING = 'Training';

/**
 * ---------------------------------------------------- *
 * @const {paymentOthers}
 * @summary this constant use for define payment others
 * ---------------------------------------------------- *
 */
export const TYPE_LIST_ADDRESS_ACCOUNT = 'list-address-account';
export const TYPE_LIST_ADDRESS_CHECKOUT = 'list-address-checkout';

/**
 * @const {widget}
 * @summary this constant use for define
 * page builder identifier
 * ---------------------------------------------------- *
 */
export const PAGE_BUILDER_IDENTIFIER = 'swift-app-homepage-builder';

/**
 * @const {widget}
 * @summary this constant use for define
 * page builder widget
 * ---------------------------------------------------- *
 */
export const SLIDER = 'slider';
export const CATEGORIES = 'categories';
export const PRODUCT_SLIDER = 'product_slider';

/**
 * @const {order by}
 * @summary this constant use for define
 * order by product slider in page builder widget
 * ---------------------------------------------------- *
 */
export const PRODUCT_SORT_BY = {
  price_low_to_high: {price: 'ASC'},
  price_high_to_low: {price: 'DESC'},
  alphabetically: {alphabetically: 'ASC'},
  default: {default: 'ASC'},
  bestseller: {bestseller: 'ASC'},
  new: {new_arrivals: 'ASC'},
  mostviewed: {mostviewed: 'ASC'},
  toprated: {toprated: 'ASC'},
  random: {random: 'ASC'},
  free: {free: 'ASC'},
  featured: {featured: 'ASC'},
  onsale: {onsale: 'ASC'},
  latest: {latest: 'ASC'},
  wishlisttop: {wishlisttop: 'ASC'},
  newestFirst: {new_old: 'ASC'},
  olderFirst: {new_old: 'DESC'},
};

/**
 * @const {navbarType}
 * @summary this constant use for define
 * Navbar type
 * ---------------------------------------------------- *
 */
export const TYPE_NAVBAR_CUSTOM = 'NavBarCustom';
export const TYPE_NAVBAR_HOME = 'NavBarHome';
export const TYPE_APPBAR = 'AppBar';
export const TYPE_SEARCHBAR = 'SearchBar';
export const TYPE_ADDON_SEARCHBAR = 'AddonSearchBar';

/**
 * @const {inputType}
 * @summary this constant use for define
 * Input type
 * ---------------------------------------------------- *
 */
export const TYPE_INPUT_CUSTOM = 'InputCustom';
export const TYPE_INPUT_FIELD = 'InputField';

/**
 * @const {attribute_code}
 * @summary this constant use for define
 * Navbar type
 * ---------------------------------------------------- *
 */
export const COLOR = 'color';
export const SIZE = 'size';

/**
 * @const {input type}
 * @summary this constant use for define
 * Input Type Bundle Option
 * ---------------------------------------------------- *
 */
export const RADIO = 'radio';
export const CHECKBOX = 'checkbox';
export const DROPDOWN = 'select';
export const MULTIPLE_SELECT = 'multi';

/**
 * ---------------------------------------------------- *
 * @const {snapCondition}
 * @summary this constant use for condition of snap
 * ---------------------------------------------------- *
 */
export const CONTAIN_SNAP = 'snap';
export const PREFIX_AIRPAY = '//wsa.wallet.airpay.co.id';
export const PREFIX_GOJEK = 'gojek';
export const PREFIX_SHOPEE = 'https://shopee.co.id/';
export const PREFIX_SHOPEEID = 'shopeeid://';

/**
 * ---------------------------------------------------- *
 * @const {modal}
 * @summary this constant use for define modal type
 * ---------------------------------------------------- *
 */
export const TYPE_MODAL_AUTH_SIGNIN = 'modal-auth-signin';
export const TYPE_MODAL_SHIPPING_ADDRESS_FORM = 'modal-shipping-address-form';
export const TYPE_MODAL_SHIPPING_ADDRESS_LIST = 'modal-shipping-address-list';
export const TYPE_MODAL_PAYMENT_SNAP = 'modal-payment-snap';
export const TYPE_MODAL_ADDRESS_INPUT = 'modal-address-input';
export const TYPE_MODAL_SORT = 'modal-sort';
export const TYPE_ADDRESS_FORM_COUNTRY = 'country';
export const TYPE_ADDRESS_FORM_REGION = 'region';
export const TYPE_ADDRESS_FORM_CITY = 'city';
export const TYPE_ADDRESS_FORM_DISTRICT = 'district';
export const TYPE_ADDRESS_FORM_DISTRICT_SUB = 'subdistrict';
export const TYPE_ADDRESS_FORM_URBAN = 'urbanVillage';
export const TYPE_ADDRESS_FORM_POSTAL = 'postalCode';

/**
 * ---------------------------------------------------- *
 * @const {paymentMethod}
 * @summary this constant use for define payment others
 * ---------------------------------------------------- *
 */
export const IS_FREE = 'free';
export const BANK_TRANSFER = 'banktransfer';

/**
 * ---------------------------------------------------- *
 * @const {errorMessage}
 * @summary this constant use checking condition
 * based on error message
 * ---------------------------------------------------- *
 */

export const ERROR_SESSION_EXPIRED =
  'The current user cannot perform operations';
export const ERROR_USER_HAVENT_CART =
  'Current user does not have an active cart.';
export const ERROR_INACTIVE_CART = "The cart isn't active.";
export const ERROR_QTY_UPDATE = 'The requested qty is not available';
export const ERROR_COULDNT_FIND_ITEM = 'Could not find cart item with id';
export const ERROR_NO_INTERNET_CONNECTION = 'Network request failed';
export const ERROR_NO_ITEM_IN_CART = "The cart doesn't contain the item";
export const ERROR_NOT_FOUND_ID_CART = 'Could not find a cart with ID';
export const ERROR_GUEST_CHECKOUT = 'Guest checkout is not allowed.';
export const ERROR_INTERNAL_SERVER = 'Internal server error';
export const ERROR_PRODUCT_NOT_AVAILABLE =
  'Product that you are trying to add is not available';
export const ERROR_CHECKOUT_SESSION_TOKEN =
  'Required parameter "token" is missing';
export const ERROR_CHECKOUT_SESSION_WRONG_TOKEN = 'Token is wrong';
export const ERROR_COUPON_CODE = "The coupon code isn't valid";
export const ERROR_GIFTCARD_CODE = 'The specified Gift Card code is not valid';
export const ERROR_ALL_REQUIRED_OPTIONS = 'Please select all required options';

/**
 * ---------------------------------------------------- *
 * @const {Bypass Error Source}
 * @summary this constant use for define bypass error source
 * ---------------------------------------------------- *
 */

export const BYPASS_ERROR_ACCOUNT = 'Account Controller';
export const BYPASS_ERROR_APP_INITIAL_CUSTOMER =
  'useNavAppInitialize (Customer) funct';
export const BYPASS_ERROR_APP_INITIAL_CART_ITEM =
  'useNavAppInitialize (Cart Item) funct';
export const BYPASS_ERROR_APP_INITIAL_CART_PRICE =
  'useNavAppInitialize (Cart Price) funct';
export const BYPASS_ERROR_TOGGLE_WISHLIST = 'Toggle Wishlist Component';
export const BYPASS_ERROR_REFETCH_CART = 'useRefetchCart hook';
export const BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_SHIPPING =
  'useSelectShippingAddress (Shipping) hook';
export const BYPASS_ERROR_SELECT_SHIPPING_ADDRESS_BILLING =
  'useSelectShippingAddress (Billing) hook';
export const BYPASS_ERROR_MESSAGE_CART_ID =
  'Variable "$cartID" got invalid value null';
export const BYPASS_ERROR_CHECKOUT_BLOCK_SHIPPING_USER_ADDRESS =
  'Checkout Block Shipping (User Address)';
export const BYPASS_ERROR_CHECKOUT_MODAL_SHIPPING_USER_ADDRESS =
  'Checkout Modal Shipping (User Address)';

/**
 * ---------------------------------------------------- *
 * @const {FilterName}
 * @summary this constant use for define
 * Filter Name
 * ---------------------------------------------------- *
 */
export const PRICE = 'price';
export const CATEGORY_ID = 'category_id';

/**
 * ---------------------------------------------------- *
 * @const {array}
 * @summary this constant use for define
 * sort list
 * ---------------------------------------------------- *
 */
export const sort = {
  items: [
    {label: 'Position', value: {position: 'ASC'}},
    {label: 'Best Match', value: {relevance: 'DESC'}},
    {label: 'Alphabetically (A to Z)', value: {alphabetically: 'ASC'}},
    {label: 'Alphabetically (Z to A)', value: {alphabetically: 'DESC'}},
    {label: 'Price: Low to High', value: {price: 'ASC'}},
    {label: 'Price: High to Low', value: {price: 'DESC'}},
    {label: 'New Arrival', value: {new_arrivals: 'DESC'}},
  ],
};
