# BOO Project Documentation: User Authentication & Shops-Query Integration

This document provides a comprehensive overview of the User Login/Signup functionality and the integration of the `shops-query` package in the BOO project.

---

## 1. User Authentication (Login & Signup)

The authentication system in BOO is built using React components, utility functions, and a cookie-based session management system. It primarily uses Mobile OTP for secure login and account verification.

### 1.1 Authentication Workflow

The authentication process follows these steps:

1.  **Login Strategy**:
    *   The user enters their mobile number in the `LoginModal`.
    *   A request is sent to the backend to generate and send an OTP.
    *   Once the OTP is received, the user enters it to verify their identity.
2.  **Signup Strategy**:
    *   Users can register with their Email, Mobile Number, Username, and Password.
    *   After successful registration, they are redirected to the login step.
3.  **Verification & Session**:
    *   On successful OTP verification, the user's profile is fetched.
    *   User data is stored in a cookie named `ualum` (via `js-cookie`).
    *   The page is reloaded to synchronize the application state.

### 1.2 Key Components

- **`LoginModal` (`src/components/loginModal/index.jsx`)**:
  - Handles the UI state for login, signup, and OTP verification steps.
  - Manages input validation and triggers authentication utilities.
  - Triggers guest cart migration upon successful login.

### 1.3 Utility Functions (`src/utils/Auth.js`)

- **`loginUser(mobile)`**: Initiates the login process by sending a mobile number to the backend. Returns a success status indicating if the OTP was sent.
- **`verifyOtp(mobile, otp)`**: Verifies the 6-digit OTP. On success, it calls `fetchUserProfile` and stores the resulting data in cookies.
- **`registerUser(userData)`**: Sends user registration details (email, mobile, username, password) to the signup endpoint.
- **`fetchUserProfile(mobile)`**: Retrieves full user details from the backend after OTP verification.
- **`getUserData()`**: Reads and parses the `ualum` cookie to provide basic user information (ID, Email, Mobile) to the app.
- **`logoutUser()`**: Clears the `ualum` cookie and reloads the application.

---

## 2. Shops-Query Integration

The `shops-query` package is a core dependency that centralizes all GraphQL-based data interactions. It provides simplified "controllers" for fetching products, managing the cart, handling wishlists, and more.

### 2.1 Overview of Package Structure

`shops-query` is organized into several modules, each targeting a specific domain of the e-commerce platform:

| Module | Purpose | Key Functions |
| :--- | :--- | :--- |
| **products** | Product listing and details | `getProductsController`, `getProductById` |
| **cart** | Cart management for users | `fetchCart`, `addToCart`, `updateCart`, `removeFromCart` |
| **wishlist** | User wishlist functionality | `getWishlist`, `addToWishlistController`, `removeFromWishlistController` |
| **categories** | Category and sub-category data | `fetchCategories` |
| **shop** | Shop-level configurations | `fetchShops`, `updateShop` |
| **orders** | Order history and placement | `fetchOrders`, `placeOrder` |

### 2.2 Usage Examples

#### Fetching Products
```javascript
import { getProductsController } from "shops-query/src/modules/products";

const fetchProducts = async (shopId) => {
  const products = await getProductsController(shopId);
  return products;
};
```

#### Managing User Cart
```javascript
import { addToCart } from "shops-query/src/modules/cart";

const addItemToCart = async (userId, shopId, productId, quantity) => {
  await addToCart({ userId, shopId, productId, quantity });
};
```

### 2.3 Shop ID Management

The `shopid` is a critical parameter for almost all `shops-query` functions. In the current implementation (`src/utils/url.js`), it is statically defined, but the system is designed to allow dynamic retrieval based on the hostname.

- **Current Implementation**: `export const shopid = 556;`
- **Dynamic Potential**: `shops-query` includes a `fetchShops` function that can be used to resolve a `shopId` from a `customDomain`.

---

## 3. Guest Cart Migration

A key feature of the BOO authentication system is the seamless transition of items from a guest's local storage to their persistent user account upon login.

### 3.1 Migration Process (`src/utils/Auth.js`)

When a user logs in, the `migrateGuestCartToUserCart` function is triggered:

1.  Retrieves items from the local guest cart (stored in `localStorage`).
2.  Fetches the user's existing server-side cart using `fetchCart`.
3.  Iterates through guest items and adds them to the user's account using `addToCart` if they aren't already present.
4.  Clears the local guest cart state after successful migration.

This ensures users do not lose their shopping progress when they decide to sign in or create an account.
