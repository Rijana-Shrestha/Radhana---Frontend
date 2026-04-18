import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { useCart } from "../context/CartContext";

const PaymentVerify = ({ gateway = "khalti" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get("pidx");
        const transactionId = searchParams.get("transaction_id");
        const status = searchParams.get("status");

        if (!pidx && !transactionId) {
          throw new Error("Invalid payment verification parameters");
        }

        // Call backend verification endpoint
        const response = await axiosInstance.post(`/payments/verify-${gateway}`, {
          pidx,
          transactionId,
          status,
        });

        if (response.data && response.data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          setOrderId(response.data.orderId);
          clearCart();

          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(response.data?.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage(
          error.response?.data?.message ||
            error.message ||
            "Payment verification failed"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clearCart, gateway]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 animate-pulse">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Verifying Payment
          </h1>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <i className="fas fa-check text-6xl text-green-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-2">Your payment has been verified.</p>
          <p className="text-gray-500 text-sm mb-8">
            Thank you for your purchase! You will be redirected shortly.
          </p>

          {orderId && (
            <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-2">Order ID</p>
              <p className="text-2xl font-bold text-gray-800 font-mono break-all">
                {orderId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full inline-block bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Back to Home
            </Link>
            <a
              href="https://wa.me/9779823939106"
              className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 py-3 rounded-lg font-bold hover:bg-green-50 transition"
            >
              <i className="fas fa-comment"></i>
              Contact Support
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <i className="fas fa-times text-6xl text-red-600"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-gray-500 text-sm mb-8">
          If you were charged, please contact our support team with your
          transaction ID.
        </p>

        <div className="space-y-3">
          <Link
            to="/checkout"
            className="w-full inline-block bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Try Again
          </Link>
          <a
            href="https://wa.me/9779823939106"
            className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition"
          >
            <i className="fas fa-comment"></i>
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
};

export default PaymentVerify;
