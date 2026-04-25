import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";
import khaltiImg from "../../Assets/khalti.png";
import fonepayImg from "../../Assets/fonepay.jpeg";

// ── QR Payment Modal ────────────────────────────────────────────────────────
const QRPaymentModal = ({ method, amount, orderNumber, onClose }) => {
  const isKhalti = method === "khalti";
  const bgGradient = isKhalti
    ? "from-purple-600 to-purple-800"
    : "from-blue-600 to-blue-800";
  const whatsappMsg = encodeURIComponent(
    `Hi! I have completed payment for Order #${orderNumber} (Rs. ${amount?.toLocaleString()}) via ${isKhalti ? "Khalti" : "FonePay"}. Please find screenshot attached.`,
  );
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div
          className={
            "bg-gradient-to-r " +
            bgGradient +
            " p-5 flex items-center justify-between"
          }
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <img
                src={isKhalti ? khaltiImg : fonepayImg}
                alt={isKhalti ? "Khalti" : "FonePay"}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {isKhalti ? "Khalti" : "FonePay"}
              </h3>
              <p className="text-white/70 text-xs">
                Quick &amp; Secure Payment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 font-bold text-lg px-5 py-2 rounded-full">
              Rs. {amount?.toLocaleString()}
            </span>
            <p className="text-xs text-gray-400 mt-1">Order #{orderNumber}</p>
          </div>
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50 mb-4"
            style={{ minHeight: 240 }}
          >
            {/* Replace the img src with your actual QR code image */}
            <img
              src={isKhalti ? khaltiImg : fonepayImg}
              alt="QR Code"
              className="w-48 h-48 object-contain rounded-xl"
            />
            <p className="text-xs text-orange-500 font-medium mt-2">
              {isKhalti
                ? "Replace with your Khalti QR image"
                : "Replace with your FonePay QR image"}
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-orange-500 text-xl">📱</span>
            <p className="text-sm text-gray-700">
              Scan this QR with your{" "}
              <strong className="text-orange-500">
                {isKhalti ? "Khalti" : "FonePay"}
              </strong>{" "}
              app
            </p>
          </div>
          <div className="flex justify-center gap-6 text-xs text-gray-500 mb-5">
            {["Open App", "Scan QR", "Pay & Confirm"].map((s, i) => (
              <span key={i} className="flex flex-col items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-gray-100 font-bold flex items-center justify-center text-gray-600">
                  {i + 1}
                </span>
                {s}
              </span>
            ))}
          </div>
          <p className="text-center text-xs text-orange-600 font-medium mb-4">
            🔸 After payment, send us a screenshot on WhatsApp
          </p>
          <a
            href={"https://wa.me/9779823939106?text=" + whatsappMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm"
          >
            <i className="fas fa-comment"></i> Send Payment Screenshot on
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const PAYMENT_METHODS = [
  {
    id: "khalti",
    name: "Khalti",
    desc: "Scan Khalti QR to pay instantly",
    color: "purple",
    logo: "🟣",
  },
  {
    id: "fonepay",
    name: "FonePay",
    desc: "Scan FonePay QR with any banking app",
    color: "blue",
    logo: "🔵",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay cash when your order arrives",
    color: "green",
    logo: "💵",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    desc: "Direct bank transfer — we confirm manually",
    color: "gray",
    logo: "🏦",
  },
];

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  half,
}) => (
  <div className={half ? "" : "col-span-2"}>
    <label className="block text-sm font-bold text-gray-800 mb-2">
      {label}
      {required && " *"}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
    />
  </div>
);

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    country: "Nepal",
    paymentMethod: "khalti",
  });
  const [step, setStep] = useState("form"); // 'form' | 'placed' | 'paying'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        province: user.address?.province || "",
        country: user.address?.country || "Nepal",
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Step 1: Create the order ──────────────────────────────
  // Validates Nepali phone numbers:
  // Accepts: 98xxxxxxxx, 97xxxxxxxx, 96xxxxxxxx, 984xxxxxxx
  // Also accepts with country code: +977-98xxxxxxxx or 977-98xxxxxxxx
  const validateNepaliPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-]/g, ""); // remove spaces and hyphens
    // With country code: +97798xxxxxxxx or 97798xxxxxxxx
    const withCode = /^(\+977|977)(98|97|96)\d{8}$/;
    // Without code: 98xxxxxxxx or 97xxxxxxxx or 96xxxxxxxx (10 digits)
    const withoutCode = /^(98|97|96)\d{8}$/;
    return withCode.test(cleaned) || withoutCode.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate Nepali phone number
    if (!validateNepaliPhone(formData.phone)) {
      setError(
        "Please enter a valid Nepali phone number (e.g. 9812345678 or +9779812345678).",
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const items = cartItems.map((item) => ({
        product: item.product?._id || item._id || item.id,
        quantity: item.quantity || item.qty || 1,
        price: Math.max(0, item.product?.price || item.price || 0),
      }));

      const totalPrice = cartItems.reduce(
        (sum, i) =>
          sum + (i.product?.price || i.price || 0) * (i.quantity || i.qty || 1),
        0,
      );

      const res = await axiosInstance.post("/orders/", {
        orderItems: items,
        totalPrice,
        shippingAddress: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          street: formData.address.trim(),
          city: formData.city.trim(),
          landmark: "",
          country: formData.country.trim(),
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: "",
      });

      setCreatedOrder(res.data);
      clearCart();
      setStep("placed");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Trigger payment ───────────────────────────────
  const handlePayNow = async () => {
    if (!createdOrder?._id) return;
    setLoading(true);
    setError("");

    try {
      if (formData.paymentMethod === "khalti") {
        const res = await axiosInstance.post(
          `/orders/${createdOrder._id}/payment/khalti`,
        );
        // Redirect to Khalti payment page
        // Khalti will redirect back to KHALTI_RETURN_URL (our /payment/verify page)
        // We pass orderId in returnUrl via config, but also store in sessionStorage as fallback
        sessionStorage.setItem("pendingOrderId", createdOrder._id);
        window.location.href = res.data.payment_url;
      } else if (formData.paymentMethod === "fonepay") {
        const res = await axiosInstance.post(
          `/orders/${createdOrder._id}/payment/fonepay`,
        );
        sessionStorage.setItem("pendingOrderId", createdOrder._id);
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment initiation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Empty cart ────────────────────────────────────────────
  if (!cartItems.length && step === "form") {
    return (
      <main>
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="w-full max-w-md text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shopping-cart text-5xl text-yellow-500"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products before checking out
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ── Order placed — show payment options ───────────────────
  if (step === "placed" && createdOrder) {
    const isPaidMethod = ["khalti", "fonepay"].includes(formData.paymentMethod);
    const isKhalti = formData.paymentMethod === "khalti";
    const whatsappMsg = encodeURIComponent(
      `Hi! I have completed payment for Order #${createdOrder.orderNumber} (Rs. ${createdOrder.totalPrice?.toLocaleString()}) via ${isKhalti ? "Khalti" : "FonePay"}. Please find screenshot attached.`,
    );
    return (
      <main>
        <section className="min-h-[calc(100vh-200px)] px-6 py-12 bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="max-w-5xl mx-auto">
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-4xl text-green-600"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order Placed!
              </h1>
              <p className="text-gray-500">
                Your order has been received successfully
              </p>
            </div>

            {/* Two-column: Order card + Payment */}
            <div
              className={`grid gap-6 ${isPaidMethod ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-lg mx-auto"}`}
            >
              {/* ── Left: Order details ── */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Order Number
                    </p>
                    <p className="text-lg font-bold text-gray-800 font-mono">
                      {createdOrder.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Total
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      Rs. {createdOrder.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Name</p>
                    <p className="font-semibold text-gray-800">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Phone</p>
                    <p className="font-semibold text-gray-800">
                      {formData.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                    <p className="text-gray-400 text-xs mb-1">
                      Delivery Address
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formData.address}, {formData.city}
                    </p>
                  </div>
                </div>
                {/* COD / Bank details inline when not a QR method */}
                {!isPaidMethod && (
                  <>
                    {formData.paymentMethod === "cod" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-3xl mb-2">💵</p>
                        <p className="font-bold text-gray-800 mb-1">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-500">
                          Please keep{" "}
                          <strong>
                            Rs. {createdOrder.totalPrice?.toLocaleString()}
                          </strong>{" "}
                          ready when your order arrives.
                        </p>
                      </div>
                    )}
                    {formData.paymentMethod === "bank" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm space-y-1">
                        <p className="font-bold text-gray-700 mb-2">
                          🏦 Bank Transfer Details
                        </p>
                        <p>
                          <strong>Bank:</strong> Nepal Investment Mega Bank
                        </p>
                        <p>
                          <strong>Account Name:</strong> Radhana Enterprises
                        </p>
                        <p>
                          <strong>Account No:</strong> 01234567890123
                        </p>
                        <p>
                          <strong>Reference:</strong> {createdOrder.orderNumber}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      <Link
                        to="/"
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm text-center"
                      >
                        Back to Home
                      </Link>
                      <a
                        href="https://wa.me/9779823939106"
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-comment"></i> WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* ── Right: QR Payment card (inline, no modal) ── */}
              {isPaidMethod && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Coloured header */}
                  <div
                    className={`p-4 flex items-center gap-3 ${isKhalti ? "bg-gradient-to-r from-purple-600 to-purple-800" : "bg-gradient-to-r from-blue-600 to-blue-800"}`}
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                      <img
                        src={isKhalti ? khaltiImg : fonepayImg}
                        alt={isKhalti ? "Khalti" : "FonePay"}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {isKhalti ? "Khalti" : "FonePay"}
                      </h3>
                      <p className="text-white/70 text-xs">
                        Quick &amp; Secure Payment
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-white/70 text-xs">Amount</p>
                      <p className="text-white font-bold text-lg">
                        Rs. {createdOrder.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* QR image */}
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-3 flex flex-col items-center justify-center bg-gray-50 mb-4">
                      {/* 🔁 Replace src with your actual QR image once you have it */}
                      <img
                        src={isKhalti ? khaltiImg : fonepayImg}
                        alt={`${isKhalti ? "Khalti" : "FonePay"} QR Code`}
                        className="w-48 h-48 object-contain rounded-xl"
                      />
                      <p className="text-xs text-orange-500 font-medium mt-2">
                        📌 Replace with your {isKhalti ? "Khalti" : "FonePay"}{" "}
                        QR image
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-3 flex items-center gap-3">
                      <span className="text-orange-500 text-lg">📱</span>
                      <p className="text-sm text-gray-700">
                        Scan with your{" "}
                        <strong className="text-orange-500">
                          {isKhalti ? "Khalti" : "FonePay"}
                        </strong>{" "}
                        app
                      </p>
                    </div>
                    <div className="flex justify-center gap-5 text-xs text-gray-500 mb-4">
                      {["Open App", "Scan QR", "Pay & Confirm"].map((s, i) => (
                        <span
                          key={i}
                          className="flex flex-col items-center gap-1"
                        >
                          <span className="w-6 h-6 rounded-full bg-gray-100 font-bold flex items-center justify-center text-gray-600">
                            {i + 1}
                          </span>
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-center text-xs text-orange-600 font-medium mb-3">
                      🔸 After payment, send us a screenshot on WhatsApp
                    </p>

                    {/* Action buttons */}
                    <a
                      href={`https://wa.me/9779823939106?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm mb-2"
                    >
                      <i className="fas fa-comment"></i> Send Payment Screenshot
                    </a>
                    <Link
                      to="/"
                      className="w-full flex items-center justify-center text-gray-500 hover:text-gray-700 text-sm py-2 transition"
                    >
                      Back to Home →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Main checkout form ────────────────────────────────────
  return (
    <main>
      <section className="bg-gradient-to-r from-purple-50 to-violet-50 py-12 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
      </section>

      <section className="py-12 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ── FORM ── */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Shipping Information
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3">
                  <i className="fas fa-circle-exclamation text-xl text-red-600"></i>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    half
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    half
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                  />
                  {/* Phone with live validation */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="98XXXXXXXX or +97798XXXXXXXX"
                      className={`w-full border-2 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:bg-white transition text-sm ${
                        formData.phone && !validateNepaliPhone(formData.phone)
                          ? "border-red-400 focus:border-red-500"
                          : formData.phone &&
                              validateNepaliPhone(formData.phone)
                            ? "border-green-400 focus:border-green-500"
                            : "border-gray-200 focus:border-blue-600"
                      }`}
                    />
                    {formData.phone && !validateNepaliPhone(formData.phone) && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        ✗ Enter a valid Nepali number — e.g.{" "}
                        <strong>9812345678</strong> or{" "}
                        <strong>+9779812345678</strong>
                      </p>
                    )}
                    {formData.phone && validateNepaliPhone(formData.phone) && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        ✓ Valid Nepali phone number
                      </p>
                    )}
                  </div>
                  <InputField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street / Tole"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    half
                  />
                  <InputField
                    label="Province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    half
                    placeholder="Optional"
                  />
                </div>

                {/* Payment methods */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                          formData.paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-2xl">{method.logo}</span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {method.name}
                          </p>
                          <p className="text-xs text-gray-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i> Place Order — Rs.{" "}
                      {getCartTotal().toLocaleString()}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Order Summary
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => {
                    const productId = item.product?._id || item._id || item.id;
                    const productName = item.product?.name || item.name;
                    const productPrice = item.product?.price || item.price || 0;
                    const quantity = item.quantity || item.qty || 1;

                    // Safely get image URL
                    let image = null;
                    if (
                      item.product?.imageUrls &&
                      Array.isArray(item.product.imageUrls) &&
                      item.product.imageUrls.length > 0
                    ) {
                      image = item.product.imageUrls[0];
                    } else if (
                      item.imageUrls &&
                      Array.isArray(item.imageUrls) &&
                      item.imageUrls.length > 0
                    ) {
                      image = item.imageUrls[0];
                    } else if (item.image) {
                      image = item.image;
                    }

                    return (
                      <div key={productId} className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={productName}
                          className="w-16 h-16 object-cover rounded-xl"
                          onError={(e) =>
                            (e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27100%27 height=%27100%27/%3E%3C/svg%3E")
                          }
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">
                            {productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {quantity}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">
                          Rs. {(productPrice * quantity).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">
                      Rs. {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-300">
                    <span>Total</span>
                    <span className="text-blue-600">
                      Rs. {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-600 flex items-center gap-2 font-medium">
                    <i className="fas fa-lock"></i> Your payment is secure and
                    encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
