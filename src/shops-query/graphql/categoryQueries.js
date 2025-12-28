import { gql } from '@apollo/client';

export const GET_MASTER_CATEGORIES = gql`
  query GetMasterCategories($filter: MasterCategoryInput) {
    masterCategories(filter: $filter) {
      id
      category
      image
    }
  }
`;
