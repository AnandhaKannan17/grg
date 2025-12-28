# Detailed Module Implementation Plan

This document provides the technical implementation details for porting key application modules to the new local `shops-query` package. It is based on the analysis of existing components.

## 1. Products Module

**Source File:** `src/components/allProducts/index.jsx`
**Current Dependencies:**
- `shops-query/src/modules/products` (`getProductsController`)
- `shops-query/src/modules/productByCategory` (`getProductsByCategoryController`)
- Local Apollo Queries: `GET_FILTER_MASTER_BY_SHOP`, `PRODUCT_BY_SPECIFICATION`

### Implementation Plan

**Target Location:** `src/shops-query/graphql/productQueries.js` & `src/shops-query/hooks/useProducts.js`

1.  **Consolidate Queries:**
    Move `GET_FILTER_MASTER_BY_SHOP` and `PRODUCT_BY_SPECIFICATION` from `src/apollo/queries.js` to `src/shops-query/graphql/productQueries.js`.

    ```graphql
    # src/shops-query/graphql/productQueries.js
    
    query ProductBySpecification($filter: specificationFilter) {
      productBySpecification(filter: $filter) {
         # ... fields from original query
      }
    }

    query GetFilterMasterByShop($filter: speficiationFilter) {
      getFilterMasterByShop(filter: $filter) {
        specificationMaster
        specificationValue
      }
    }
    ```

2.  **Create Hook `useProducts`:**
    This hook will handle the logic currently in `allProducts/index.jsx` regarding fetching strategies (Main Category vs Sub Category vs All Products).

    ```javascript
    // src/shops-query/hooks/useProducts.js
    import { useQuery } from '@apollo/client';
    import { PRODUCT_BY_SPECIFICATION } from '../graphql/productQueries';
    import { useShop } from '../context/ShopContext';

    export const useProducts = ({ mainCategory, subCategory, search, filters }) => {
       const { shopId } = useShop();
       
       // Logic to construct variables based on props
       // ...
       
       return useQuery(PRODUCT_BY_SPECIFICATION, { ... });
    }
    ```

---

## 2. Categories Module

**Source File:** `src/components/home/shopByCategory/index.jsx`
**Current Dependencies:**
- `shops-query/src/modules/masterCategories` (`fetchMasterCategories`)

### Implementation Plan

**Target Location:** `src/shops-query/graphql/categoryQueries.js`

1.  **Define Query:**
    The original logic uses a controller, likely wrapping a REST or GQL call. We should define a proper GQL query if available, or wrap the existing logic in a consistent hook if it remains REST-based (though GQL is preferred).

    ```graphql
    # src/shops-query/graphql/categoryQueries.js
    query GetMasterCategories($shopId: Int!) {
      masterCategories(shopId: $shopId) { # Hypothetical query name, verify with backend
        id
        category
        image
      }
    }
    ```

2.  **Create Hook `useCategories`:**
    ```javascript
    // src/shops-query/hooks/useCategories.js
    import { useShop } from '../context/ShopContext';
    
    export const useCategories = () => {
        const { shopId } = useShop();
        // Execute query/fetch using shopId
        return { categories, loading, error };
    }
    ```

---

## 3. Orders Module (History)

**Source File:** `src/components/myOrders/index.jsx`
**Current Dependencies:**
- `shops-query/src/modules/OrderHistory/Controller/index.js` (`fetchOrderHistory`)

### Implementation Plan

**Target Location:** `src/shops-query/graphql/orderQueries.js`

1.  **Define Query:**
    Move the logic from `fetchOrderHistory` into a GraphQL query.

    ```graphql
    # src/shops-query/graphql/orderQueries.js
    query GetOrderHistory($userId: Int!, $shopId: Int!) {
      orders(userId: $userId, shopId: $shopId) {
        id
        timestamp
        status
        # ... item details
      }
    }
    ```

2.  **Create Hook `useOrderHistory`:**
    ```javascript
    export const useOrderHistory = (userId) => {
        const { shopId } = useShop();
        // Return Query Result
    }
    ```

---

## 4. Order Placement Module

**Source File:** `src/components/paymentComponent/index.jsx`
**Current Dependencies:**
- Local GQL Mutation: `ORDER_BY_CART`

### Implementation Plan

**Target Location:** `src/shops-query/graphql/orderMutations.js`

1.  **Migrate Mutation:**
    Copy the `ORDER_BY_CART` mutation string exactly from `paymentComponent/index.jsx` to `src/shops-query/graphql/orderMutations.js`.

2.  **Create Hook `usePlaceOrder`:**
    Wrapper hook to expose the mutation function.
    
    ```javascript
    // src/shops-query/hooks/usePlaceOrder.js
    import { useMutation } from '@apollo/client';
    import { ORDER_BY_CART } from '../graphql/orderMutations';
    import { useShop } from '../context/ShopContext';

    export const usePlaceOrder = () => {
        const { shopId } = useShop();
        const [mutate, result] = useMutation(ORDER_BY_CART);

        const placeOrder = (variables) => {
            return mutate({
                variables: {
                    ...variables,
                    shopId: Number(shopId) // Auto-inject shopId
                }
            });
        };

        return { placeOrder, ...result };
    }
    ```

---

## 5. Auth Module

**Source File:** `src/utils/Auth.js`
**Current Dependencies:**
- REST Endpoints: 
    - `.../verifymobilenumber.php`
    - `.../loginwithmobile.php`
    - `.../verifyotp.php`
    - `.../signup.php`

### Implementation Plan

**Target Location:** `src/shops-query/modules/auth.js` (Keep as REST utils if GQL unavailable)

1.  **Refactoring:**
    Move the fetch definitions from `src/utils/Auth.js` into the `all-in-one` package structure to keep `src/utils` clean and logic centralized.

    ```javascript
    // src/shops-query/api/auth.js
    
    const BASE_URL = "https://you.strackit.com/ALUMNI/loginandsignup";

    export const loginService = async (mobile) => {
        // ... existing fetch logic
    }

    export const verifyOtpService = async (mobile, otp) => {
        // ... existing fetch logic
    }
    ```

2.  **Hook Exposure (Optional):**
    You can create `useAuth()` to handle loading states for these async calls comfortably.
