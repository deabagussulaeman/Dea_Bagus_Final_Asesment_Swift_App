import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_MEGAZON_HOMEPAGE = gql(
  filterGraphql(`
query getCmsPage($identifier: String) {
  cmsPage(identifier: $identifier) {
    content
  }
}
`),
);
