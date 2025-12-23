# Packages to Install

## Frontend Packages

Since the frontend directory was missing `package.json`, I've created one with all necessary dependencies.

### Required Packages:

1. **React & React DOM** (^18.2.0)
   - Core React library
   - Already used in your hooks (useState, useEffect, useCallback)

2. **React Router DOM** (^6.20.0)
   - For routing/navigation (if your app uses routing)

3. **Axios** (^1.6.2)
   - HTTP client for API calls
   - Used in all service files (api.js, authService.js, productService.js, categoryService.js)

### Development Dependencies:

1. **Vite** (^5.0.8)
   - Build tool (your code uses `import.meta.env.VITE_API_BASE_URL`)

2. **@vitejs/plugin-react** (^4.2.1)
   - Vite plugin for React

3. **ESLint** plugins
   - For code linting

## Installation Instructions

### Option 1: Install from root (Recommended for monorepo)
```powershell
# From root directory
npm install
```

This will install dependencies for all workspaces including the frontend.

### Option 2: Install frontend dependencies separately
```powershell
# Navigate to frontend
cd apps/frontend

# Install dependencies
npm install
```

## After Installation

1. Create `.env` file in `apps/frontend/` (optional):
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

2. Run the frontend:
   ```powershell
   # From root
   npm run dev-frontend

   # OR from apps/frontend
   npm run dev
   ```

## Summary

The main package you **MUST** install is **axios** since all your service files depend on it. The other packages (React, Vite, etc.) are also required for the app to run.

All packages are now listed in `apps/frontend/package.json`, so just run:
```powershell
npm install
```

