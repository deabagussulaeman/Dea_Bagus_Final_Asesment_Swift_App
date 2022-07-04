import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_BRANDS = gql(
  filterGraphql(`
  {
    getBrandList {
      items {
        logo
        name
        attribute_id
      }
    }
  }
`),
);
