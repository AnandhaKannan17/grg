import { gql } from '@apollo/client';

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory($filter: orderFilter) {
    orderHistory(filter: $filter) {
      id
      timestamp
      orderdetails {
        status
        totalPrice
        Products {
          name
        }
      }
    }
  }
`;
