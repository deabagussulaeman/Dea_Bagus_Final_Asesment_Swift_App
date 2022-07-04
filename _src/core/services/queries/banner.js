import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_BANNER_SLIDER = gql(
  filterGraphql(`
  {
    getHomepageSlider {
      images {
        image_url
        url_redirection
        image_id
      }
      slider_id
    }
  }
`),
);

export const GET_CATEGORYID_BYURL = gql(
  filterGraphql(`
  query getCategoryID($url: String) {
    categoryList(filters: {url_key: {eq: $url}}) {
      id
    }
  }
`),
);
