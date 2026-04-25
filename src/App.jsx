import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedAuthRoute from "./components/ProtectedRoute";
import ProtectedCheckoutRoute from "./components/ProtectedCheckoutRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminHomeGuard from "./components/AdminHomeGuard";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import EditPage from "./pages/EditPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentVerify from "./pages/PaymentVerify";
import Footer from "./components/Footer";
import { AdminProvider } from "./context/AdminContext";
import SearchResult from "./pages/SearchResult";
import VerifyEmail from "./pages/VerifyEmail";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/admin-dashboard",
  "/forgot-password",
  "/reset-password",
  "/payment/verify",
  "/payment/fonepay-verify",
  "/verify-email",
  "/product/",
];

const App = () => {
  const location = useLocation();

  // ✅ Fix: With HashRouter, pathname is always "/".
  // The actual route lives in location.hash e.g. "#/login"
  // So we extract the path from the hash instead.
// ✅ Use this
const isAuthPage = AUTH_PATHS.some(path => location.pathname.startsWith(path));
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={
            <AdminHomeGuard>
              <Home />
            </AdminHomeGuard>
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/searchRes" element={<SearchResult />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditPage />} />
        <Route
          path="/login"
          element={
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedAuthRoute>
              <Register />
            </ProtectedAuthRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/payment/verify"
          element={<PaymentVerify gateway="khalti" />}
        />
        <Route
          path="/payment/fonepay-verify"
          element={<PaymentVerify gateway="fonepay" />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedCheckoutRoute>
              <Checkout />
            </ProtectedCheckoutRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminProvider>
                <AdminDashboard />
              </AdminProvider>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;