import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_RETURN_CMS = gql(
  filterGraphql(`
  {
    cmsPage(identifier: "return-exchange") {
      content
      title
    }
  }
`),
);
