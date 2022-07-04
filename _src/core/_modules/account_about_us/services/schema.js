import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_ABOUT_CMS = gql(
  filterGraphql(`
  {
    cmsPage(identifier: "about-us") {
      content
      title
    }
  }
`),
);
