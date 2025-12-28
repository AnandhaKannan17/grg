# Shops Query Implementation Reference

## Overview
This document outlines the plan to replace the external `shops-query` package with a local implementation within the `src/shops-query` directory. The primary goal is to dynamicize the `shopId` retrieval based on the current domain name, removing the hardcoded value.

## Implementation Steps

### 1. Structure
We will create a `src/shops-query` directory to house all data fetching logic.
Suggested structure:
```
src/
  shops-query/
    index.js          // Main entry point
    graphql/          // GraphQL query definitions
      shopQueries.js
      productQueries.js
      categoryQueries.js
      orderQueries.js
      authQueries.js
    modules/          // Logic/Controllers (optional, or keeping simple hooks)
      shop/
      product/
      ...
```

### 2. Retrieve Shop Details (Priority 1)
**Goal:** Fetch `shopId` based on `window.location.origin` (or a specific domain for testing) using the `GetShopDetails` query.

**Query:**
```graphql
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
```

**Variables:**
```json
{
  "filter": {
    "customDomain": "https://shecode.co.in" 
  }
}
```
*Note: In production, `customDomain` will be dynamically set to the current window origin.*

**Implementation Strategy:**
- Create a `ShopContext` to handle the fetching of shop details on application load.
- Store `shopId` and other shop details in the context.
- Expose a hook `useShop()` to access these details throughout the app.
- Replace usages of the hardcoded `shopid` from `utils/url.js` with `useShop()`.

### 3. Retrieve Product Details
*Dependent on Shop ID.*
- Implement queries to fetch products filtering by the retrieved `shopId`.

### 4. Categories & Category-wise Products
- Fetch categories linked to the `shopId`.
- Fetch products grouped by these categories.

### 5. Orders (User & Shop ID)
- Fetch orders for the logged-in user within the context of the current shop.

### 6. Place Orders
- Mutation to place an order, linking it to the `userId` and `shopId`.

### 7. Login & Signup
- Implement Authentication mutations.

## Reference Implementation
We will use `@apollo/client` which is already installed in the project. The existing `ApolloClient.js` setup will be used.

---
**Next Steps:**
1. Create `src/shops-query` directory.
2. Define `GetShopDetails` query.
3. specific functionality for Step 2 (Shop ID retrieval).
