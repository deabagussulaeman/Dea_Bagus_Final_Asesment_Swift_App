import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_CORE_CONFIG = gql(
  filterGraphql(`
  query getCoreConfig($path: String!, $key: String!) {
    getCoreConfig(path: $path, key: $key) {
      code
      status
      message
      data {
        core_name
        core_value
      }
    }
  }
`),
);

export const GET_STORE_CONFIG = gql(
  filterGraphql(`
  query {
    storeConfig {
      shipments_configuration
      payments_configuration
    }
  }
`),
);
