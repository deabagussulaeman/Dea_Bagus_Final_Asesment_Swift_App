import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

const schemaHooks = () => {
  const GET_USER_INFO = gql(
    filterGraphql(`
    query customer {
      customer {
        phonenumber
        firstname
        lastname
        group_id
        date_of_birth
        created_at
        email
      }
    }
  `),
  );

  const GET_USER_ADDRESS = gql(
    filterGraphql(`
    query customer {
      customer {
        addresses {
          id
          region {
            region
            region_code
            region_id
          }
          country_code
          country_id
          firstname
          lastname
          street
          company
          telephone
          postcode
          city
          vat_id
          default_billing
          default_shipping
          custom_attributes {
            attribute_code
            value
          }
        }
      }
    }
  `),
  );

  const GET_USER_STORE_CREDIT = gql(
    filterGraphql(`
        query customerStoreCredit {
            customer {
                store_credit {
                    current_balance {
                        value
                    }
                }
            }
        }
      `),
  );
  const GET_USER_REWARD_POINT = gql(
    filterGraphql(`
          query customerRewardPoints{
              customerRewardPoints {
                  balance
                  balanceCurrency
                  formatedBalanceCurrency
              }
          }
        `),
  );

  const ADD_WISHLIST = gql(
    filterGraphql(`
    mutation addWishlist(
      $wishlistId: ID!
      $wishlistItems: [WishlistItemInput!]!
    ) {
      addProductsToWishlist(
        wishlistId: $wishlistId
        wishlistItems: $wishlistItems
      ) {
        __typename
        wishlist {
          __typename
          id
          items_count
          items_v2 {
            items {
              id
              added_at
              product {
                id
                name
                sku
                url_key
                price_range {
                  maximum_price {
                    regular_price {
                      currency
                      value
                    }
                    final_price {
                      currency
                      value
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
                thumbnail {
                  url
                  label
                }
              }
            }
          }
        }
      }
    }
  `),
  );

  const REMOVE_WISHLIST = gql(
    filterGraphql(`
    mutation removeWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
      removeProductsFromWishlist(
        wishlistId: $wishlistId
        wishlistItemsIds: $wishlistItemsIds
      ) {
        __typename
        wishlist {
          __typename
          id
          items_count
          items_v2 {
            items {
              id
              added_at
              product {
                id
                name
                sku
                url_key
                price_range {
                  maximum_price {
                    regular_price {
                      currency
                      value
                    }
                    final_price {
                      currency
                      value
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
                thumbnail {
                  url
                  label
                }
              }
            }
          }
        }
      }
    }
  `),
  );

  const GET_USER_WISHLIST_INFORMATION = gql(
    filterGraphql(`
      query customer {
        customer {
          wishlist {
            id
            items_count
          }
        }
      }
  `),
  );

  const GET_USER_WISHLIST_ITEM = gql(
    filterGraphql(`
        query customer {
            customer {
                wishlist {
                    id
                    items_count
                    items_v2 {
                        items {
                            id
                            added_at
                            product {
                                id
                                name
                                sku
                                url_key
                                price_range {
                                    maximum_price {
                                        regular_price {
                                            currency
                                            value
                                        }
                                        final_price {
                                            currency
                                            value
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
                                thumbnail {
                                    url
                                    label
                                }
                            }
                        }
                    }
                }
            }
        }
    `),
  );

  return {
    GET_USER_INFO,
    GET_USER_STORE_CREDIT,
    GET_USER_REWARD_POINT,
    GET_USER_ADDRESS,
    ADD_WISHLIST,
    REMOVE_WISHLIST,
    GET_USER_WISHLIST_INFORMATION,
    GET_USER_WISHLIST_ITEM,
  };
};

export default schemaHooks;
