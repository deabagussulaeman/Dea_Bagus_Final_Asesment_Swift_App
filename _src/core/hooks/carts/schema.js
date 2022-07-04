import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

const CONFIGURABLE_PRODUCT = {
  fragment: `
    fragment ConfigurableProductCart on ConfigurableProduct {
      variants {
        product {
          name
          id
          sku
          image {
            url
            label
          }
        }
      }
    }
  `,
};

const BUNDLE_PRODUCT = {
  fragment: `fragment BundleProduct on BundleProduct {
    items {
      option_id
      title
      required
      type
      position
      sku
      options {
        id
        is_default
        label
        quantity
        position
        price
        price_type
        product {
          id
          name
          sku
          description {
            html
          }
          image {
            url
            label
          }
          thumbnail {
            url
            label
          }
          price_range {
            maximum_price {
              regular_price {
                value
                currency
              }
              final_price {
                value
                currency
              }
              discount {
                amount_off
                percent_off
              }
            }
          }
          stock_status
          url_key
        }
      }
    }
  }`,
};

const PRODUCT = {
  fragment: `
      product {
        ...ConfigurableProductCart
        ...BundleProduct
        id
        name
        sku
        special_price
        special_from_date
        special_to_date
        attribute_set_id
        stock_status
        url_key
        new_from_date
        new_to_date
        options_container
        created_at
        updated_at
        country_of_manufacture
        small_image {
          url
          label
        }
        thumbnail {
          url
          label
        }
        price_range {
          maximum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
            discount {
              amount_off
              percent_off
            }
          }
        }
        price_tiers {
          quantity
          final_price {
            value
            currency
          }
          discount {
            amount_off
            percent_off
          }
        }
      }
  `,
};

const CART_ITEMS = {
  fragment: `
    items {
      id
      quantity
      ... on ConfigurableCartItem {
        configurable_options {
          option_label
          value_label
        }
      }
      ... on BundleCartItem{
        bundle_options{
          id
          values{
            id
            label
            quantity
            price
          }
        }
      }
      ${PRODUCT.fragment}
    }
  `,
};

const CART_SHIPPING_ADDRESS = {
  fragment: `
    shipping_addresses {
      firstname
      lastname
      street
      city
      telephone
      postcode
      region {
        code
        label
        region_id
      }
      country {
        code
        label
      }
      available_shipping_methods {
        amount {
          currency
          value
        }
        available
        carrier_code
        carrier_title
        error_message
        method_code
        method_title
        shipping_promo_name
        price_excl_tax {
          value
          currency
        }
        price_incl_tax {
          value
          currency
        }
      }
      selected_shipping_method {
        amount {
          value
          currency
        }
        carrier_code
        carrier_title
        method_code
        method_title
      }
    }
  `,
};

const CART_BILLING_ADDRESS = {
  fragment: `
    billing_address {
      city
      company
      country {
        code
        label
      }
      firstname
      lastname
      postcode
      region {
        code
        label
      }
      street
      telephone
    }
  `,
};

const CART_PRICE = {
  fragment: `
    prices {
      discounts {
        amount {
          value
          currency
        }
        label
      }
      subtotal_excluding_tax {
        value
        currency
      }
      subtotal_including_tax {
        value
        currency
      }
      subtotal_with_discount_excluding_tax {
        value
        currency
      }
      applied_taxes {
        label
        amount {
          currency
          value
        }
      }
      grand_total {
        value
        currency
      }
    }
  `,
};

const cartSchema = () => {
  const getItems = gql(
    filterGraphql(`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    query getCartItem($cartID: String!) {
      cart(cart_id: $cartID) {
        id
        email
        total_quantity
        is_virtual
        available_free_items {
          sku
        }
        ${CART_ITEMS.fragment}
      }
    }
  `),
  );

  const getCartInformation = gql(
    filterGraphql(`
      query getCartInformation($cartID: String!) {
        cart(cart_id: $cartID) {
          id
          email
          total_quantity
        }
      }
  `),
  );

  const getAvailablePaymentMethod = gql(
    filterGraphql(`
        query getAvailablePaymentMethod($cartID: String!) {
            cart(cart_id: $cartID) {
                available_payment_methods {
                    code
                    title
                }
            }
        }
  `),
  );

  const getAppliedCoupon = gql(
    filterGraphql(`
      query getAppliedCoupon($cartID: String!) {
        cart(cart_id: $cartID) {
            applied_coupons {
                code
            }
        }
      }
  `),
  );

  const getAppliedRewardPoint = gql(
    filterGraphql(`
        query getAppliedRewardPoint($cartID: String!) {
            cart(cart_id: $cartID) {
                applied_reward_points {
                    is_use_reward_points
                    reward_points
                    reward_points_amount
                }
            }
        }
    `),
  );

  const getAppliedStoreCredit = gql(
    filterGraphql(`
        query getAppliedStoreCredit($cartID: String!) {
            cart(cart_id: $cartID) {
                applied_store_credit {
                    is_use_store_credit
                    store_credit_amount
                }
            }
        }
    `),
  );

  const getAppliedGiftCard = gql(
    filterGraphql(`
      query getAppliedCoupon($cartID: String!) {
        cart(cart_id: $cartID) {
            applied_giftcard {
                giftcard_amount
                giftcard_detail {
                    giftcard_code
                    giftcard_amount_used
                }
            }
        }
      }
  `),
  );

  const getSelectedPaymentMethod = gql(
    filterGraphql(`
        query getCartAddress($cartID: String!) {
            cart(cart_id: $cartID) {
                selected_payment_method {
                    code
                    title
                }
            }
        }
  `),
  );

  const getAddress = gql(
    filterGraphql(`
      query getCartAddress($cartID: String!) {
        cart(cart_id: $cartID) {
          id
          email
          total_quantity
          is_virtual
          ${CART_SHIPPING_ADDRESS.fragment}
          ${CART_BILLING_ADDRESS.fragment}
        }
      }
  `),
  );

  const getPrice = gql(
    filterGraphql(`
      query getCartPrice($cartID: String!) {
        cart(cart_id: $cartID) {
          id
          email
          total_quantity
          is_virtual
          ${CART_PRICE.fragment}
        }
      }
  `),
  );

  // const addSimpleItemToCart = gql`
  //   mutation addSimpleProductsToCart($input: AddSimpleProductsToCartInput) {
  //     addSimpleProductsToCart(input: $input) {
  //       cart {
  //         id
  //         email
  //         total_quantity
  //       }
  //     }
  //   }
  // `;

  const addSimpleItemToCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation addSimpleProductsToCart($input: AddSimpleProductsToCartInput) {
      addSimpleProductsToCart(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const addBundleItemToCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation addBundleProductsToCart($input: AddBundleProductsToCartInput) {
      addBundleProductsToCart(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const addConfigurableItemToCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation addItemConfigurableCart($input: AddConfigurableProductsToCartInput) {
      addConfigurableProductsToCart(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const addVirtualItemToCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation addVirtualProductsToCart($input: AddVirtualProductsToCartInput) {
      addVirtualProductsToCart(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const updateItemOnCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation updateCartItems($input: UpdateCartItemsInput) {
      updateCartItems(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const removeItemOnCart = gql`
    ${CONFIGURABLE_PRODUCT.fragment}
    ${BUNDLE_PRODUCT.fragment}
    mutation removeItemFromCart($input: RemoveItemFromCartInput) {
      removeItemFromCart(input: $input) {
        cart {
          id
          email
          total_quantity
          is_virtual
          ${CART_ITEMS.fragment}
          ${CART_PRICE.fragment}
        }
      }
    }
  `;

  const getCheckoutSessionToken = gql`
    mutation setCheckoutSession($cartId: String!) {
      setCheckoutSession(input: {cart_id: $cartId}) {
        checkout_token
      }
    }
  `;

  return {
    getItems,
    getAddress,
    getPrice,
    getCartInformation,
    getAppliedGiftCard,
    getAppliedRewardPoint,
    getAppliedStoreCredit,
    getSelectedPaymentMethod,
    getAvailablePaymentMethod,
    getAppliedCoupon,
    addSimpleItemToCart,
    addVirtualItemToCart,
    addBundleItemToCart,
    addConfigurableItemToCart,
    updateItemOnCart,
    removeItemOnCart,
    getCheckoutSessionToken,
  };
};

export default cartSchema;
