import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_CUSTOMER_ORDERS = gql(
  filterGraphql(`
  query customerOrders($pageSize: Int, $currentPage: Int) {
    customerOrders(pageSize: $pageSize, currentPage: $currentPage) {
      total_count
      items {
        order_number
        status_label
        created_at
      }
    }
  }
`),
);
