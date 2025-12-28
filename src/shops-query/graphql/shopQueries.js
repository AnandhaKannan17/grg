import { gql } from '@apollo/client';

export const GET_SHOP_DETAILS = gql`
  query GetShopDetails($filter: ShopInput) {
    shop(filter: $filter) {
      id
      name
      address
      phone
      featureImage
      __typename
    }
  }
`;
