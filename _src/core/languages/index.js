import en from '@app/languages/en';
import enAccount from '@app/_modules/account/locales/en';
import enAccountAddAddress from '@app/_modules/account_add_address/locales/en';
import enAccountChangePassword from '@app/_modules/account_change_password/locales/en';
import enAccountChangeEmail from '@app/_modules/account_change_email/locales/en';
import enAccountConfirmPayment from '@app/_modules/account_confirm_payment/locales/en';
import enAccountGiftCard from '@app/_modules/account_gift_card/locales/en';
import enAccountMyAccount from '@app/_modules/account_myaccount/locales/en';
import enAccountMyReturn from '@app/_modules/account_myreturn/locales/en';
import enAccountMyReturnDetail from '@app/_modules/account_myreturn_detail/locales/en';
import enAccountNotification from '@app/_modules/account_notification/locales/en';
import enAccountNewsletter from '@app/_modules/account_newsletter/locales/en';
import enAccountPurchases from '@app/_modules/account_purchases/locales/en';
import enAccountPurchasesDetail from '@app/_modules/account_purchases_detail/locales/en';
import enAccountProductReview from '@app/_modules/account_product_review/locales/en';
import enAccountReturns from '@app/_modules/account_returns/locales/en';
import enAccountRewardPoint from '@app/_modules/account_rewardpoint/locales/en';
import enAccountSettings from '@app/_modules/account_settings/locales/en';
import enAccountStorecredit from '@app/_modules/account_storecredit/locales/en';
import enAccountTrackOrder from '@app/_modules/account_trackorder/locales/en';
import enAccountUpdateInformation from '@app/_modules/account_update_information/locales/en';
import enAccountWishlist from '@app/_modules/account_wishlist/locales/en';
import enAuthLanding from '@app/_modules/auth_landing/locales/en';
import enAuthSignUp from '@app/_modules/auth_signup/locales/en';
import enBlankView from '@app/_modules/_blank/locales/en';
import enBlogDetail from '@app/_modules/blog_detail/locales/en';
import enBlogList from '@app/_modules/blog_list/locales/en';
import enCart from '@app/_modules/cart/locales/en';
import enCartAddToCartBlock from '@app/_modules/cart/atoms/ButtonAddItemToCart/locales/en';
import enCartButtonRemoveItemFromCart from '@app/_modules/cart/atoms/ButtonAddItemToCart/locales/en';
import enCartCheckout from '@app/_modules/cart_checkout/locales/en';
import enCartCustomInputQty from '@app/_modules/cart/atoms/CustomInputQty/locales/en';
import enCartModalUpdateCartItem from '@app/_modules/cart/atoms/ModalUpdateCartItem/locales/en';
import enCartQuantityModal from '@app/_modules/cart/atoms/QuantityModal/locales/en';
import enCartThankyou from '@app/_modules/cart_thankyou/locales/en';
import enMainHome from '@app/_modules/main_home/locales/en';
import enMainCategories from '@app/_modules/main_categories/locales/en';
import enMaintenanceMode from '@app/_modules/maintenance_mode/locales/en';
import enProductDetail from '@app/_modules/product_detail/locales/en';
import enProductList from '@app/_modules/product_list/locales/en';

import id from '@app/languages/id';
import idAccount from '@app/_modules/account/locales/id';
import idAccountAddAddress from '@app/_modules/account_add_address/locales/id';
import idAccountChangePassword from '@app/_modules/account_change_password/locales/id';
import idAccountChangeEmail from '@app/_modules/account_change_email/locales/id';
import idAccountConfirmPayment from '@app/_modules/account_confirm_payment/locales/id';
import idAccountGiftCard from '@app/_modules/account_gift_card/locales/id';
import idAccountMyAccount from '@app/_modules/account_myaccount/locales/id';
import idAccountMyReturn from '@app/_modules/account_myreturn/locales/id';
import idAccountMyReturnDetail from '@app/_modules/account_myreturn_detail/locales/id';
import idAccountNotification from '@app/_modules/account_notification/locales/id';
import idAccountNewsletter from '@app/_modules/account_newsletter/locales/id';
import idAccountPurchases from '@app/_modules/account_purchases/locales/id';
import idAccountPurchasesDetail from '@app/_modules/account_purchases_detail/locales/id';
import idAccountProductReview from '@app/_modules/account_product_review/locales/id';
import idAccountReturns from '@app/_modules/account_returns/locales/id';
import idAccountRewardPoint from '@app/_modules/account_rewardpoint/locales/id';
import idAccountSettings from '@app/_modules/account_settings/locales/id';
import idAccountStorecredit from '@app/_modules/account_storecredit/locales/id';
import idAccountTrackOrder from '@app/_modules/account_trackorder/locales/id';
import idAccountUpdateInformation from '@app/_modules/account_update_information/locales/id';
import idAccountWishlist from '@app/_modules/account_wishlist/locales/id';
import idAuthLanding from '@app/_modules/auth_landing/locales/id';
import idAuthSignUp from '@app/_modules/auth_signup/locales/id';
import idBlankView from '@app/_modules/_blank/locales/id';
import idBlogDetail from '@app/_modules/blog_detail/locales/id';
import idBlogList from '@app/_modules/blog_list/locales/id';
import idCart from '@app/_modules/cart/locales/id';
import idCartAddToCartBlock from '@app/_modules/cart/atoms/ButtonAddItemToCart/locales/id';
import idCartButtonRemoveItemFromCart from '@app/_modules/cart/atoms/ButtonAddItemToCart/locales/id';
import idCartCheckout from '@app/_modules/cart_checkout/locales/id';
import idCartCustomInputQty from '@app/_modules/cart/atoms/CustomInputQty/locales/id';
import idCartModalUpdateCartItem from '@app/_modules/cart/atoms/ModalUpdateCartItem/locales/id';
import idCartQuantityModal from '@app/_modules/cart/atoms/QuantityModal/locales/id';
import idCartThankyou from '@app/_modules/cart_thankyou/locales/id';
import idMainHome from '@app/_modules/main_home/locales/id';
import idMainCategories from '@app/_modules/main_categories/locales/id';
import idMaintenanceMode from '@app/_modules/maintenance_mode/locales/id';
import idProductDetail from '@app/_modules/product_detail/locales/id';
import idProductList from '@app/_modules/product_list/locales/id';

/**
 * ---------------------------------------------------- *
 * @const {resources}
 * @summary all resources init
 * ---------------------------------------------------- *
 */
export default {
  en: {
    translation: {
      ...en,
      _blank: enBlankView,
      account: enAccount,
      account_add_address: enAccountAddAddress,
      account_change_password: enAccountChangePassword,
      account_change_email: enAccountChangeEmail,
      account_confirm_payment: enAccountConfirmPayment,
      account_gift_card: enAccountGiftCard,
      account_myaccount: enAccountMyAccount,
      account_myreturn: enAccountMyReturn,
      account_myreturn_detail: enAccountMyReturnDetail,
      account_notification: enAccountNotification,
      account_newsletter: enAccountNewsletter,
      account_purchases: enAccountPurchases,
      account_purchases_detail: enAccountPurchasesDetail,
      account_product_review: enAccountProductReview,
      account_returns: enAccountReturns,
      account_rewardpoint: enAccountRewardPoint,
      account_settings: enAccountSettings,
      account_storecredit: enAccountStorecredit,
      account_trackorder: enAccountTrackOrder,
      account_update_information: enAccountUpdateInformation,
      account_wishlist: enAccountWishlist,
      auth_landing: enAuthLanding,
      auth_signup: enAuthSignUp,
      blog_detail: enBlogDetail,
      blog_list: enBlogList,
      cart: {
        ...enCart,
        add_to_cart: enCartAddToCartBlock,
        button_remove_item_from_cart: enCartButtonRemoveItemFromCart,
        custom_input_qty: enCartCustomInputQty,
        modal_update_cart_item: enCartModalUpdateCartItem,
        quantity_modal: enCartQuantityModal,
      },
      cart_checkout: enCartCheckout,
      cart_thankyou: enCartThankyou,
      main_home: enMainHome,
      main_categories: enMainCategories,
      maintenance_mode: enMaintenanceMode,
      product_detail: enProductDetail,
      product_list: enProductList,
    },
  },
  id: {
    translation: {
      ...id,
      _blank: idBlankView,
      account: idAccount,
      account_add_address: idAccountAddAddress,
      account_change_password: idAccountChangePassword,
      account_change_email: idAccountChangeEmail,
      account_confirm_payment: idAccountConfirmPayment,
      account_gift_card: idAccountGiftCard,
      account_myaccount: idAccountMyAccount,
      account_myreturn: idAccountMyReturn,
      account_myreturn_detail: idAccountMyReturnDetail,
      account_notification: idAccountNotification,
      account_newsletter: idAccountNewsletter,
      account_purchases: idAccountPurchases,
      account_purchases_detail: idAccountPurchasesDetail,
      account_product_review: idAccountProductReview,
      account_returns: idAccountReturns,
      account_rewardpoint: idAccountRewardPoint,
      account_settings: idAccountSettings,
      account_storecredit: idAccountStorecredit,
      account_trackorder: idAccountTrackOrder,
      account_update_information: idAccountUpdateInformation,
      account_wishlist: idAccountWishlist,
      auth_landing: idAuthLanding,
      auth_signup: idAuthSignUp,
      blog_detail: idBlogDetail,
      blog_list: idBlogList,
      cart: {
        ...idCart,
        add_to_cart: idCartAddToCartBlock,
        button_remove_item_from_cart: idCartButtonRemoveItemFromCart,
        custom_input_qty: idCartCustomInputQty,
        modal_update_cart_item: idCartModalUpdateCartItem,
        quantity_modal: idCartQuantityModal,
      },
      cart_checkout: idCartCheckout,
      cart_thankyou: idCartThankyou,
      main_home: idMainHome,
      main_categories: idMainCategories,
      maintenance_mode: idMaintenanceMode,
      product_detail: idProductDetail,
      product_list: idProductList,
    },
  },
};
