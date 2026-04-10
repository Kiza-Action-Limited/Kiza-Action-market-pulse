// src/App.jsx - Updated with all pages
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/errorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Wishlist from './pages/Wishlists';
import Reviews from './pages/Reviews';
import About from './pages/About';
import NotFound from './pages/notFound';
import SubscriptionPlans from './pages/SubscriptionPlans';
import FAQ from './pages/FAQ';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Business from './pages/Business';
import BusinessDirectory from './pages/BusinessDirectory';
import BusinessProfile from './pages/BusinessProfile';

// Seller Pages
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SellerOrders from './pages/SellerOrders';
import SellerPremiumVerification from './pages/SellerPremiumVerification';
import SellerPremiumPayment from './pages/SellerPremiumPayment';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminContactQueue from './pages/AdminContactQueue';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import SellerRoute from './components/SellerRoute';
import AdminRoute from './components/AdminRoute';
import SubscriptionGate from './components/SubscriptionGate';
import { SUBSCRIPTION_FEATURES } from './config/subscriptionPlans';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<MainLayout />}>

                  {/* Public Routes */}
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="products" element={<Products />} />
                  <Route path="business" element={<Business />} />
                  <Route path="manufacturers" element={<Navigate to="/business" replace />} />
                  <Route path="businesses" element={<BusinessDirectory />} />
                  <Route path="businesses/:businessId" element={<BusinessProfile />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="shipping" element={<ShippingInfo />} />
                  <Route path="returns" element={<Returns />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="products/:id/reviews" element={<Reviews />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>

                    <Route path="checkout" element={<Checkout />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id/track" element={<OrderTracking />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="wishlist" element={<Wishlist />} />
                  </Route>
                  
                  {/* Seller Routes */}
                  <Route element={<SellerRoute />}>
                    <Route path="seller" element={<SellerLayout />}>
                      <Route index element={<SellerDashboard />} />
                      <Route path="subscription-plans" element={<SubscriptionPlans />} />
                      <Route path="premium-verification" element={<SellerPremiumVerification />} />
                      <Route path="premium-payment" element={<SellerPremiumPayment />} />
                      <Route
                        element={<SubscriptionGate requiredFeatures={[SUBSCRIPTION_FEATURES.INVENTORY_LEDGER]} />}
                      >
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="edit-product/:id" element={<EditProduct />} />
                      </Route>
                      <Route
                        element={<SubscriptionGate requiredFeatures={[SUBSCRIPTION_FEATURES.ESCROW_CLIENT]} />}
                      >
                        <Route path="orders" element={<SellerOrders />} />
                      </Route>
                    </Route>
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="contact-queue" element={<AdminContactQueue />} />
                    </Route>
                  </Route>
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
