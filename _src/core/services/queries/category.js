import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_CATEGORIES = gql(
  filterGraphql(`
  {
    categoryList {
      children {
        id
        url_key
        children {
          id
          url_key
          children {
            id
            url_key
          }
        }
      }
    }
  }
`),
);
