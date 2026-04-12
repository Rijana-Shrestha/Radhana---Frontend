import React, { useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import logoImg from "../../Assets/images/radhanalogo.png";

const NavBar = () => {
  const { getCartCount } = useContext(CartContext);
  const { user, isLoggedIn, logout, loading } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <div className="w-full">
      {/* ── Announcement Bar ── */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-800 py-2 px-4 overflow-hidden sticky top-0 z-[70]">
        <div className="flex whitespace-nowrap announcement-scroll">
          <p className="font-sub text-xs md:text-sm font-medium inline-block pr-20">
            🎨 Premium Laser Engraving | 📦 Custom Wooden &amp; Acrylic Products
            | 🎁 Perfect Gifts | 📞 +977 9823939106 | 🚚 Fast Delivery Kathmandu
            | 💳 eSewa · Khalti · FonePay Accepted
          </p>
          <p className="font-sub text-xs md:text-sm font-medium inline-block pr-20">
            🎨 Premium Laser Engraving | 📦 Custom Wooden &amp; Acrylic Products
            | 🎁 Perfect Gifts | 📞 +977 9823939106 | 🚚 Fast Delivery Kathmandu
            | 💳 eSewa · Khalti · FonePay Accepted
          </p>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header className="bg-white shadow-sm sticky top-[40px] z-50 transition-shadow duration-300">
        <div className="container mx-auto py-3 md:py-2 px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-md bg-white flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Radhana Art"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-main text-primary text-lg md:text-[22px] font-bold leading-tight block">
                  Radhana Art
                </span>
                <span className="font-sub text-[10px] text-gray-400 hidden md:block">
                  Laser Engraving · Kathmandu
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 hover:text-primary transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <i
                className={`fas ${mobileOpen ? "fa-times" : "fa-bars"} text-2xl`}
              ></i>
            </button>

           

            {/* Right Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-5">
              {/* User */}
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : isLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 bg-gradient-to-br from-pink-500 to-blue-600 text-white rounded-full px-3 py-2 hover:shadow-lg transition"
                  >
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <i className="fa-solid fa-circle-user text-xl"></i>
                    )}
                    <span className="text-sm font-medium max-w-[80px] truncate font-sub">
                      {user.name}
                    </span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800 font-sub">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 font-sub">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 font-sub transition"
                      >
                        <i className="fas fa-user mr-2 text-primary"></i> View
                        Profile
                      </Link>
                      {user.roles && user.roles.includes("ADMIN") && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 font-sub font-semibold transition"
                        >
                          <i className="fas fa-chart-bar mr-2"></i> Admin
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-sub flex items-center gap-2 transition"
                      >
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-primary transition hover:scale-110 inline-block"
                >
                  <i className="text-2xl fa-solid fa-circle-user"></i>
                </button>
              )}

              {/* WhatsApp */}
              <a
                href="https://wa.me/9779823939106"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-green-600 font-sub text-sm font-medium hover:scale-105 transition"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                <span>+977 9823939106</span>
              </a>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-xl font-sub text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-shopping-cart"></i>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-sub">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Desktop Nav Links ── */}
          <nav className="font-sub hidden lg:flex gap-1 items-center justify-center text-[14px] mt-3 pt-2.5 border-t border-gray-100">
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products" },
              { label: "Gallery", path: "/gallery" },
              { label: "About Us", path: "/about" },
              { label: "FAQ", path: "/faq" },
              { label: "Contact", path: "/contact" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link text-gray-700 hover:text-secondary transition px-3 py-1.5 font-medium ${isActive(path) ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Mobile Menu ── */}
          {mobileOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="font-sub w-full py-2.5 pl-9 pr-4 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary bg-gray-50"
                />
              </div>
              <nav className="font-sub flex flex-col">
                {[
                  { label: "Home", path: "/" },
                  { label: "Products", path: "/products" },
                  { label: "Gallery", path: "/gallery" },
                  { label: "About Us", path: "/about" },
                  { label: "FAQ", path: "/faq" },
                  { label: "Contact", path: "/contact" },
                ].map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 border-b border-gray-100 text-sm ${isActive(path) ? "text-secondary font-medium" : "text-gray-700"}`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  className="text-gray-600"
                >
                  <i className="text-2xl fa-solid fa-circle-user"></i>
                </button>
                <a
                  href="https://wa.me/9779823939106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 font-sub text-sm font-medium"
                >
                  <i className="fa-brands fa-whatsapp text-2xl"></i>
                  <span>+977 9823939106</span>
                </a>
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileOpen(false);
                  }}
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-xl font-sub text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-shopping-cart"></i>
                  <span>Add Cart</span>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/9779823939106"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default NavBar;
