import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axios";

/**
 * PaymentVerify — handles return callbacks from both Khalti and Fonepay
 *
 * Khalti returns:  /payment/verify?pidx=...&txnId=...&amount=...&purchase_order_id=...&status=Completed
 * Fonepay returns: /payment/fonepay-verify?PRN=...&BID=...&AMT=...&UID=...&RC=successful&DV=...
 */
const PaymentVerify = ({ gateway = "khalti" }) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'failed'
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        // Retrieve orderId — Khalti passes purchase_order_id, Fonepay passes PRN
        const orderId =
          searchParams.get("purchase_order_id") || // Khalti
          sessionStorage.getItem("pendingOrderId"); // fallback stored at initiation

        if (!orderId)
          throw new Error("Order ID not found. Please contact support.");

        let res;
        if (gateway === "khalti") {
          const pidx = searchParams.get("pidx");
          const kStatus = searchParams.get("status");

          if (kStatus && kStatus !== "Completed") {
            throw new Error(`Payment ${kStatus}. Please try again.`);
          }

          if (!pidx) throw new Error("Payment reference (pidx) missing.");

          res = await axiosInstance.get(`/orders/${orderId}/verify-khalti`, {
            params: { pidx },
          });
        } else {
          // Fonepay — pass all query params to backend
          const params = Object.fromEntries(searchParams.entries());
          res = await axiosInstance.get(`/orders/${orderId}/verify-fonepay`, {
            params,
          });
        }

        setOrder(res.data);
        setStatus("success");
        sessionStorage.removeItem("pendingOrderId");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Payment verification failed.",
        );
        setStatus("failed");
      }
    };

    verify();
  }, []);

  return (
    <main>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin block"></span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Verifying Payment
              </h2>
              <p className="text-gray-500 text-sm">
                Please wait while we confirm your payment with{" "}
                {gateway === "khalti" ? "Khalti" : "FonePay"}...
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Do not close this window
              </p>
            </div>
          )}

          {/* ── Success ── */}
          {status === "success" && order && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-4xl text-green-600"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Successful! 🎉
                </h2>
                <p className="text-gray-500 text-sm">
                  Your order has been confirmed and payment received
                </p>
              </div>

              {/* Order summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Number</span>
                  <span className="font-bold text-gray-800 font-mono text-sm">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="font-bold text-green-700">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    CONFIRMED
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
                <p className="font-semibold mb-1">✅ What happens next?</p>
                <ul className="space-y-1 text-blue-600 text-xs">
                  <li>• Our team will review your design requirements</li>
                  <li>• We'll send you a design preview within 24 hours</li>
                  <li>• Delivery in 2–3 days after approval</li>
                </ul>
              </div>

              <div className="flex gap-3">
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
            </div>
          )}

          {/* ── Failed ── */}
          {status === "failed" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-times text-4xl text-red-600"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {error || "Something went wrong with your payment."}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
                <p className="font-semibold mb-1">💡 What you can do:</p>
                <ul className="space-y-1 text-red-600 text-xs">
                  <li>• Try paying again from your order history</li>
                  <li>• Choose a different payment method</li>
                  <li>• Contact us via WhatsApp for help</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/"
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition text-sm text-center"
                >
                  Back to Home
                </Link>
                <a
                  href="https://wa.me/9779823939106"
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                >
                  <i className="fas fa-comment"></i> Get Help
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PaymentVerify;
