<<<<<<< HEAD
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { axiosInstance } from '../utils/axios'
=======
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Shield, RefreshCw } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";

// ── OTP digit input ───────────────────────────────────────────
const OTPInput = ({ otp, setOtp }) => {
  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = [...otp];
      next[i] = "";
      setOtp(next);
      if (i > 0) refs[i - 1].current?.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = [...otp];
    next[i] = e.key;
    setOtp(next);
    if (i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (digits.length === 6) {
      setOtp(digits);
      refs[5].current?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onKeyDown={(e) => handleKey(e, i)}
          onChange={() => {}}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition bg-gray-50 border-gray-200"
        />
      ))}
    </div>
  );
};
>>>>>>> a8fe4d29782d299b5c870cc7c64157cfbdfd0b71

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2FA state
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { loginUser, fetchUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  // Step 1: email + password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(formData.email, formData.password);
      if (res?.twoFactorRequired) {
        setPendingUserId(res.userId);
        setTwoFactorStep(true);
        setResendCooldown(60);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      await axiosInstance.post("/auth/verify-2fa", {
        userId: pendingUserId,
        code,
      });
      await fetchUserProfile();
      navigate("/");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid or expired OTP.");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP by re-triggering login
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      await axiosInstance.post("/auth/login", formData);
      setResendCooldown(60);
    } catch (err) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <main>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">🪷</span>
            </div>
<<<<<<< HEAD
            <h1 className='text-2xl font-bold text-gray-800'>Radhana Art</h1>
            <p className='text-gray-600 text-sm mt-1'>Welcome back to your account</p>
          </div>

          {/* Login Card */}
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Error Message */}
              {error && (
                <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Email Address</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='you@example.com'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Password */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-bold text-gray-800'>Password</label>
                  <Link to='#' className='text-sm text-blue-600 hover:underline'>
                    Forgot?
                  </Link>
                </div>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='••••••••'
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition pr-12'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <i className='fas fa-eye-slash text-xl'></i> : <i className='fas fa-eye text-xl'></i>}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 rounded border-gray-300'
                />
                <span className='text-sm text-gray-600'>Remember me for 30 days</span>
              </label>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                <i className='fas fa-sign-in-alt'></i>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className='my-6 flex items-center gap-3'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='text-sm text-gray-500'>Or continue with</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>

            {/* Social Login */}
            <button onClick={()=> window.location.href = "https://radhana-art.onrender.com/api/auth/google"} className='w-full border-2 border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition font-medium text-gray-700 flex items-center justify-center gap-2'>
              <i className='fab fa-google text-lg text-red-600'></i> Google
            </button>

            {/* Sign Up Link */}
            <p className='text-center text-gray-600 text-sm mt-6'>
              Don't have an account?{' '}
              <Link to='/register' className='text-blue-600 font-bold hover:underline'>
                Create one
              </Link>
=======
            <h1 className="text-2xl font-bold text-gray-800">Radhana Art</h1>
            <p className="text-gray-500 text-sm mt-1">
              {twoFactorStep
                ? "Two-Factor Authentication"
                : "Welcome back to your account"}
>>>>>>> a8fe4d29782d299b5c870cc7c64157cfbdfd0b71
            </p>
          </div>

          {/* ── STEP 1: Email + Password ── */}
          {!twoFactorStep && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
                  />
                </div>

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
          )}

          {/* ── STEP 2: 2FA OTP ── */}
          {twoFactorStep && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Shield icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Shield size={36} className="text-blue-600" />
                </div>
              </div>

              <h2 className="text-center text-xl font-bold text-gray-800 mb-2">
                Check your email
              </h2>
              <p className="text-center text-sm text-gray-500 mb-7">
                We sent a 6-digit code to{" "}
                <strong className="text-gray-700">{formData.email}</strong>.
                <br />
                Enter it below to complete your login.
              </p>

              <form onSubmit={handleOTPSubmit} className="space-y-5">
                {otpError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                    ⚠️ {otpError}
                  </div>
                )}

                <OTPInput otp={otp} setOtp={setOtp} />

                <button
                  type="submit"
                  disabled={otpLoading || otp.join("").length < 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                >
                  {otpLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield size={18} /> Verify & Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-5">
                <p className="text-sm text-gray-500 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="flex items-center gap-1.5 mx-auto text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                >
                  <RefreshCw
                    size={14}
                    className={resendCooldown > 0 ? "" : ""}
                  />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </button>
              </div>

              {/* Back */}
              <button
                onClick={() => {
                  setTwoFactorStep(false);
                  setOtp(["", "", "", "", "", ""]);
                  setOtpError("");
                }}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition text-center"
              >
                ← Back to login
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="https://wa.me/9779823939106"
                className="text-green-600 font-bold hover:underline"
              >
                Chat with us
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
