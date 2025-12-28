import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($mobile: String!) {
    userProfile(mobile: $mobile) {
      id
      username
      email
      mobile
      address
    }
  }
`;
