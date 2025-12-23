# Frontend-Backend Integration Summary

## Overview
This document summarizes the changes made to connect the React frontend with the Laravel backend and add subcategory support to categories.

## Backend Changes

### 1. Database Migration - Subcategories Support
- **File**: `apps/backend/database/migrations/2025_12_23_194435_add_parent_id_to_categories_table.php`
- Added `parent_id` column to `categories` table for self-referential relationship
- This allows categories to have subcategories without creating a new table

### 2. Category Model Updates
- **File**: `apps/backend/app/Models/Category.php`
- Added `parent_id` to `$fillable` array
- Added `parent()` relationship method
- Added `children()` relationship method

### 3. New Category Controller
- **File**: `apps/backend/app/Http/Controllers/Admin/CategoryController.php`
- Endpoints:
  - `GET /api/categories` - Get all categories with parent info
  - `GET /api/categories/main` - Get only main categories (no parent)
  - `GET /api/categories/{parentSlug}/subcategories` - Get subcategories of a parent

### 4. Product Controller Updates
- **File**: `apps/backend/app/Http/Controllers/Admin/ProductController.php`
- Fixed search query bug (properly grouped OR conditions)
- Updated `getCategories()` to include parent information
- Updated `getByCategory()` to include products from subcategories

### 5. API Routes
- **File**: `apps/backend/routes/api.php`
- Added category routes
- All routes properly protected with `auth:sanctum` and `admin` middleware

### 6. Middleware Fix
- **File**: `apps/backend/bootstrap/app.php`
- Removed duplicate middleware registration

## Frontend Changes

### 1. API Service Layer
Created new service files in `apps/frontend/src/services/`:

- **api.js**: Axios instance with:
  - Base URL configuration (uses `VITE_API_BASE_URL` env var, defaults to `http://localhost:8000/api`)
  - Request interceptor to add auth tokens
  - Response interceptor for token refresh on 401 errors
  - Credentials enabled for Sanctum

- **authService.js**: Authentication service with:
  - `login(username, password)`
  - `me()` - Get current user
  - `refresh(refreshToken)` - Refresh access token
  - `logout()` - Clear tokens
  - `getToken()` - Get stored token
  - `isAuthenticated()` - Check if user is authenticated

- **productService.js**: Product service with all CRUD operations

- **categoryService.js**: Category service with:
  - `getCategories()` - Get all categories
  - `getMainCategories()` - Get main categories only
  - `getSubcategories(parentSlug)` - Get subcategories

### 2. React Hooks
Created hooks in `apps/frontend/src/hooks/`:

- **useAuth.js**: Authentication hook with state management
- **useProducts.js**: Products management hook
- **useCategories.js**: Categories management hook with subcategory support

## Setup Instructions

### Backend
1. Run the migration:
   ```bash
   cd apps/backend
   php artisan migrate
   ```

2. Ensure your `.env` file has:
   ```
   SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
   APP_URL=http://localhost:8000
   ```

### Frontend
1. Create `.env` file in `apps/frontend/` (optional):
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

2. Install dependencies if needed:
   ```bash
   npm install axios
   ```

## Usage Example

### Using Categories with Subcategories

```javascript
import { useCategories } from '../hooks/useCategories';

function MyComponent() {
  const { mainCategories, fetchSubcategories, loading } = useCategories();

  const handleCategorySelect = async (categorySlug) => {
    const { data: subcategories } = await fetchSubcategories(categorySlug);
    // subcategories now contains all subcategories
  };

  return (
    <select onChange={(e) => handleCategorySelect(e.target.value)}>
      {mainCategories.map(cat => (
        <option key={cat.id} value={cat.slug}>{cat.name}</option>
      ))}
    </select>
  );
}
```

### Using Products

```javascript
import { useProducts } from '../hooks/useProducts';

function ProductsList() {
  const { products, fetchProducts, loading, error } = useProducts();

  useEffect(() => {
    fetchProducts({ limit: 20, skip: 0 });
  }, []);

  // ... render products
}
```

## Notes

- All API endpoints require authentication (Bearer token)
- Category subcategories are implemented using a self-referential relationship (parent_id column)
- When fetching products by category, subcategory products are also included
- The frontend API service automatically handles token refresh on 401 errors

