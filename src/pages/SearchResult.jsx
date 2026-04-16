import React, { useState, useContext, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ProductContext } from '../context/ProductsContext';

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

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const { searchProducts } = useContext(ProductContext);
    const { addToCart } = useCart();
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
    const [quickView, setQuickView] = useState(null);
    const [qvQty, setQvQty] = useState(1);
    const toastTimer = useRef(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                setError('');
                return;
            }
            
            setLoading(true);
            setError('');
            try {   
                const data = await searchProducts(searchQuery);
                setResults(Array.isArray(data) ? data : []);
                if (!data || data.length === 0) {
                    setError(`No products found for "${searchQuery}"`);
                }
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError('Failed to fetch search results. Please try again.');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSearchResults();
    }, [searchQuery, searchProducts]);

    const showToast = (msg, type = "success") => {
        setToast({ show: true, msg, type });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(
            () => setToast((t) => ({ ...t, show: false })),
            2500,
        );
    };

    const handleAddToCart = (product) => {
        try {
            addToCart(product);
            showToast(`"${product.name}" added to cart!`);
        } catch {
            showToast("Failed to add to cart", "error");
        }
    };

    const openQV = (product) => {
        setQuickView(product);
        setQvQty(1);
    };
    const closeQV = () => setQuickView(null);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-main text-3xl text-[#145faf] mb-2">Search Results</h1>
                    {searchQuery && (
                        <p className="font-sub text-gray-600">
                            Results for: <span className="font-semibold text-[#D93A6A]">"{searchQuery}"</span>
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-center">
                            <div className="mb-4">
                                <i className="fas fa-spinner fa-spin text-4xl text-[#145faf]"></i>
                            </div>
                            <p className="font-sub text-gray-600">Searching for products...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <i className="fas fa-exclamation-circle text-3xl text-red-500 mb-2"></i>
                        <p className="font-sub text-red-700">{error}</p>
                        <Link 
                            to="/products"
                            className="font-sub text-[#145faf] hover:text-[#D93A6A] mt-2 inline-block font-semibold"
                        >
                            Browse all products →
                        </Link>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && results.length > 0 && (
                    <div>
                        <p className="font-sub text-gray-600 mb-6">
                            Found <span className="font-semibold text-[#145faf]">{results.length}</span> product{results.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map((product, idx) => (
                                <GridCard key={product._id || idx} product={product} idx={idx} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && results.length === 0 && searchQuery && (
                    <div className="text-center py-16">
                        <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
                        <p className="font-sub text-gray-600">Try different keywords or browse our categories</p>
                    </div>
                )}

                {/* No Search Query */}
                {!searchQuery && !loading && (
                    <div className="text-center py-16">
                        <i className="fas fa-magnifying-glass text-5xl text-gray-300 mb-4"></i>
                        <p className="font-sub text-gray-600">Enter a search term to get started</p>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-4 right-4 font-sub px-6 py-3 rounded-xl shadow-lg text-white animate-pulse ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Quick View Modal */}
            {quickView && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={closeQV}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-2xl w-full overflow-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 md:p-8">
                            <button
                                onClick={closeQV}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <img
                                        src={quickView.imageUrls?.[0] || quickView.images?.[0]}
                                        alt={quickView.name}
                                        className="w-full rounded-xl"
                                    />
                                </div>
                                
                                <div>
                                    <p className="font-sub text-sm text-[#145faf] font-semibold mb-2">
                                        {quickView.category}
                                    </p>
                                    <h2 className="font-main text-2xl text-[#145faf] mb-3">
                                        {quickView.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Stars count={Math.floor(quickView.rating || 5)} />
                                        <span className="font-sub text-sm text-gray-600">
                                            ({quickView.reviews || 0} reviews)
                                        </span>
                                    </div>
                                    <p className="font-sub text-3xl text-[#D93A6A] font-bold mb-4">
                                        Rs. {Number(quickView.price).toLocaleString()}
                                    </p>
                                    <p className="font-sub text-gray-600 mb-6 leading-relaxed">
                                        {quickView.description || "Premium laser-engraved product crafted with precision."}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                handleAddToCart(quickView);
                                                closeQV();
                                            }}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-sub font-medium transition-all"
                                        >
                                            <i className="fas fa-shopping-cart" /> Add to Cart
                                        </button>
                                        <WhatsAppLink name={quickView.name} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchResult