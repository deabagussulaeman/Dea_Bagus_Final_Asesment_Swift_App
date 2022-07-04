import {Storage} from '@app/helpers/Storage';
import {
  rxCartId,
  rxCartItems,
  rxUserAddresses,
  rxAppSnackbar,
  rxUserToken,
  rxUserType,
  rxUserWIshlistItems,
} from '@app/services/cache';
import {modules} from '@root/swift.config';
import {navReset} from '@app/helpers/Navigation';
import i18next from 'i18next';

export const signOut = async () => {
  rxUserType(null);
  rxUserToken(null);
  rxCartItems(null);
  rxCartId(null);
  rxUserWIshlistItems(null);
  rxUserAddresses(null);
  await Storage.clear();
  navReset(modules.auth_landing.name, {withDispatch: true});
};

export const handleError = (error, resetCart) => {
  const {message} = error;
  // if (message.includes(`JSON Parse error: Unrecognized token`)) {
  //   navigate(routes.MAINTENANCE.name);
  // }
  if (
    message.includes('Current user does not have an active cart') ||
    message.includes('The current user cannot perform operations on cart')
  ) {
    resetCart();
  }

  if (
    // message.includes(`The current user cannot perform operations on cart`) ||
    message.includes("The current customer isn't authorized.")
  ) {
    rxAppSnackbar({
      message: i18next.t('errorBoundary.session'),
      duration: 4000,
    });
    signOut();
  }
};
