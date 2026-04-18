import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Phone, User, Lock } from "lucide-react";
import { axiosInstance } from "../utils/axios";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  required,
}) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border-2 border-gray-200 bg-gray-50 rounded-xl py-3 pr-4 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm ${Icon ? "pl-11" : "pl-4"}`}
      />
    </div>
  </div>
);

const PwField = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
          className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:border-blue-600 focus:bg-white transition text-sm"
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false); // show "check email" screen
  const [sentEmail, setSentEmail] = useState("");

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      setSentEmail(res.data.email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Check your email screen ───────────────────────────────
  if (sent) {
    return (
      <main>
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 text-center">
              {/* Email icon */}
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={48} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Check Your Email!
              </h2>
              <p className="text-gray-500 text-sm mb-1">
                We've sent a verification link to
              </p>
              <p className="font-bold text-blue-600 text-sm mb-6 break-all">
                {sentEmail}
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left space-y-2 mb-6">
                <p className="text-sm font-semibold text-blue-700 mb-2">
                  What to do next:
                </p>
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <span>📧</span> Open your email inbox
                </p>
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <span>🔍</span> Look for an email from{" "}
                  <strong>noreply@radhanaenterprises.com.np</strong>
                </p>
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <span>✅</span> Click <strong>"Verify My Email"</strong> in
                  the email
                </p>
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <span>🎉</span> You'll be logged in automatically!
                </p>
              </div>

              <p className="text-xs text-gray-400 mb-5">
                Didn't receive it? Check your <strong>spam folder</strong>, or
              </p>

              <ResendButton email={sentEmail} />

              <Link
                to="/login"
                className="block mt-5 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Registration form ─────────────────────────────────────
  return (
    <main>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl mb-4 shadow-lg">
              <span className="text-white text-2xl">🪷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Join Radhana Art for exclusive deals
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                icon={User}
                required
              />
              <InputField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={Mail}
                required
                type="email"
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+977 98xxxxxxxx"
                icon={Phone}
                required
                type="tel"
              />
              <PwField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
              />
              <PwField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />

              {/* Match indicator — simple, no strength meter */}
              {formData.confirmPassword && (
                <p
                  className={`text-xs font-medium flex items-center gap-1 ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"}`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 mt-0.5 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} /> Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

// Resend button with 60s cooldown
const ResendButton = ({ email }) => {
  const [cooldown, setCooldown] = useState(0);
  const [msg, setMsg] = useState("");

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    if (cooldown > 0) return;
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      setMsg("Email resent! Check your inbox.");
      setCooldown(60);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to resend. Try again.");
    }
  };

  return (
    <div>
      <button
        onClick={resend}
        disabled={cooldown > 0}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
      </button>
      {msg && <p className="text-xs text-green-600 mt-2">{msg}</p>}
    </div>
  );
};

export default Register;
