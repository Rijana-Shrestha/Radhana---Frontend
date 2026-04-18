import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { axiosInstance } from "../utils/axios";

/* ── password strength indicator ── */
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
    { label: "Contains symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`}
            />
          ))}
        </div>
        {score > 0 && (
          <span className="text-xs font-semibold text-gray-500">
            {labels[score - 1]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map((c) => (
          <p
            key={c.label}
            className={`text-xs flex items-center gap-1 ${c.pass ? "text-green-600" : "text-gray-400"}`}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </p>
        ))}
      </div>
    </div>
  );
};

/* ── password input with show/hide ── */
const PwInput = ({ label, value, onChange, placeholder, name }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Guard — if no token/userId in URL, show invalid state immediately
  const isValidLink = token && userId;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(
        `/auth/reset-password?token=${token}&userId=${userId}`,
        { password: form.password, confirmPassword: form.confirmPassword },
      );
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. The link may have expired.",
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
            <p className="text-gray-500 text-sm mt-1">Set New Password</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* ── Invalid link ── */}
            {!isValidLink && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle size={44} className="text-red-500" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Invalid Reset Link
                </h2>
                <p className="text-gray-500 text-sm">
                  This password reset link is invalid or has expired.
                  <br />
                  Please request a new one.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  Request New Link
                </Link>
              </div>
            )}

            {/* ── Success state ── */}
            {isValidLink && success && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck size={44} className="text-green-500" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Password Reset!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Your password has been changed successfully.
                  <br />
                  You'll receive a confirmation email shortly.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-sm text-blue-600">
                    Redirecting to login in 3 seconds...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  Go to Login Now
                </Link>
              </div>
            )}

            {/* ── Form state ── */}
            {isValidLink && !success && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Create New Password
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Choose a strong password you haven't used before.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <PwInput
                    label="New Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <PasswordStrength password={form.password} />

                  <PwInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                  />

                  {/* Match indicator */}
                  {form.confirmPassword && (
                    <p
                      className={`text-xs flex items-center gap-1 font-medium ${form.password === form.confirmPassword ? "text-green-600" : "text-red-500"}`}
                    >
                      {form.password === form.confirmPassword ? (
                        <>
                          <CheckCircle size={13} /> Passwords match
                        </>
                      ) : (
                        <>
                          <XCircle size={13} /> Passwords do not match
                        </>
                      )}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      form.password !== form.confirmPassword ||
                      form.password.length < 6
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Lock size={16} /> Reset Password
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
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
