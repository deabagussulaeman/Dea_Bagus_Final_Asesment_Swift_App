/**
 * ----------------------------------------- *
 * @constant {languages}
 * @summary data language support
 * ----------------------------------------- *
 */
export const languages = ['id', 'en', ];

/**
 * ----------------------------------------- *
 * @constant {GLOBAL}
 * @summary config GLOBAL UPDATE APP
 * ----------------------------------------- *
 */
export const GLOBAL = {
  APP_TABLET_VIEW: false,
  APP_FORCE_UPDATE: false,
  APP_CURRENCY: 'IDR',
  APP_CMS_IDENTIFIER: {
    FORCE_UPDATE: 'force-update',
  },
  APP_DEEPLINK: {
    prefix: 'swiftapp://home',
    scheme: {
      Home: {
        path: 'home',
      },
      ProductList: {
        path: 'product-list/:type?/:id?',
        parse: {
          type: type => `${type}`,
          id: id => `${id}`,
        },
      },
      ProductDetail: {
        path: 'product-detail/:productUrlKey?',
        parse: {
          productUrlKey: productUrlKey => `${productUrlKey}`,
        },
      },
    },
  },
  APP_MODAL_SUBSCRIPTION: {
    enable: true,
    delay: 4000,
  },
};

/**
 * ----------------------------------------- *
 * @constant {socialShares}
 * @summary social shares enable in PDP
 * ----------------------------------------- *
 */
export const socialShares = ['email', 'instagram', 'whatsapp'];

/**
 * ----------------------------------------- *
 * @constant {apolloConfig}
 * @summary apollo for config
 * @file @app/services/api.js
 * ----------------------------------------- *
 */
export const apolloConfig = {
  method: 'GET',
  console: false,
  useJest: {
    enable: true,
    api_url: 'https://b2cdemo.getswift.asia/graphql',
  },
};

/**
 * ----------------------------------------- *
 * @constant {tabsApp}
 * @summary name of tabs apps in main page after login
 * @file @app/navigations/_stack-app.js
 * ----------------------------------------- *
 */
export const tabsApp = {
  enable: true,
  name: 'TabStackApp',
};

export const PAGE_BUILDER_TYPE = {
  HTML: 'html',
  MAGEZON: 'magezon',
};

export const pageBuilder = {
  enable: false,
  name: 'PageBuilder',
  type: PAGE_BUILDER_TYPE.MAGEZON,
  navbar: true,
};

export const guestCheckout = {
  enable: true,
  name: 'GuestCheckout',
};

export const checkoutSession = {
  enable: true,
  name: 'CheckoutSession',
};

export const component_types = {
  banner_slider: 'BannerSlider',
  category_slider: 'CategorySlider',
  product_slider: 'ProductSlider',
  brand_slider: 'BrandSlider',
  blog: 'Blog',
};

/**
 * ----------------------------------------- *
 * @constant {modules}
 * @summary this all modules config
 * @file @app/_modules/*
 * ----------------------------------------- *
 */
let modules = {
  dea_module: {
    name: 'DeaModule',
    enable: true,
  },
  account: {
    name: 'Account',
    enable: true,
  },
  account_about_us: {
    name: 'AboutUs',
    enable: false,
  },
  account_change_password: {
    name: 'AccountChangePassword',
    enable: true,
  },
  account_change_email: {
    name: 'AccountChangeEmail',
    enable: true,
  },
  account_confirm_payment: {
    name: 'AccountConfirmPayment',
    enable: true,
  },
  account_contact_us: {
    name: 'AccountContactUs',
    enable: true,
  },
  account_gift_card: {
    name: 'AccountGiftCard',
    enable: true,
  },
  account_help: {
    name: 'AccountHelp',
    enable: true,
  },
  account_languages: {
    name: 'AccountLanguages',
    enable: true,
  },
  account_myaccount: {
    name: 'AccountMyAccount',
    enable: true,
  },
  account_update_information: {
    name: 'AccountUpdateInformation',
    enable: true,
  },
  account_address_add: {
    name: 'AddAddress',
    enable: true,
  },
  account_address_edit: {
    name: 'EditAddress',
    enable: true,
    desc: 'now its component must conversion into modules (address_form)',
  },
  account_myreturn: {
    name: 'AccountMyReturn',
    enable: true,
  },
  account_product_review: {
    name: 'AccountProductReview',
    enable: true,
  },
  account_storecredit: {
    name: 'AccountStoreCredit',
    enable: false,
  },
  account_myreturn_detail: {
    name: 'AccountMyReturnDetail',
    enable: true,
  },
  account_newsletter: {
    name: 'AccountNewsletter',
    enable: true,
  },
  account_notification: {
    name: 'AccountNotification',
    enable: true,
  },
  account_notification_detail: {
    name: 'AccountNotificationDetail',
    enable: true,
  },
  account_purchases: {
    name: 'AccountPurchases',
    enable: true,
  },
  account_purchases_detail: {
    name: 'AccountPurchasesDetail',
    enable: true,
  },
  account_returns: {
    name: 'AccountReturns',
    enable: true,
  },
  account_rewardpoint: {
    name: 'AccountRewardPoint',
    enable: true,
  },
  account_settings: {
    name: 'AccountSettings',
    enable: true,
  },
  account_trackorder: {
    name: 'AccountTrackOrder',
    enable: true,
  },
  account_wishlist: {
    name: 'AccountWishlist',
    enable: true,
  },
  auth_landing: {
    name: 'AuthLanding',
    enable: true,
  },
  auth_signin: {
    name: 'AuthSignin',
    enable: true,
  },
  auth_signup: {
    name: 'AuthSignup',
    enable: true,
    atoms: {
      otp: {
        name: 'AtomOtp',
        component: false,
        enable: true,
      },
    },
  },
  blank: {
    name: 'Blank',
    enable: true,
  },
  blog_detail: {
    name: 'BlogDetail',
    enable: true,
  },
  blog_list: {
    name: 'BlogList',
    enable: true,
  },
  cart: {
    name: 'Cart',
    name_alt: 'CartNonTab', // for clash of navigation
    enable: true,
    atoms: {
      update_item_qty_modal: {
        name: 'QuantityModal',
        enable: false,
      },
      update_item_qty_input: {
        name: 'CustomInputQty',
        enable: true,
      },
    },
  },
  cart_checkout: {
    name: 'CartCheckout',
    enable: true,
  },
  cart_checkout_pwa: {
    name: 'CartCheckoutPwa',
    enable: false,
  },
  cart_thankyou: {
    name: 'CartThankYou',
    enable: true,
  },
  customer_chat: {
    name: 'CustomerChat',
    enable: false,
  },
  main_categories: {
    name: 'MainCategories',
    enable: true,
  },
  main_home: {
    name: 'MainHome',
    enable: true,
    // for product slider must be have categoryId & title props
    components: [
      {name: component_types.banner_slider, props: {}, order: 1},
      {name: component_types.category_slider, props: {}, order: 2},
      {
        name: component_types.product_slider,
        props: {categoryId: 44, title: 'Home'},
        order: 3,
      },
      {name: component_types.brand_slider, props: {}, order: 4},
      {
        name: component_types.product_slider,
        props: {categoryId: 12, title: 'Mens Top'},
        order: 5,
      },
      {
        name: component_types.product_slider,
        props: {categoryId: 3, title: 'Gear'},
        order: 6,
      },
      {name: component_types.blog, props: {}, order: 7},
    ],
  },
  main_search: {
    name: 'MainSearch',
    enable: true,
  },
  maintenance_mode: {
    name: 'MaintenanceMode',
    enable: true,
  },
  product_detail: {
    name: 'ProductDetail',
    enable: true,
    atoms: {
      social_share: {
        name: 'SocialShare',
        component: true,
        enable: false,
      },
    },
  },
  product_list: {
    name: 'ProductList',
    enable: true,
  },
  taxes: {
    name: 'Taxes',
    enable: true,
  },
};

/**
 * ---------------------------------------------------- *
 * @const {accountMenu}
 * @summary menu account
 * ---------------------------------------------------- *
 */
modules.account.atoms = {
  ...modules.account.atoms,
  menus: [
    {
      key: 'addressInformation',
      label: 'Address Information',
      icon: 'user',
      show: modules.account_myaccount.enable,
      enable: modules.account_myaccount.enable,
      moduleName: modules.account_myaccount.name,
    },
    {
      key: 'purchases',
      label: 'Purchases',
      icon: 'archive',
      enable: modules.account_purchases.enable,
      moduleName: modules.account_purchases.name,
    },
    {
      key: 'storeCreditRefund',
      label: 'Store Credit & Refund',
      icon: 'credit-card',
      enable: modules.account_storecredit.enable,
      moduleName: modules.account_storecredit.name,
    },
    {
      key: 'rewardPoints',
      label: 'Reward Points',
      icon: 'award',
      enable: modules.account_rewardpoint.enable,
      moduleName: modules.account_rewardpoint.name,
    },
    {
      key: 'giftCard',
      label: 'Gift Card',
      icon: 'gift',
      enable: modules.account_gift_card.enable,
      moduleName: modules.account_gift_card.name,
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: 'heart',
      enable: modules.account_wishlist.enable,
      moduleName: modules.account_wishlist.name,
    },
    {
      key: 'myReturn',
      label: 'My Return',
      icon: 'corner-up-left',
      enable: modules.account_myreturn.enable,
      moduleName: modules.account_myreturn.name,
    },
    {
      key: 'productReview',
      label: 'Product Review',
      icon: 'corner-up-left',
      enable: modules.account_product_review.enable,
      moduleName: modules.account_product_review.name,
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      enable: modules.account_notification.enable,
      moduleName: modules.account_notification.name,
    },
    {
      key: 'newsletter',
      label: 'Newsletter',
      icon: 'mail',
      enable: modules.account_newsletter.enable,
      moduleName: modules.account_newsletter.name,
    },
    {
      key: 'confirmPayment',
      label: 'Confirm Payment',
      icon: 'shopping-bag',
      enable: modules.account_confirm_payment.enable,
      moduleName: modules.account_confirm_payment.name,
    },
    {
      key: 'languages',
      label: 'Languages',
      icon: 'globe',
      enable: modules.account_languages.enable,
      moduleName: modules.account_languages.name,
    },
    {
      key: 'aboutUs',
      label: 'About Us',
      icon: 'info',
      enable: modules.account_about_us.enable,
      moduleName: modules.account_about_us.name,
    },
    {
      key: 'contactUs',
      label: 'Contact Us',
      icon: 'phone',
      enable: modules.account_contact_us.enable,
      moduleName: modules.account_contact_us.name,
    },
    {
      key: 'returns',
      label: 'Returns',
      icon: 'refresh-ccw',
      enable: modules.account_returns.enable,
      moduleName: modules.account_returns.name,
    },
    {
      key: 'help',
      label: 'Help',
      icon: 'help-circle',
      enable: modules.account_help.enable,
      moduleName: modules.account_help.name,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'settings',
      enable: modules.account_settings.enable,
      moduleName: modules.account_settings.name,
    },
  ],
};

export {modules};
