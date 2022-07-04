import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_CUSTOMER_REQUESTS = gql(
  filterGraphql(`
  query getHistoryRma($pageSize: Int, $currentPage: Int) {
    getCustomerRequestAwRma(page_size: $pageSize, current_page: $currentPage) {
      current_page
      page_size
      total_count
      total_pages
      items {
        id
        increment_id
        order_date
        order_number
        order_id
        items {
          name
        }
        status {
          id
          name
        }
      }
    }
  }
`),
);
