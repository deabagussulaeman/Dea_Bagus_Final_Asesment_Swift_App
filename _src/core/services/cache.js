import {InMemoryCache, makeVar} from '@apollo/client';

/**
 * Set initial values when we create cache variables.
 */

export const rxAppLoading = makeVar(false);
export const rxAppSnackbar = makeVar(null);
export const rxAppMaintenance = makeVar(false);
export const rxUserInformation = makeVar(null);
export const rxUserToken = makeVar(null);
export const rxUserType = makeVar(null);
export const rxUserFontSize = makeVar(1);
export const rxUserTheme = makeVar(null);
export const rxUserFontFamily = makeVar(null);
export const rxUserWIshlistItems = makeVar(null);
export const rxUserAddresses = makeVar(null);
export const rxUserStoreCredit = makeVar(null);
export const rxUserRewardPoint = makeVar(null);

export const rxUserDefaultShippingAddressId = makeVar(null);

export const rxCartDataInformation = makeVar(null);
export const rxCartDataItem = makeVar([]);
export const rxCartDataAddress = makeVar(null);
export const rxCartDataPrice = makeVar(null);

export const rxWishlistDataInformation = makeVar(null);

export const rxCartPayment = makeVar([]);
export const rxCartAppliedCoupon = makeVar(null);
export const rxCartGiftCard = makeVar(null);
export const rxCartAppliedStoreCredit = makeVar(null);
export const rxCartAppliedRewardPoint = makeVar(null);
export const rxCartSelectedPaymentMethod = makeVar(null);
export const rxCartAvailablePaymentMethod = makeVar(null);
export const rxCartBillingAddress = makeVar(null);
export const rxCartItems = makeVar(null);
export const rxCartId = makeVar(null);
export const rxCartIsVirtual = makeVar(false);
export const rxCartQty = makeVar(0);
export const rxCartPrices = makeVar(null);
export const rxCartExtraFee = makeVar(null);
export const rxCartPaymentMethod = makeVar(null);
export const rxCartPickupStore = makeVar(null);
export const rxCartShipping = makeVar([]);
export const rxCartShippingAmount = makeVar(null);
export const rxCartShippingAddress = makeVar(null);
export const rxCartShippingMethod = makeVar(null);
export const rxCartInfo = makeVar(null);
export const rxCartOrderId = makeVar(null);
export const rxCartSnapUrl = makeVar(null);
export const rxCartProcessingAPICount = makeVar(0);
export const rxCartDataBackupItem = makeVar([]);

export const rxCartInitLoading = makeVar(true);

export const cache = new InMemoryCache({
  addTypename: true,
  typePolicies: {
    Query: {
      fields: {
        customer: {
          merge: false,
        },
        VesMenuChildren: {
          merge: false,
        },
        cart: {
          merge: true,
        },
      },
    },
  },
});
