import gql from 'graphql-tag';
import {filterGraphql} from '@app/services/helper';

export const GET_NOTIFICATIONS = gql(
  filterGraphql(`
  query {
    customerNotificationList {
      items {
        createdAt
        entityId
        subject
        unread
        content
      }
    }
  }
`),
);

export const READ_NOTIFICATION = gql(
  filterGraphql(`
  mutation readNotification($entityId: Int!) {
    readNotification(entityId: $entityId) {
      items {
        content
        createdAt
        subject
        unread
      }
    }
  }
`),
);
