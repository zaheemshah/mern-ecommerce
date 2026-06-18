import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />

              <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
