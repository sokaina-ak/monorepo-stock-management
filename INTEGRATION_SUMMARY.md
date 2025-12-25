# Frontend-Backend Integration Documentation

## Architecture Overview

This is a monorepo application consisting of:
- **Frontend**: React + Vite application (`apps/frontend`)
- **Backend**: Laravel API (`apps/backend`)

The frontend and backend communicate via RESTful API endpoints, secured with Laravel Sanctum authentication tokens.

---

## Authentication Flow

### How Authentication Works

The authentication system uses a token-based approach with Laravel Sanctum:

1. **User Login Process**:
   - User enters username and password on the login page
   - Frontend sends POST request to `/api/auth/login`
   - Backend validates credentials and checks if user has `admin` role
   - Backend generates a Sanctum token and returns user data with `accessToken`
   - Frontend stores tokens in `localStorage` (`accessToken` and `refreshToken`)
   - `AuthContext` updates user state, making `isAuthenticated` true
   - User is automatically redirected to `/dashboard`

2. **Session Initialization**:
   - On app load, `AuthContext` checks `localStorage` for existing tokens
   - If token exists, it calls `/api/auth/me` to verify and fetch current user
   - If token is invalid/expired, tokens are cleared and user remains unauthenticated
   - The `loading` state prevents showing protected content during this check

3. **Protected Route Access**:
   - All dashboard routes are wrapped in `<ProtectedRoute />` component
   - `ProtectedRoute` checks `isAuthenticated` from `AuthContext`
   - If not authenticated → redirects to `/login`
   - If authenticated → renders the protected route content
   - Shows loading spinner while checking authentication status

4. **Automatic Logout**:
   - If any API request returns 401 (Unauthorized), the axios response interceptor triggers
   - Tokens are automatically cleared from `localStorage`
   - User is redirected to login page (if not already there)
   - This handles expired tokens seamlessly

### Authentication Components

- **AuthContext** (`apps/frontend/src/context/AuthContext.jsx`):
  - Provides authentication state to entire app via React Context
  - Manages user data, loading state, and authentication status
  - Exposes `login()`, `logout()`, `isAuthenticated`, `user`, and `loading`

- **ProtectedRoute** (`apps/frontend/src/components/common/ProtectedRoute.jsx`):
  - React Router wrapper component that guards routes
  - Checks authentication before allowing access
  - Redirects to login if unauthenticated

---

## API Communication Layer

### Axios Configuration

The API communication is centralized through a configured Axios instance (`apps/frontend/src/services/api.js`):

1. **Base URL Configuration**:
   - Uses `VITE_API_URL` environment variable or defaults to `/api`
   - In development, Vite proxy handles API requests

2. **Request Interceptor**:
   - Automatically attaches `Authorization: Bearer {token}` header to every request
   - Token is read from `localStorage.getItem('accessToken')`
   - Ensures all authenticated requests include the token

3. **Response Interceptor**:
   - Catches all 401 Unauthorized responses
   - Automatically clears tokens and redirects to login
   - Prevents showing error pages for expired sessions

### Service Layer

All API calls are organized into service modules:

- **authService**: Login, get current user, refresh token
- **productService**: CRUD operations for products, search, filter by category
- **categoryService**: Category management with subcategory support
- **orderService**: Order retrieval, update, and deletion

Each service uses the centralized `api` instance, ensuring consistent authentication and error handling.

---

## Core Features & Data Flow

### 1. Products Management

**Backend (`ProductController`)**:
- `GET /api/products`: Fetch products with pagination (`limit`, `skip`)
- `GET /api/products/search`: Search products by title, description, or brand
- `GET /api/products/{id}`: Get single product details
- `GET /api/products/category/{category}`: Get products by category (includes subcategories)
- `POST /api/products/add`: Create new product
- `PUT /api/products/{id}`: Update existing product
- `DELETE /api/products/{id}`: Delete product

**Frontend (`useProducts` hook)**:
- Manages products state, loading, and errors
- Handles complex filtering: search query, category filter, stock status
- Implements client-side pagination when filters are active
- Provides unified interface for all product operations

**How It Works**:
1. Component calls `useProducts()` hook
2. Hook fetches data from `productService` based on current filters
3. Products are stored in local state
4. UI automatically updates when filters change
5. Delete operations update local state immediately for instant feedback

**Smart Filtering Logic**:
- If no filters: Fetch all products with pagination
- If stock filter active: Fetch all products, filter client-side (stock calculations require full dataset)
- If search + category: Fetch category products, then filter by search term
- Pagination is applied after filtering

### 2. Categories with Subcategories

**Backend Architecture**:
- Categories table has `parent_id` column for self-referential relationship
- Main categories have `parent_id = null`
- Subcategories reference their parent via `parent_id`

**Backend Endpoints**:
- `GET /api/categories`: Get all categories with parent information
- `GET /api/categories/main`: Get only main categories (no parent)
- `GET /api/categories/{parentSlug}/subcategories`: Get all subcategories of a parent
- CRUD operations: Create, update, delete categories

**Frontend (`useCategories` hook)**:
- Manages categories and main categories separately
- Automatically loads main categories on mount
- Provides `fetchSubcategories()` for lazy loading subcategories

**How Product-Category Relationship Works**:
- Products belong to one category
- When fetching products by category, backend includes products from subcategories too
- This allows browsing a category and seeing all related products hierarchically

### 3. Orders Management

**Backend (`OrderController`)**:
- `GET /api/orders`: Fetch all orders with optional status filter
- `GET /api/orders/{id}`: Get detailed order information with items
- `PUT /api/orders/{id}`: Update order status
- `DELETE /api/orders/{id}`: Delete order

**Frontend**:
- Displays orders in table and card views
- Shows order details with all items, customer info, and status
- Admin can update order status and track order lifecycle

---

## Route Protection & Navigation

### Route Structure

```
/login (public)
  ↓ (after login)
/dashboard (protected)
  ├── /products (protected)
  ├── /categories (protected)
  └── /orders (protected)
```

**How Routes Work**:
1. Root path `/` is inside `ProtectedRoute`, redirects to `/dashboard` if authenticated
2. `/login` is public - if user is already logged in, redirects to dashboard
3. All other routes are wrapped in `ProtectedRoute` → requires authentication
4. Protected routes use `DashboardLayout` which provides sidebar and header

**Route Protection Flow**:
1. User tries to access `/products`
2. `ProtectedRoute` component checks `isAuthenticated` from `AuthContext`
3. If false → `<Navigate to="/login" replace />`
4. If true → renders `<Outlet />` (the protected route content)

---

## State Management Architecture

### Context API for Global State

**AuthContext**:
- Provides authentication state globally
- Any component can access: `const { user, isAuthenticated, login, logout } = useAuth()`
- Prevents prop drilling through component tree

**ToastContext**:
- Manages toast notifications globally
- Components can show success/error messages: `showToast('Message', 'success')`
- Provides consistent user feedback across the app

### Custom Hooks for Feature State

Each major feature has a custom hook that encapsulates its logic:

- **useProducts**: Manages products list, filtering, pagination, search
- **useCategories**: Manages categories and subcategories
- **useAuth**: Wrapper around AuthContext for easier access

**Benefits**:
- Business logic separated from UI components
- Reusable across multiple components
- Easy to test and maintain
- Components become simpler and focused on presentation

---

## Data Transformation Layer

### Backend to Frontend

The backend uses Laravel's default snake_case naming (e.g., `discount_percentage`, `category_id`), while the frontend expects camelCase (e.g., `discountPercentage`, `category`).

**ProductController handles this**:
- Maps `discount_percentage` → `discountPercentage`
- Removes unnecessary fields (`created_at`, `updated_at`, `category_id`)
- Converts category object → category slug string
- Ensures consistent data structure for frontend

### Frontend Processing

- Frontend receives clean, camelCase data
- No transformation needed in components
- Data flows directly from API → Service → Hook → Component

---

## Error Handling

### Backend Error Responses

Laravel validation errors return:
```json
{
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  }
}
```

### Frontend Error Handling

1. **Service Layer**: Catches API errors, extracts error messages
2. **Hooks**: Store error in state, provide `error` to components
3. **Components**: Display error messages to user via toast or inline
4. **Global Interceptor**: Handles 401 errors automatically

---

## Security Features

1. **Token-Based Authentication**: All protected routes require valid Sanctum token
2. **Middleware Protection**: Backend routes protected with `auth:sanctum` and `admin` middleware
3. **Automatic Token Refresh**: Interceptor handles expired tokens gracefully
4. **Role-Based Access**: Only users with `admin` role can access admin endpoints
5. **CSRF Protection**: Laravel Sanctum handles CSRF for same-origin requests

---

## Main Features Summary

### Products
- ✅ View all products with pagination
- ✅ Search products by title, description, or brand
- ✅ Filter by category (includes subcategories)
- ✅ Filter by stock status (in stock, low stock, out of stock)
- ✅ Create, edit, and delete products
- ✅ View product details

### Categories
- ✅ Hierarchical categories (main categories and subcategories)
- ✅ CRUD operations for categories
- ✅ Browse products by category (includes subcategory products)

### Orders
- ✅ View all orders with status filtering
- ✅ View detailed order information
- ✅ Update order status
- ✅ Delete orders

### Dashboard
- ✅ Overview statistics (total products, orders, etc.)
- ✅ Quick access to all features
- ✅ Top-rated products display

---

## How Everything Works Together

1. **User logs in** → Tokens stored → AuthContext updated
2. **User navigates to Products** → ProtectedRoute checks auth → Allows access
3. **Component uses useProducts hook** → Hook calls productService → Service uses api instance
4. **API request sent** → Request interceptor adds token → Backend validates token
5. **Backend processes request** → Returns data → Response interceptor checks for errors
6. **Data flows back** → Service returns data → Hook updates state → Component re-renders
7. **User interacts** → Component calls hook function → Process repeats

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Reusable code
- ✅ Consistent error handling
- ✅ Secure authentication
- ✅ Maintainable structure
