import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_PRODUCTS_BY_CATEGORIES = gql(
  filterGraphql(`
  query getProductsByCategoryId(
    $categoryId: String
    $currentPage: Int
    $pageSize: Int
    $sortBy: ProductAttributeSortInput
  ) {
    products(
      filter: {category_id: {eq: $categoryId}}
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
        stock_status
        review {
          rating_summary
          reviews_count
        }
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
