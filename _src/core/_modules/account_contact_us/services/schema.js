import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_CONTACT_CMS = gql(
  filterGraphql(`
  {
    cmsBlocks(identifiers: "contact-us-info") {
      items {
        content
        title
      }
    }
  }
`),
);
