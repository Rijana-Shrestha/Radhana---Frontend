import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ProductContext } from "../context/ProductsContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { fetchProducts } = useContext(ProductContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const foundProduct = data.find((p) => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setError("");
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, fetchProducts]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      showToast(`${product.name} added to cart!`, "success");
      setQuantity(1);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#145faf] mx-auto mb-4"></div>
          <p className="text-gray-600 font-sub">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-sub text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#145faf] text-white px-6 py-2 rounded-lg font-sub hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageUrls = product.imageUrls || [];
  const mainImage = imageUrls[selectedImageIndex] || "";

  return (
    <main className="min-h-screen bg-white">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400]">
          <div className={`font-sub text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}>
            <i className={`fas ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} />
            {toast.msg}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm font-sub text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-[#145faf]">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate("/products")} className="hover:text-[#145faf]">
            Products
          </button>
          <span>/</span>
          <span className="text-[#145faf] font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/500?text=Image")}
              />
              {product.badge && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-sub font-bold text-sm">
                  {product.badge}
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-gray-700 text-white px-6 py-3 rounded-lg font-sub font-bold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === selectedImageIndex ? "border-[#145faf]" : "border-gray-300 hover:border-[#145faf]"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Category & Name */}
            <div>
              <p className="text-sm font-sub text-[#145faf] font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-main text-[#145faf] mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star text-lg ${
                        i < Math.floor(product.stars || 5) ? "text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-sub text-sm text-gray-600">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-[#D93A6A]">
                  Rs {Number(product.price).toLocaleString()}
                </span>
                {product.maxPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    Rs {Number(product.maxPrice).toLocaleString()}
                  </span>
                )}
              </div>
              {product.maxPrice > product.price && (
                <p className="text-green-600 font-sub font-bold">
                  Save Rs {Number(product.maxPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-main text-[#145faf] mb-2">Description</h3>
                <p className="text-gray-700 font-sub leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {product.stock !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-sub text-gray-600 uppercase mb-1">Stock</p>
                  <p className="text-lg font-bold text-[#145faf]">{product.stock || 99}</p>
                </div>
              )}
              {product.forWho && product.forWho.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-sub text-gray-600 uppercase mb-1">For</p>
                  <p className="text-sm font-sub font-semibold text-[#145faf]">
                    {product.forWho.join(", ")}
                  </p>
                </div>
              )}
              {product.festival && product.festival.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-sub text-gray-600 uppercase mb-1">Festival</p>
                  <p className="text-sm font-sub font-semibold text-[#145faf]">
                    {product.festival.join(", ")}
                  </p>
                </div>
              )}
              {product.occasion && product.occasion.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-sub text-gray-600 uppercase mb-1">Occasion</p>
                  <p className="text-sm font-sub font-semibold text-[#145faf]">
                    {product.occasion.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-sub font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  <i className="fas fa-minus text-[#145faf]" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-0 py-2 font-sub font-bold"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  <i className="fas fa-plus text-[#145faf]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-lg font-sub font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  product.inStock
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-shopping-cart" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <WhatsAppShareButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const WhatsAppShareButton = ({ product }) => {
  const productUrl = `${window.location.origin}/product/${product._id}`;
  const message = `Hi! I'm interested in: *${product.name}*\n\nPrice: Rs ${Number(product.price).toLocaleString()}\n\nView details here: ${productUrl}\n\nPlease let me know the details and how to order. Thank you!`;

  return (
    <a
      href={`https://wa.me/9779823939106?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="w-full py-3 rounded-lg font-sub font-bold text-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg"
    >
      <i className="fa-brands fa-whatsapp text-xl" />
      Share on WhatsApp
    </a>
  );
};

export default ProductDetail;
