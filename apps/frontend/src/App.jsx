import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* here is protect routes need to be loggedin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />   {/*just loggedin root to dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />   {/*for dash home*/}

          {/*the nested and dynamic rout*/}
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          
          {/* Category routes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/new" element={<AddCategory />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/categories/:id/edit" element={<EditCategory />} />
        </Route>
      </Route>
      {/*if no page*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
