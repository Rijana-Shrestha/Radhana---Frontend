import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ProductContext } from "../context/ProductsContext";

/* ── tiny helpers ── */
const Stars = ({ count = 5 }) => (
  <span className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star text-xs ${i < count ? "text-amber-400" : "text-gray-200"}`}
      />
    ))}
  </span>
);

const WhatsAppLink = ({ name }) => (
  <a
    href={`https://wa.me/9779823939106?text=Hi! I'm interested in: ${encodeURIComponent(name)}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-sub text-xs font-medium transition-all hover:shadow-lg"
  >
    <i className="fa-brands fa-whatsapp text-sm" /> WhatsApp
  </a>
);

/* ══════════════════════════════════════════════════════ */
const Products = () => {
  const { addToCart } = useCart();
  const { fetchProducts } = useContext(ProductContext);

  /* ─── data state ─── */
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState("");

  /* ─── ui state ─── */
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [quickView, setQuickView] = useState(null);
  const [qvQty, setQvQty] = useState(1);

  /* ─── filter / sort state ─── */
  const [sortBy, setSortBy] = useState("default");
  const [currentView, setCurrentView] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const toastTimer = useRef(null);

  /* ─── load products ─── */
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setError(false);
        setServerError("");
      } else {
        setProducts([]);
        setError(true);
        setServerError("No products available at the moment.");
      }
    } catch {
      setError(true);
      setProducts([]);
      setServerError(
        "Unable to connect to the server. Please try again later.",
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const unique = ["All", ...new Set(products.map((p) => p.category))];
      setCategories(unique);
    }
  }, [products]);

  /* ─── url param sync ─── */
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  /* ─── derived filtered list ─── */
  const filtered = (() => {
    let list = products.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter)
        return false;
      const price = Number(p.price);
      if (price < priceMin || price > priceMax) return false;
      if (searchTerm) {
        const hay = (
          p.name +
          " " +
          (p.description || "") +
          " " +
          p.category
        ).toLowerCase();
        if (
          !searchTerm
            .toLowerCase()
            .split(" ")
            .some((w) => hay.includes(w))
        )
          return false;
      }
      return true;
    });

    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "name-asc")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  })();

  const visible = filtered.slice(0, visibleCount);

  /* ─── cart ─── */
  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      showToast(`"${product.name}" added to cart!`);
    } catch {
      showToast("Failed to add to cart", "error");
    }
  };

  /* ─── toast ─── */
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2500,
    );
  };

  /* ─── quick view ─── */
  const openQV = (product) => {
    setQuickView(product);
    setQvQty(1);
  };
  const closeQV = () => setQuickView(null);

  /* ─── clear filters ─── */
  const clearFilters = () => {
    setCategoryFilter("All");
    setPriceMin(0);
    setPriceMax(200000);
    setSearchTerm("");
    setSortBy("default");
    setVisibleCount(12);
  };

  /* ══ SIDEBAR ══ */
  const Sidebar = () => (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-main text-lg text-gray-800">Product Filters</h2>
        <button
          onClick={clearFilters}
          className="font-sub text-xs text-[#D93A6A] hover:text-pink-700 transition font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <p className="font-sub font-semibold text-sm text-gray-700 mb-3">
          Price Range (Rs.)
        </p>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="font-sub text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">
              From
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-sub text-xs text-gray-500">
                Rs.
              </span>
              <input
                type="number"
                value={priceMin}
                min={0}
                onChange={(e) => {
                  setPriceMin(Number(e.target.value));
                  setVisibleCount(12);
                }}
                className="font-sub w-full border border-gray-200 rounded-lg py-2 pl-8 pr-2 text-xs focus:outline-none focus:border-[#145faf]"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="font-sub text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">
              To
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-sub text-xs text-gray-500">
                Rs.
              </span>
              <input
                type="number"
                value={priceMax}
                min={0}
                onChange={(e) => {
                  setPriceMax(Number(e.target.value));
                  setVisibleCount(12);
                }}
                className="font-sub w-full border border-gray-200 rounded-lg py-2 pl-8 pr-2 text-xs focus:outline-none focus:border-[#145faf]"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="font-sub text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Quick Select
          </p>
          {[
            [0, 500, "Under Rs. 500"],
            [0, 1000, "Under Rs. 1,000"],
            [0, 1500, "Under Rs. 1,500"],
            [1500, 5000, "Rs. 1,500 – 5,000"],
            [5000, 200000, "Above Rs. 5,000"],
          ].map(([mn, mx, label]) => (
            <button
              key={label}
              onClick={() => {
                setPriceMin(mn);
                setPriceMax(mx);
                setVisibleCount(12);
              }}
              className="w-full text-left font-sub text-xs text-gray-600 hover:text-[#D93A6A] transition px-2 py-1.5 rounded-lg hover:bg-pink-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="font-sub font-semibold text-sm text-gray-700 mb-3">
          Category
        </p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setVisibleCount(12);
              }}
              className={`w-full text-left font-sub text-sm px-3 py-2 rounded-xl transition ${
                categoryFilter === cat
                  ? "bg-[#145faf] text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#145faf]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ══ GRID CARD ══ */
  const GridCard = ({ product, idx }) => {
    const img = product.imageUrls?.[0] || product.images?.[0];
    const fallback =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23ccc' font-size='40'%3E🎨%3C/text%3E%3C/svg%3E";

    return (
      <div
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1.5 flex flex-col"
        style={{
          animation: "popIn 0.35s ease both",
          animationDelay: `${idx * 50}ms`,
        }}
      >
        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={img}
            alt={product.name}
            onError={(e) => (e.target.src = fallback)}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.inStock === false && (
            <span className="absolute top-3 right-3 bg-gray-500 text-white text-[10px] font-sub px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
          <button
            onClick={() => openQV(product)}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#145faf] hover:bg-[#145faf] hover:text-white font-sub text-xs font-medium px-3 py-1.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow"
          >
            <i className="fas fa-eye mr-1" /> Quick View
          </button>
        </div>

        {/* body */}
        <div className="p-5 flex flex-col flex-1">
          <p className="font-sub text-[10px] text-[#145faf] font-semibold uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-main text-[16px] text-[#145faf] mb-1 group-hover:text-[#D93A6A] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="font-sub text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">
            {product.description ||
              "Premium laser-engraved product crafted with precision."}
          </p>
          <div className="flex items-center gap-1.5 mb-3">
            <Stars count={Math.floor(product.rating || 5)} />
            <span className="font-sub text-xs text-gray-400">
              ({product.reviews || 0})
            </span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="font-sub text-gray-400 text-[10px]">
                Starting from
              </p>
              <p className="font-sub text-[#D93A6A] font-bold text-xl">
                Rs. {Number(product.price).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddToCart(product)}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-sub text-xs font-medium transition-all hover:shadow-lg"
            >
              <i className="fas fa-shopping-cart text-sm" /> Add to Cart
            </button>
            <WhatsAppLink name={product.name} />
          </div>
        </div>
      </div>
    );
  };

  /* ══ LIST CARD ══ */
  const ListCard = ({ product, idx }) => {
    const img = product.imageUrls?.[0] || product.images?.[0];
    const fallback =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3C/svg%3E";
    return (
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex gap-4 p-4 group"
        style={{
          animation: "popIn 0.35s ease both",
          animationDelay: `${idx * 50}ms`,
        }}
      >
        <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-32 h-32">
          <img
            src={img}
            alt={product.name}
            onError={(e) => (e.target.src = fallback)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="font-sub text-[10px] text-[#145faf] font-semibold uppercase tracking-wider mb-0.5">
            {product.category}
          </p>
          <h3 className="font-main text-base text-[#145faf] group-hover:text-[#D93A6A] transition-colors mb-1">
            {product.name}
          </h3>
          <p className="font-sub text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">
            {product.description || "Premium laser-engraved product."}
          </p>
          <div className="flex items-center gap-1 mb-2">
            <Stars count={Math.floor(product.rating || 5)} />
            <span className="font-sub text-xs text-gray-400 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="font-sub text-[#D93A6A] font-bold text-lg">
              Rs. {Number(product.price).toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-sub text-xs font-medium px-4 py-2 rounded-xl transition flex items-center gap-1.5 hover:shadow-lg"
              >
                <i className="fas fa-shopping-cart" /> Add to Cart
              </button>
              <WhatsAppLink name={product.name} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <main className="bg-white">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400]">
          <div className="bg-gray-900 text-white font-sub text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <i
              className={`fas ${toast.type === "success" ? "fa-check-circle text-green-400" : "fa-exclamation-circle text-red-400"}`}
            />
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickView && (
        <div
          className="fixed inset-0 bg-black/70 z-[180] flex items-center justify-center p-4"
          onClick={closeQV}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-main text-xl text-[#145faf]">
                {quickView.name}
              </h3>
              <button
                onClick={closeQV}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={quickView.imageUrls?.[0] || quickView.images?.[0]}
                alt={quickView.name}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="p-6">
                <p className="font-sub text-[10px] text-[#145faf] font-semibold uppercase tracking-wider mb-2">
                  {quickView.category}
                </p>
                <p className="font-sub text-gray-500 text-sm leading-relaxed mb-4">
                  {quickView.description ||
                    "Premium laser-engraved product crafted with precision."}
                </p>
                <div className="flex gap-1 mb-3">
                  <Stars count={Math.floor(quickView.rating || 5)} />
                  <span className="font-sub text-xs text-gray-400 ml-1">
                    ({quickView.reviews || 0})
                  </span>
                </div>
                <p className="font-sub text-gray-400 text-xs">Starting from</p>
                <p className="font-sub text-[#D93A6A] font-bold text-3xl mb-1">
                  Rs. {Number(quickView.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-3 mb-5 mt-3">
                  <label className="font-sub text-sm text-gray-600 font-medium">
                    Qty:
                  </label>
                  <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setQvQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-sub font-semibold text-sm">
                      {qvQty}
                    </span>
                    <button
                      onClick={() => setQvQty((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(quickView);
                    closeQV();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-sub font-semibold py-3 rounded-xl transition-all hover:shadow-lg mb-2 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-shopping-cart" /> Add to Cart
                </button>
                <a
                  href={`https://wa.me/9779823939106?text=Hi! I'm interested in: ${encodeURIComponent(quickView.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sub font-medium py-2.5 rounded-xl transition"
                >
                  <i className="fa-brands fa-whatsapp" /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {filterDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[150]"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-[160] shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
              <h2 className="font-main text-lg text-gray-800">
                Product Filters
              </h2>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>
            <div className="p-5">
              <Sidebar />
            </div>
          </div>
        </>
      )}

      {/* Page Hero */}
      <section className="py-8 md:py-10 px-6 md:px-8 lg:px-12 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 font-sub text-sm text-gray-400 mb-3">
            <Link to="/" className="hover:text-[#145faf] transition">
              Home
            </Link>
            <i className="fas fa-chevron-right text-[9px]" />
            <span className="text-[#D93A6A] font-medium">Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-main text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-1">
                All Products
              </h1>
              <p className="font-sub text-gray-400 text-sm">
                Explore our full collection of laser-engraved products
              </p>
            </div>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#145faf] text-white font-sub text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#D93A6A] transition self-start"
            >
              <i className="fas fa-sliders" /> Filters &amp; Sort
            </button>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-8 px-4 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="flex gap-7">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <Sidebar />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <div>
                  <p className="font-sub text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                      {filtered.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setVisibleCount(12);
                    }}
                    className="font-sub text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#145faf] bg-white text-gray-600 cursor-pointer"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setCurrentView("grid")}
                      className={`px-3 py-2 transition ${currentView === "grid" ? "bg-[#145faf] text-white" : "bg-white text-gray-400 hover:text-[#145faf]"}`}
                    >
                      <i className="fas fa-th-large text-sm" />
                    </button>
                    <button
                      onClick={() => setCurrentView("list")}
                      className={`px-3 py-2 transition ${currentView === "list" ? "bg-[#145faf] text-white" : "bg-white text-gray-400 hover:text-[#145faf]"}`}
                    >
                      <i className="fas fa-list text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              {error ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-3xl text-red-300" />
                  </div>
                  <h3 className="font-main text-xl text-gray-500 mb-2">
                    Server Error
                  </h3>
                  <p className="font-sub text-gray-400 text-sm">
                    {serverError}
                  </p>
                </div>
              ) : visible.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <i className="fas fa-box-open text-4xl text-gray-200" />
                  </div>
                  <h3 className="font-main text-xl text-gray-500 mb-2">
                    No products found
                  </h3>
                  <p className="font-sub text-gray-400 text-sm mb-5">
                    Try adjusting your filters or browse all products
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-[#145faf] text-white font-sub text-sm font-medium px-7 py-2.5 rounded-xl hover:bg-[#D93A6A] transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : currentView === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visible.map((p, i) => (
                    <GridCard key={p._id || p.id} product={p} idx={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {visible.map((p, i) => (
                    <ListCard key={p._id || p.id} product={p} idx={i} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {filtered.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((v) => v + 8)}
                    className="font-sub bg-[#145faf] hover:bg-[#D93A6A] text-white px-8 py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center gap-2 font-medium hover:-translate-y-0.5"
                  >
                    Load More Products <i className="fas fa-arrow-down" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white border border-gray-100 px-6 text-center mt-6">
        <div className="container mx-auto">
          <h2 className="font-main text-gray-900 text-2xl md:text-3xl mb-3">
            Can't Find What You're Looking For?
          </h2>
          <p className="font-sub text-blue-100 text-[15px] mb-7 max-w-lg mx-auto">
            We do fully custom orders! Share your idea on WhatsApp and we'll
            craft it for you.
          </p>
          <a
            href="https://wa.me/9779823939106"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <i className="fa-brands fa-whatsapp text-xl" /> Request Custom Order
          </a>
        </div>
      </section>

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(.94) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Products;
