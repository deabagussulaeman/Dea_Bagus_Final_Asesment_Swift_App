import {gql} from '@apollo/client';
import {filterGraphql} from '@app/services/helper';

export const GET_PRODUCT_REVIEW = gql(
  filterGraphql(`
  query getReview(
    $pageSize:Int
    $currentPage:Int
  ) {
    customer{
      reviews(
        pageSize:$pageSize
        currentPage:$currentPage
      ) {
        items{
          average_rating
          created_at
          nickname
          product{
            id
            url_key
            image{
              url
              __typename
            }
            name
            __typename
          }
          ratings_breakdown{
            name
            value
            __typename
          }
          summary
          text
          __typename
        }
        page_info{
          current_page
          page_size
          total_pages
          __typename
        }
        __typename
      }
      __typename
    }
  }
`),
);
