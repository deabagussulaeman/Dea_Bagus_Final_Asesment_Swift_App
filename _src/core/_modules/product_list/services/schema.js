import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

const ProductFragment = {
  configurable: gql(
    filterGraphql(`
    fragment ConfigurableProduct on ConfigurableProduct {
      configurable_options {
        id
        attribute_id
        label
        position
        attribute_code
        values {
          value_index
          label
          default_label
          store_label
          use_default_value
        }
        product_id
      }

      variants {
        product {
          name
          id
          sku
          stock_status
          image {
            url
            label
          }
        }
      }
    }
  `),
  ),

  bundle: gql(
    filterGraphql(`
    fragment BundleProduct on BundleProduct {
      items {
        option_id
        title
        required
        type
        position
        sku
        options {
          id
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
    }
  `),
  ),
};

export const GET_PRODUCTS_BY_CATEGORIES = gql(
  filterGraphql(`
  query getProductsByCategoryId(
    $currentPage: Int
    $pageSize: Int
    $sort: ProductAttributeSortInput
    $filters: ProductAttributeFilterInput!
  ) {
    products(
      filter: $filters
      currentPage: $currentPage
      pageSize: $pageSize
      sort: $sort
    ) {
      total_count
      items {
        id
        name
        sku
        url_key
        small_image {
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
      }
      page_info {
        page_size
        current_page
        total_pages
      }
    }
  }
`),
);

export const GET_PRODUCTS_BY_BRAND = gql(
  filterGraphql(`
  query getProductsByBrand(
    $filters: ProductAttributeFilterInput!
    $currentPage: Int
    $pageSize: Int
    $sort: ProductAttributeSortInput
  ) {
    products(
      filter: $filters
      currentPage: $currentPage
      pageSize: $pageSize
      sort: $sort
    ) {
      total_count
      items {
        id
        name
        sku
        url_key
        small_image {
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
      }
      page_info {
        current_page
        total_pages
        page_size
      }
    }
  }
`),
);

export const SEARCH_PRODUCTS = gql(
  filterGraphql(`
  query searchProducts(
    $search: String
    $currentPage: Int
    $pageSize: Int
    $sortBy: ProductAttributeSortInput
  ) {
    products(
      search: $search
      currentPage: $currentPage
      pageSize: $pageSize
      sort: $sortBy
    ) {
      total_count
      items {
        id
        name
        sku
        url_key
        small_image {
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
      }
      page_info {
        current_page
        total_pages
        page_size
      }
    }
  }
`),
);

export const GET_PRODUCT_BY_URL_KEY = gql`
  ${ProductFragment.configurable}
  ${ProductFragment.bundle}
  query getProductByURL(
    $url_key: String
    $currentPage: Int
    $pageSize: Int
    $sortBy: ProductAttributeSortInput
  ) {
    products(
      filter: {url_key: {eq: $url_key}}
      currentPage: $currentPage
      pageSize: $pageSize
      sort: $sortBy
    ) {
      items {
        __typename
        brand
        name
        id
        stock_status
        sku
        url_key
        description {
          html
        }
        price_range {
          maximum_price {
            discount {
              amount_off
              percent_off
            }
            regular_price {
              value
              currency
            }
            final_price {
              currency
              value
            }
          }
        }
        image {
          url
        }
        media_gallery {
          label
          url
        }
        ...ConfigurableProduct
        ...BundleProduct
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql(
  filterGraphql(`
  query getProductReviews($sku: String!, $currentPage: Int, $pageSize: Int) {
    getProductReviews(
      sku: $sku
      currentPage: $currentPage
      pageSize: $pageSize
    ) {
      totalCount
      items {
        entity_pk_value
        nickname
        id
        detail
        created_at
        title
        ratings {
          rating_name
          value
        }
      }
    }
  }
`),
);

export const GET_PRODUCT_FILTER_PRODUCT_LIST = gql(
  filterGraphql(`
    query getProductFiltersByCategory($categoryIdFilter: FilterEqualTypeInput!) {
      products(filter: {category_id: $categoryIdFilter}) {
        aggregations {
          label
          count
          attribute_code
          options {
            label
            value
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `),
);
