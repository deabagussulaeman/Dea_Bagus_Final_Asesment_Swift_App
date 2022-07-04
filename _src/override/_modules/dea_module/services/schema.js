import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_CATEGORIES_PARENTS = gql(
  filterGraphql(`
  {
    categoryList {
      children_count
      category_icon
      children {
        id
        category_icon
        level
        name
        path
        url_path
        url_key
        image_path
        include_in_menu
      }
    }
  }
`),
);