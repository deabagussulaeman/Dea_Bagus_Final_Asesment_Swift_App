import i18next from 'i18next';
import _ from 'lodash';
import {getErrorGQL} from '@app/helpers/General';
import {rxAppSnackbar} from '@app/services/cache';
import {onSessionExpired} from '@app/hooks/customer/useDataCustomer';
import {navigateTo} from '@app/helpers/Navigation';
import {checkoutSession, modules} from '@root/swift.config';
import {getEmptyCart, onClearAllDataCart} from '@app/hooks/carts/useCarts';
import {
  ERROR_SESSION_EXPIRED,
  ERROR_USER_HAVENT_CART,
  ERROR_QTY_UPDATE,
  ERROR_COULDNT_FIND_ITEM,
  ERROR_INACTIVE_CART,
  ERROR_NO_INTERNET_CONNECTION,
  ERROR_NO_ITEM_IN_CART,
  ERROR_UNAUTHORIZHED,
  ERROR_GUEST_CHECKOUT,
  ERROR_INTERNAL_SERVER,
  ERROR_PRODUCT_NOT_AVAILABLE,
  BYPASS_ERROR_MESSAGE_CART_ID,
  ERROR_CHECKOUT_SESSION_TOKEN,
  ERROR_CHECKOUT_SESSION_WRONG_TOKEN,
  ERROR_COUPON_CODE,
  ERROR_GIFTCARD_CODE,
  ERROR_NOT_FOUND_ID_CART,
  ERROR_ALL_REQUIRED_OPTIONS,
} from '@app/helpers/Constants';

class ErrorHandler {
  constructor({err = null, configErr = null, source}) {
    const getError = getErrorGQL(err);
    this.err = err;
    this.errMessage = err?.message;
    this.serverError = getError?.isError;
    this.serverMessage = getError?.message;
    this.isBypassMessage = false;
    this.snackbarMessage = i18next.t('message.somethingWrong');
    this.configErr = configErr;
    this.configLogSource = configErr?.logSource
      ? source
        ? `[log] ${source} => ${configErr.logSource} => `
        : 'No Source Found'
      : null;
  }

  isShowLog() {
    if (this.configErr && this.configErr.showLog) {
      console.log(
        '[err] on handler error',
        this.configLogSource,
        this?.err,
        this?.configErr,
      );
    }
  }

  isNoInternetConnection() {
    return (
      this.errMessage &&
      _.includes(this.errMessage, ERROR_NO_INTERNET_CONNECTION)
    );
  }

  isErrorAllRequiredOptions() {
    return (
      this.serverError &&
      _.includes(this.serverMessage, ERROR_ALL_REQUIRED_OPTIONS)
    );
  }

  isProductQtyUpdateError() {
    if (this.serverError) {
      return _.includes(this.serverMessage, ERROR_QTY_UPDATE);
    }
    return this.errMessage && _.includes(this.errMessage, ERROR_QTY_UPDATE);
  }

  isProductNotAvailable() {
    if (this.serverError) {
      return _.includes(this.serverMessage, ERROR_PRODUCT_NOT_AVAILABLE);
    }
    return (
      this.errMessage &&
      _.includes(this.errMessage, ERROR_PRODUCT_NOT_AVAILABLE)
    );
  }

  isErrorCart() {
    return (
      this.serverError &&
      (_.includes(this.serverMessage, ERROR_USER_HAVENT_CART) ||
        _.includes(this.serverMessage, ERROR_INACTIVE_CART) ||
        _.includes(this.serverMessage, ERROR_NO_ITEM_IN_CART) ||
        _.includes(this.serverMessage, ERROR_NOT_FOUND_ID_CART))
    );
  }

  isSessionExpired() {
    return (
      this.serverError &&
      (_.includes(this.serverMessage, ERROR_SESSION_EXPIRED) ||
        _.includes(this.serverMessage, ERROR_UNAUTHORIZHED))
    );
  }

  isProductNotFound() {
    return (
      this.serverError &&
      _.includes(this.serverMessage, ERROR_COULDNT_FIND_ITEM)
    );
  }

  isErrorGuestCheckout() {
    return (
      this.serverError && _.includes(this.serverMessage, ERROR_GUEST_CHECKOUT)
    );
  }

  isInternalServerError() {
    return (
      this.serverError && _.includes(this.serverMessage, ERROR_INTERNAL_SERVER)
    );
  }

  isCheckoutSessionError() {
    return (
      this.serverError &&
      (_.includes(this.serverMessage, ERROR_CHECKOUT_SESSION_TOKEN) ||
        _.includes(this.serverMessage, ERROR_CHECKOUT_SESSION_WRONG_TOKEN))
    );
  }

  isErrorCouponCode() {
    return this.serverError && _.includes(this.serverError, ERROR_COUPON_CODE);
  }

  isErrorGiftCardCode() {
    return (
      this.serverError && _.includes(this.serverError, ERROR_GIFTCARD_CODE)
    );
  }

  isErrorMessageCartId() {
    return (
      this.serverError &&
      _.includes(this.serverError, BYPASS_ERROR_MESSAGE_CART_ID)
    );
  }

  isMessageShowOrBypass() {
    return !this.configErr || (this.configErr && !this.configErr.isBypass);
  }

  showErrorMessage() {
    if (!this.isBypassMessage) {
      if (this.snackbarMessage) {
        rxAppSnackbar({message: this.snackbarMessage});
      }
    }
  }

  isCheckingAllError() {
    if (this.isMessageShowOrBypass()) {
      if (this.isNoInternetConnection()) {
        this.snackbarMessage = i18next.t('message.noInternetConnection');
      } else if (this.isProductQtyUpdateError()) {
        this.snackbarMessage = i18next.t('message.errorQtyUpdated');
      } else if (this.isProductNotAvailable()) {
        this.snackbarMessage = i18next.t('message.productNotAvailable');
      } else if (this.isErrorGuestCheckout()) {
        this.snackbarMessage = i18next.t('message.guestCheckout');
      } else if (this.isInternalServerError()) {
        this.snackbarMessage = i18next.t('message.internalServerError');
      } else if (this.isErrorCouponCode()) {
        this.snackbarMessage = i18next.t('message.invalidCouponCode');
      } else if (this.isErrorGiftCardCode()) {
        this.snackbarMessage = i18next.t('message.invalidGiftCard');
      } else if (this.isErrorAllRequiredOptions()) {
        this.snackbarMessage = i18next.t('message.allRequiredOptions');
      } else if (this.isErrorMessageCartId()) {
        this.isBypassMessage = true;
      } else if (this.isCheckoutSessionError()) {
        this.snackbarMessage = checkoutSession.enable
          ? i18next.t('message.tokenMissingEnable')
          : i18next.t('message.tokenMissing');
      } else if (this.isProductNotFound()) {
        this.snackbarMessage = i18next.t('message.couldntFindItem');
        onClearAllDataCart();
      } else if (this.isErrorCart()) {
        this.snackbarMessage = i18next.t('message.resetCart');
        onClearAllDataCart();
        getEmptyCart();
      } else if (this.isSessionExpired()) {
        this.snackbarMessage = i18next.t('message.sessionExpired');
        navigateTo(modules.account.enable, modules.account.name);
        onSessionExpired();
      }
      return this.showErrorMessage();
    }
  }

  initHandleError() {
    this.isShowLog();
    this.isCheckingAllError();
  }
}
export default ErrorHandler;
