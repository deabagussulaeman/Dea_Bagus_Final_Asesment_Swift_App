import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_CUSTOMER_SERVICE_CMS = gql(
  filterGraphql(`
  {
    cmsPage(identifier: "customer-service") {
      content
      title
    }
  }
`),
);
