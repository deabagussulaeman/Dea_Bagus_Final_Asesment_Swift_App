import {useReactiveVar} from '@apollo/client';
import React from 'react';
import {rxUserType, rxUserWIshlistItems} from '@app/services/cache';
import {navigateTo} from '@app/helpers/Navigation';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/account_wishlist/views';
import ViewLogin from '@app/_modules/auth_signin/_controller';
import {modules} from '@root/swift.config';
import {USER_GUEST} from '@app/helpers/Constants';

const WishlistController = () => {
  if (!modules.account_wishlist.enable) {
    return null;
  }

  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserWishlistItems = useReactiveVar(rxUserWIshlistItems);
  const {t} = useTranslation();
  const onNavigateToProductDetail = productUrlKey => {
    navigateTo(modules.product_detail.enable, modules.product_detail.name, {
      productUrlKey,
    });
  };

  const onNavigateToAccount = () => {
    navigateTo(modules.account.enable, modules.account.name);
  };

  if (getRxUserType === USER_GUEST) {
    return <ViewLogin />;
  }

  const controllerProps = {
    t,
    userType: getRxUserType,
    wishlist: getRxUserWishlistItems,
    onNavigateToAccount,
    onNavigateToProductDetail,
  };

  return <Views {...controllerProps} />;
};

export default WishlistController;
