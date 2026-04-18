import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { axiosInstance } from "../utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl mb-4 shadow-lg">
              <span className="text-white text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Radhana Art</h1>
            <p className="text-gray-500 text-sm mt-1">Password Recovery</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* ── Success state ── */}
            {sent ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={44} className="text-green-500" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Check Your Email!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We've sent a password reset link to <br />
                  <strong className="text-gray-800">{email}</strong>
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left space-y-2">
                  <p className="text-sm text-blue-700 font-semibold">
                    What to do next:
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>📧 Open your email inbox</li>
                    <li>
                      🔍 Look for an email from{" "}
                      <strong>noreply@radhanaenterprises.com.np</strong>
                    </li>
                    <li>🔗 Click the reset link inside</li>
                    <li>
                      ⏰ The link expires in <strong>1 hour</strong>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-gray-400">
                  Didn't receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Forgot your password?
                  </h2>
                  <p className="text-gray-500 text-sm">
                    No worries! Enter your email and we'll send you a reset
                    link.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition font-medium"
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="https://wa.me/9779823939106"
                className="text-green-600 font-bold hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
