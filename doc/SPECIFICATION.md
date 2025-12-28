# Shops Query Package Implementation Specification

This document details the plan to implement a local `shops-query` module within the project. The primary goal is to dynamicize the `shopId` retrieval based on the domain name and centralize data fetching logic.

## 1. Directory Structure

We will create a structured module at `src/shops-query/` to replace the external dependency.

```
src/
  shops-query/
    index.js              // Main export file (facade)
    context/
      ShopContext.js      // Context provider for Shop Details (ID, Name, etc.)
    graphql/
      shop.js             // Shop-related queries
      product.js          // Product-related queries
      media.js            // Media/Banner related queries
      order.js            // Order-related queries and mutations
      auth.js             // Auth-related logic or mutations
    hooks/
      useShop.js          // Hook to consume ShopContext
      useProducts.js      // Hook for product data
      useCategories.js    // Hook for categories
      useOrders.js        // Hook for order history
    utils/
      client.js           // Helper for Apollo Client usage (if needed separately)
```

---

## 2. Implementation details

### 2.1. Retrieve Shop ID from Domain (Priority 1)

**Objective:** Remove hardcoded `shopid` (currently in `utils/url.js` as `556`) and fetch it dynamically based on the current window domain.

**GraphQL Query (`src/shops-query/graphql/shop.js`):**

```javascript
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
```

**Context Provider (`src/shops-query/context/ShopContext.js`):**

1.  Create `ShopProvider` component.
2.  On mount, determine the domain:
    ```javascript
    const domain = window.location.origin; // e.g., "https://shecode.co.in"
    // For local testing, you might want a fallback or environment variable override
    ```
3.  Execute `GET_SHOP_DETAILS` with `variables: { filter: { customDomain: domain } }`.
4.  Store the result (`id`, `name`, etc.) in state.
5.  Render a Loader while fetching.
6.  Provide `shopId` and `shopDetails` to children.

**Usage Hook (`src/shops-query/hooks/useShop.js`):**

```javascript
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context; // returns { shopId, shopDetails, loading, error }
};
```

**Integration:**
- Wrap `App.js` or `index.js` with `<ShopProvider>`.
- Replace all imports of `shopid` from `utils/url.js` with `const { shopId } = useShop()`.

### 2.2. Retrieve Product Details

**Objective:** Fetch products using the dynamic `shopId`.

**Current Reference:** `src/components/allProducts/index.jsx` using `getProductsController` (external) and `PRODUCT_BY_SPECIFICATION` (local).

**Implementation:**
- Define queries in `src/shops-query/graphql/product.js` incorporating logic from `PRODUCT_BY_SPECIFICATION`.
- Create `useProducts(filters)` hook that:
  - Gets `shopId` automatically from `useShop()`.
  - Merges `shopId` into the query variables.
  - Returns `{ products, loading, error, refetch }`.

### 2.3. Retrieve Categories & Category-wise Products

**Objective:** Fetch master categories and products filtered by category.

**Current Reference:** `src/components/home/shopByCategory/index.jsx` uses `fetchMasterCategories`.

**Implementation:**
- Define queries in `src/shops-query/graphql/category.js`.
- Create `useCategories()` hook that uses `shopId` from context.

### 2.4. Retrieve Orders by User ID and Shop ID

**Objective:** Fetch order history.

**Current Reference:** `src/components/myOrders/index.jsx` uses `fetchOrderHistory`.

**Implementation:**
- Define queries in `src/shops-query/graphql/order.js`.
- Create `useMyOrders(userId)` hook.
  - Note: `userId` usually comes from Auth/Cookies (`utils/url.js`).
  - Auto-inject `shopId` from `useShop()`.

### 2.5. Place Orders by User ID

**Objective:** Execute order placement mutation.

**Current Reference:** `src/components/paymentComponent/index.jsx` defines `ORDER_BY_CART` mutation locally.

**Implementation:**
- Move `ORDER_BY_CART` mutation to `src/shops-query/graphql/order.js`.
- Create `usePlaceOrder()` hook that returns the mutation function.
- It should validate `shopId` exists in context before executing.

### 2.6. Login and Signup

**Objective:** Handle User Authentication.

**Current Reference:** `src/utils/Auth.js` uses REST fetches (`fetch` to `.php` endpoints).

**Implementation:**
-   Since the reference project uses REST for Auth, we can wrap these `fetch` calls in the `shops-query` module for consistency, or check for GraphQL mutations if available.
-   **Method:**
    -   Create `src/shops-query/modules/auth.js`.
    -   Export functions `login({ mobile })`, `verifyOtp({ mobile, otp })`, `signup(userData)`.
    -   This keeps all "network/data" logic inside `shops-query`, keeping components clean.

## Summary of Action Plan

1.  **Scaffold**: Create the file structure.
2.  **Define GQL**: Copy/paste standard queries into `graphql/*.js`.
3.  **Create Context**: Build `ShopContext` to fetch and hold the `shopId`.
4.  **Replace**: Systematically replace direct usage of `shopid` (int) with `useShop()` hook in all components.
5.  **Hooks**: creating dedicated hooks for Products, Orders, etc.
