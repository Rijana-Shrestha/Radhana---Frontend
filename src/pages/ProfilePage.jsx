import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  LogOut,
  Settings,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";

/* ── 2FA Toggle Card ── */
const TwoFactorToggle = ({ user }) => {
  const { fetchUserProfile } = useContext(AuthContext);
  const [enabled, setEnabled] = useState(user?.twoFactorEnabled || false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const toggle = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await axiosInstance.patch("/auth/toggle-2fa", {
        enable: !enabled,
      });
      setEnabled(res.data.twoFactorEnabled);
      setMsg({
        text: `Two-factor authentication ${res.data.twoFactorEnabled ? "enabled" : "disabled"}.`,
        type: "success",
      });
      await fetchUserProfile();
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || "Failed to update 2FA.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Two-Factor Authentication
          </h3>
          <p className="text-xs text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm text-gray-500 mb-4">
          When enabled, you'll receive a <strong>6-digit OTP</strong> to your
          email every time you sign in. This keeps your account safe even if
          your password is compromised.
        </p>
        {msg.text && (
          <p
            className={`text-xs mb-4 flex items-center gap-1.5 font-medium ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}
          >
            {msg.type === "success" ? (
              <CheckCircle size={13} />
            ) : (
              <XCircle size={13} />
            )}
            {msg.text}
          </p>
        )}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {enabled ? "🟢 Currently Enabled" : "⚪ Currently Disabled"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {enabled
                ? "OTP required on every login"
                : "Login with password only"}
            </p>
          </div>
          <button
            onClick={toggle}
            disabled={loading}
            title={enabled ? "Disable 2FA" : "Enable 2FA"}
            className={`relative inline-flex h-7 w-13 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${enabled ? "bg-blue-600" : "bg-gray-300"} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── inline toast ── */
const Toast = ({ msg, type, onDismiss }) => {
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-5 ${ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
    >
      <span className="flex items-center gap-2">
        {ok ? <CheckCircle size={16} /> : <XCircle size={16} />} {msg}
      </span>
      <button
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

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
        <span
          className={`text-xs font-semibold ${score > 0 ? colors[score - 1].replace("bg-", "text-").replace("-400", "").replace("-500", "") : "text-gray-400"}`}
        >
          {score > 0 ? labels[score - 1] : ""}
        </span>
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

/* ── password input with show/hide toggle ── */
const PwInput = ({ label, name, value, onChange, placeholder, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ── change-password state ── */
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwToast, setPwToast] = useState({ msg: "", type: "" });

  if (!isLoggedIn || !user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Not Logged In
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const isAdmin = user?.roles?.includes("ADMIN");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePwInput = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPwToast({ msg: "", type: "" });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwToast({ msg: "New passwords do not match.", type: "error" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwToast({
        msg: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    setPwLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/users/${user._id}/change-password`,
        pwForm,
      );
      setPwToast({
        msg: res.data.message || "Password changed successfully!",
        type: "success",
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwToast({
        msg: err.response?.data?.message || "Failed to change password.",
        type: "error",
      });
    } finally {
      setPwLoading(false);
    }
  };

  const infoItems = [
    {
      icon: <Mail size={18} className="text-blue-500" />,
      label: "Email",
      value: user.email,
    },
    {
      icon: <Phone size={18} className="text-blue-500" />,
      label: "Phone",
      value: user.phone,
    },
    {
      icon: <MapPin size={18} className="text-blue-500" />,
      label: "City",
      value: user.address?.city || "Not specified",
    },
    {
      icon: <MapPin size={18} className="text-blue-500" />,
      label: "Street",
      value: user.address?.street || "Not specified",
    },
    {
      icon: <MapPin size={18} className="text-blue-500" />,
      label: "Province",
      value: user.address?.province || "Not specified",
    },
    {
      icon: <MapPin size={18} className="text-blue-500" />,
      label: "Country",
      value: user.address?.country || "Nepal",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-1">My Profile</h1>
          <p className="text-gray-500">
            View and manage your account information
          </p>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-pink-500 h-32"></div>
          <div className="px-6 md:px-8 pb-8">
            {/* Avatar + actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-16 mb-8">
              <div className="flex items-end gap-4">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg">
                    <User size={64} className="text-gray-400" />
                  </div>
                )}
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {isAdmin ? "👑 Admin" : "👤 User"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto flex-wrap">
                {!isAdmin && (
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => navigate("/settings")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition text-sm font-semibold"
                  >
                    <Settings size={16} /> Admin Settings
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition text-sm font-semibold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {infoItems.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 p-4 rounded-xl flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    {icon} {label}
                  </div>
                  <p className="text-gray-800 text-sm pl-6 break-all">
                    {value}
                  </p>
                </div>
              ))}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <Calendar size={18} className="text-blue-500" /> Member Since
                </div>
                <p className="text-gray-800 text-sm pl-6">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-xs text-blue-500 font-semibold mb-1">
                USER ID
              </p>
              <p className="text-blue-700 font-mono text-xs break-all">
                {user._id}
              </p>
            </div>
          </div>
        </div>

        {/* ── Change Password Card ── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card header — clickable to expand/collapse */}
          <button
            onClick={() => {
              setPwOpen((o) => !o);
              setPwToast({ msg: "", type: "" });
            }}
            className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-gray-800">
                  Change Password
                </h3>
                <p className="text-xs text-gray-500">
                  Update your account password securely
                </p>
              </div>
            </div>
            <span
              className={`text-gray-400 transition-transform duration-300 ${pwOpen ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {/* Collapsible form */}
          {pwOpen && (
            <form
              onSubmit={handlePwSubmit}
              className="px-6 py-6 space-y-4 max-w-md"
            >
              <Toast
                msg={pwToast.msg}
                type={pwToast.type}
                onDismiss={() => setPwToast({ msg: "", type: "" })}
              />

              <PwInput
                label="Current Password *"
                name="currentPassword"
                value={pwForm.currentPassword}
                onChange={handlePwInput}
                placeholder="Enter your current password"
                required
              />

              <PwInput
                label="New Password *"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwInput}
                placeholder="Enter new password (min. 6 chars)"
                required
              />
              <PasswordStrength password={pwForm.newPassword} />

              <PwInput
                label="Confirm New Password *"
                name="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={handlePwInput}
                placeholder="Re-enter your new password"
                required
              />

              {/* Match indicator */}
              {pwForm.confirmPassword && (
                <p
                  className={`text-xs flex items-center gap-1 font-medium ${pwForm.newPassword === pwForm.confirmPassword ? "text-green-600" : "text-red-500"}`}
                >
                  {pwForm.newPassword === pwForm.confirmPassword ? (
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

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pwLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Update Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPwOpen(false);
                    setPwForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPwToast({ msg: "", type: "" });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── 2FA Toggle Card ── */}
        <TwoFactorToggle user={user} />
      </div>
    </main>
  );
};

export default ProfilePage;
