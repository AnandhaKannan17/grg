import { gql } from '@apollo/client';

export const PRODUCT_BY_SPECIFICATION = gql`
  query ProductBySpecification($filter: specificationFilter) {
    productBySpecification(filter: $filter) {
      id
      name
      prize
      description
      featureImage
      productImage {
        image
      }
      Varients {
        id: varientId
        size
        color
        prize
        stock
      }
    }
  }
`;

export const PRODUCTS_BY_CATEGORY = gql`
  query ProductsByCategory($filter: CategoryWiseFilter) {
    productsByCategory(filter: $filter) {
      id
      name
      prize
      description
      featureImage
      productImage {
        image
      }
      Varients {
        id: varientId
        size
        color
        prize
        stock
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($filter: productfilter) {
    products(filter: $filter) {
      id
      name
      prize
      description
      featureImage
      productImage {
        image
      }
      Varients {
        id: varientId
        size
        color
        prize
        stock
      }
    }
  }
`;

export const GET_FILTER_MASTER_BY_SHOP = gql`
  query GetFilterMasterByShop($filter: specificationFilter) {
    getFilterMasterByShop(filter: $filter) {
      specificationMaster
      specificationValue
    }
  }
`;
