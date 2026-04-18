import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Phone,
  User,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

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

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
    { label: "Contains symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const barColors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const textColors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-600",
    "text-green-600",
  ];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score - 1] : "bg-gray-200"}`}
            />
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-bold ${textColors[score - 1]}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {checks.map((c) => (
          <p
            key={c.label}
            className={`text-xs flex items-center gap-1 ${c.pass ? "text-green-600" : "text-gray-400"}`}
          >
            {c.pass ? <CheckCircle size={11} /> : <XCircle size={11} />}{" "}
            {c.label}
          </p>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
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
  // After submit: show "check your email" screen with the email they used
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };
  const validateNepaliPhone = (phone) => {
    const c = phone.replace(/[\s\-]/g, "");
    return /^(\+977|977)?(98|97|96)\d{8}$/.test(c);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validateNepaliPhone(formData.phone)) {
      setError("Please enter a valid Nepali phone number (e.g. 9812345678).");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/register", formData);
      setVerifyEmail(formData.email);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Check your email screen ──
  if (verifyEmail) {
    return (
      <main>
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Check Your Email!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                We sent a verification link to:
              </p>
              <p className="font-bold text-blue-600 mb-6 break-all">
                {verifyEmail}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Click the link in the email to verify your account and log in.
                The link expires in <strong>24 hours</strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6">
                💡 Don't see it? Check your <strong>spam/junk</strong> folder.
              </div>
              <ResendButton email={verifyEmail} />
              <p className="text-center text-gray-400 text-xs mt-6">
                Wrong email?{" "}
                <button
                  onClick={() => setVerifyEmail("")}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Go back
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX or 98XXXXXXXX"
                    required
                    className={`w-full border-2 bg-gray-50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:bg-white transition text-sm ${
                      formData.phone && !validateNepaliPhone(formData.phone)
                        ? "border-red-400 focus:border-red-500"
                        : formData.phone && validateNepaliPhone(formData.phone)
                          ? "border-green-400 focus:border-green-500"
                          : "border-gray-200 focus:border-blue-600"
                    }`}
                  />
                </div>
                {formData.phone && !validateNepaliPhone(formData.phone) && (
                  <p className="text-xs text-red-500 mt-1">
                    ✗ Enter a valid Nepali number e.g.{" "}
                    <strong>9812345678</strong>
                  </p>
                )}
                {formData.phone && validateNepaliPhone(formData.phone) && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Valid Nepali phone number
                  </p>
                )}
              </div>

              <div>
                <PwField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                />
                <PasswordStrength password={formData.password} />
              </div>

              <div>
                <PwField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
                {formData.confirmPassword && (
                  <p
                    className={`text-xs font-medium flex items-center gap-1 mt-2 ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"}`}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle size={11} /> Passwords match
                      </>
                    ) : (
                      <>
                        <XCircle size={11} /> Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

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

// Resend verification email button
const ResendButton = ({ email }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resend = async () => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <p className="text-green-600 text-sm font-semibold">
        ✅ Verification email resent!
      </p>
    );
  return (
    <div>
      <button
        onClick={resend}
        disabled={loading}
        className="w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition text-sm disabled:opacity-60"
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default Register;
