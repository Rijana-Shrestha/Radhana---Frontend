import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import logoImg from "../../Assets/images/radhanalogo.png";
import { Search, X } from "lucide-react";
import { ProductContext } from "../context/ProductsContext";

const NavBar = () => {
  const { getCartCount } = useContext(CartContext);
  const { user, isLoggedIn, logout, loading } = useContext(AuthContext);
  const { fetchProducts } = useContext(ProductContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

   // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('searchHistory') || '[]') }
    catch { return [] }
  })
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchProducts().then(data => {
      if (Array.isArray(data)) setAllProducts(data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length === 0) { setSuggestions([]); return }
    const q = searchQuery.toLowerCase()
    const matched = allProducts
      .filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 6)
    setSuggestions(matched)
  }, [searchQuery, allProducts])

  const saveToHistory = (term) => {
    if (!term.trim()) return
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, 8)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const handleSearch = (term) => {
    const q = term || searchQuery
    if (!q.trim()) return
    saveToHistory(q.trim())
    setShowSuggestions(false)
    setSearchQuery(q)
    navigate('/searchRes?search=' + encodeURIComponent(q.trim()))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setShowSuggestions(false)
  }

  const showingHistory = searchQuery.trim().length === 0 && searchHistory.length > 0

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

            <div className='flex-1 mx-8 relative' ref={searchRef}>
          <div className={`flex gap-2 bg-[#F9FAFB] p-1 rounded-xl border-2 transition-all ${showSuggestions ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            <input
              ref={inputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder='Search products, categories...'
              className='flex-1 px-4 py-2 bg-transparent rounded-lg focus:outline-none text-gray-700'
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSuggestions([]); inputRef.current?.focus() }} className='text-gray-400 hover:text-gray-600 px-1'>
                <X size={16} />
              </button>
            )}
            <button onClick={() => handleSearch()} className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2'>
              <Search size={16} />Search
            </button>
          </div>

          {showSuggestions && (showingHistory || suggestions.length > 0) && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden'>
              {showingHistory && (
                <div>
                  <div className='flex items-center justify-between px-4 py-2 border-b border-gray-100'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Search History</span>
                    <button onClick={clearHistory} className='text-xs text-blue-600 hover:text-blue-800 font-medium'>CLEAR</button>
                  </div>
                  {searchHistory.map((term, i) => (
                    <button key={i} onClick={() => handleSearch(term)} className='suggestion-item w-full text-left px-4 py-3 text-sm text-gray-700 flex items-center gap-3 border-b border-gray-50 last:border-0'>
                      <Search size={14} className='text-gray-400 flex-shrink-0' />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )}
              {suggestions.length > 0 && (
                <div>
                  {searchHistory.length > 0 && searchQuery && (
                    <div className='px-4 py-2 border-b border-gray-100'>
                      <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Products</span>
                    </div>
                  )}
                  {suggestions.map((product) => (
                    <button
                      key={product._id || product.id}
                      onClick={() => { saveToHistory(product.name); setShowSuggestions(false); setSearchQuery(product.name); navigate('/products?search=' + encodeURIComponent(product.name)) }}
                      className='suggestion-item w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0'
                    >
                      <div className='w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                        <img src={product.imageUrls?.[0] || product.images?.[0]} alt={product.name} className='w-full h-full object-cover' onError={(e) => e.target.style.display = 'none'} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-800 truncate'>{product.name}</p>
                        <p className='text-xs text-blue-600'>{product.category}</p>
                      </div>
                      <span className='text-sm font-bold text-red-600 flex-shrink-0'>Rs. {product.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
