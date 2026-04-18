import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email not verified state
  const [notVerifiedEmail, setNotVerifiedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState("");

  const { fetchUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Message passed from ProtectedCheckoutRoute
  const redirectMessage = location.state?.message || "";
  // Where to go after login (default: home)
  const redirectTo = location.state?.from?.pathname || "/";

  // Resend cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
    setNotVerifiedEmail("");
    setResendMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setNotVerifiedEmail("");
    try {
      const res = await loginUser(formData.email, formData.password);
      if (res?.twoFactorRequired) {
        setPendingUserId(res.userId);
        setTwoFactorStep(true);
        setResendCooldown(60);
      } else if (res?.pending_verification) {
        // Redirect to email verification page
        navigate(
          `/verify-email?email=${encodeURIComponent(formData.email)}&token=${encodeURIComponent(res.token || "")}`
        );
      } else {
        navigate("/");
      }
    } catch (err) {
      const data = err.response?.data || {};
      if (data.emailNotVerified) {
        setNotVerifiedEmail(data.email || formData.email);
        setError("Please verify your email before logging in.");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !notVerifiedEmail) return;
    try {
      await axiosInstance.post("/auth/resend-verification", {
        email: notVerifiedEmail,
      });
      setResendMsg("Verification email resent! Check your inbox.");
      setResendCooldown(60);
    } catch {
      setResendMsg("Failed to resend. Please try again.");
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
            <p className="text-gray-500 text-sm mt-1">
              Welcome back to your account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Checkout redirect message */}
              {redirectMessage && !error && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm flex items-center gap-2">
                  🛒 {redirectMessage}
                </div>
              )}

              {/* Error / not verified */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  <p>⚠️ {error}</p>
                  {notVerifiedEmail && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendCooldown > 0}
                        className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 text-xs"
                      >
                        {resendCooldown > 0
                          ? `Resend verification email in ${resendCooldown}s`
                          : "→ Click here to resend verification email"}
                      </button>
                      {resendMsg && (
                        <p
                          className={`text-xs mt-1 ${resendMsg.includes("resent") ? "text-green-600" : "text-red-500"}`}
                        >
                          {resendMsg}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-bold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="https://wa.me/9779823939106"
                className="text-green-600 font-bold hover:underline"
              >
                Chat on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
