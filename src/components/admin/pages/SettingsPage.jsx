import React, { useContext, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { axiosInstance } from "../../../utils/axios";
import { Link, useNavigate } from "react-router-dom";

/* ── tiny inline toast ── */
const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium mb-4 ${isSuccess ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
    >
      {isSuccess ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {msg}
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
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : "bg-gray-200"}`}
          />
        ))}
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
const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
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
          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ── change-password form state ── */
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwToast, setPwToast] = useState({ msg: "", type: "" });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePwChange = (e) => {
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
        msg: "New password must be at least 6 characters.",
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

  if (!user)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading profile information...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Settings
          </h1>
          <p className="text-gray-600">
            Manage your admin profile and preferences
          </p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          View Store
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-16 mb-8">
            <div className="flex items-end gap-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg border-4 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow-lg">
                  <User size={64} className="text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    👑 Admin
                  </span>
                  {user.roles?.includes("ADMIN") && (
                    <span className="text-xs text-purple-600 font-semibold">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Mail size={20} className="text-blue-600" />,
                label: "Email Address",
                value: user.email,
                bg: "from-blue-50 to-blue-100 border-blue-200",
              },
              {
                icon: <Phone size={20} className="text-green-600" />,
                label: "Phone Number",
                value: user.phone,
                bg: "from-green-50 to-green-100 border-green-200",
              },
              {
                icon: <MapPin size={20} className="text-purple-600" />,
                label: "City",
                value: user.address?.city || "Not specified",
                bg: "from-purple-50 to-purple-100 border-purple-200",
              },
              {
                icon: <MapPin size={20} className="text-pink-600" />,
                label: "Street Address",
                value: user.address?.street || "Not specified",
                bg: "from-pink-50 to-pink-100 border-pink-200",
              },
              {
                icon: <MapPin size={20} className="text-orange-600" />,
                label: "Province",
                value: user.address?.province || "Not specified",
                bg: "from-orange-50 to-orange-100 border-orange-200",
              },
              {
                icon: <MapPin size={20} className="text-cyan-600" />,
                label: "Country",
                value: user.address?.country || "Nepal",
                bg: "from-cyan-50 to-cyan-100 border-cyan-200",
              },
            ].map(({ icon, label, value, bg }) => (
              <div
                key={label}
                className={`bg-gradient-to-br ${bg} p-5 rounded-lg border`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {icon}
                  <h3 className="font-semibold text-gray-700">{label}</h3>
                </div>
                <p className="text-gray-800 ml-8 break-all">{value}</p>
              </div>
            ))}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-indigo-600" />
                <h3 className="font-semibold text-gray-700">
                  Administrator Since
                </h3>
              </div>
              <p className="text-gray-800 ml-8">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-300 font-semibold mb-2">ADMIN ID</p>
            <p className="text-gray-100 font-mono text-sm break-all">
              {user._id}
            </p>
          </div>
        </div>
      </div>

      {/* ══ CHANGE PASSWORD CARD ══ */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
            <p className="text-sm text-gray-500">
              Update your admin account password
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePwSubmit}
          className="px-6 py-6 space-y-4 max-w-lg"
        >
          <Toast msg={pwToast.msg} type={pwToast.type} />

          <PasswordInput
            label="Current Password *"
            name="currentPassword"
            value={pwForm.currentPassword}
            onChange={handlePwChange}
            placeholder="Enter your current password"
            required
          />

          <PasswordInput
            label="New Password *"
            name="newPassword"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            placeholder="Enter new password"
            required
          />

          {/* strength meter shown as user types new password */}
          <PasswordStrength password={pwForm.newPassword} />

          <PasswordInput
            label="Confirm New Password *"
            name="confirmPassword"
            value={pwForm.confirmPassword}
            onChange={handlePwChange}
            placeholder="Re-enter new password"
            required
          />

          {/* Match indicator */}
          {pwForm.confirmPassword && (
            <p
              className={`text-xs flex items-center gap-1 ${pwForm.newPassword === pwForm.confirmPassword ? "text-green-600" : "text-red-500"}`}
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

          <button
            type="submit"
            disabled={pwLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pwLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                Updating...
              </>
            ) : (
              <>
                <Lock size={16} /> Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Other settings placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "🔔",
            title: "Notifications",
            items: ["Email notifications", "Order alerts", "System updates"],
          },
          {
            icon: "⚙️",
            title: "System",
            items: ["Theme preference", "Language settings", "Timezone"],
          },
          {
            icon: "💳",
            title: "Billing",
            items: [
              "Subscription status",
              "Invoice history",
              "License information",
            ],
          },
        ].map(({ icon, title, items }) => (
          <div key={title} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {icon} {title}
            </h3>
            <div className="space-y-3">
              {items.map((i) => (
                <p key={i} className="text-sm text-gray-400">
                  {i} — coming soon
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-700 mb-4">⚠️ Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">
          These actions cannot be undone
        </p>
        <button
          disabled
          className="bg-red-600 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-50"
        >
          Delete Admin Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
