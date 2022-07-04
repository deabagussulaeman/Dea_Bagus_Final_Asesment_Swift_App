import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_CMS_PAGE = gql(
  filterGraphql(`
    query CmsPage($identifier: String) {
        cmsPage(identifier: $identifier) {
            identifier
            title
            content
        }
    }
  `),
);

export const GET_CMS_BLOCK = gql(
  filterGraphql(`
    query CmsBlock($identifier: [String]) {
        cmsBlocks(identifiers: $identifier) {
            items {
                content
            }
        }
    }
  `),
);
