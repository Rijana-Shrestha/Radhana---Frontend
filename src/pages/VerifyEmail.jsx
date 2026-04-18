import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUserProfile } = useContext(AuthContext);

  const [status, setStatus] = useState("loading"); // loading | success | failed | already
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const verify = async () => {
      if (!token || !userId) {
        setError("Invalid verification link. Please request a new one.");
        setStatus("failed");
        return;
      }
      try {
        const res = await axiosInstance.get("/auth/verify-email", {
          params: { token, userId },
        });
        setUserName(res.data.name);
        // Fetch profile so AuthContext knows user is now logged in
        await fetchUserProfile();
        setStatus("success");
        // Auto-redirect to home after 3 seconds
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        const msg = err.response?.data?.message || "";
        if (msg.includes("already verified")) {
          setStatus("already");
        } else {
          setError(msg || "Verification failed. The link may have expired.");
          setStatus("failed");
        }
      }
    };
    verify();
  }, []);

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl mb-3 shadow-lg">
              <span className="text-white text-2xl">🪷</span>
            </div>
            <p className="text-gray-500 text-sm">
              Radhana Art — Email Verification
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 text-center">
            {/* ── Loading ── */}
            {status === "loading" && (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin block"></span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Verifying your email...
                </h2>
                <p className="text-gray-500 text-sm">
                  Please wait, do not close this window.
                </p>
              </>
            )}

            {/* ── Success ── */}
            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={44} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Email Verified! 🎉
                </h2>
                <p className="text-gray-600 text-sm mb-1">
                  Welcome to Radhana Art{userName ? `, ${userName}` : ""}!
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Your account is now active. You're being logged in
                  automatically.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6">
                  <p className="text-sm text-blue-600">
                    Redirecting to home in 3 seconds...
                  </p>
                </div>
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  Go to Home Now
                </Link>
              </>
            )}

            {/* ── Already verified ── */}
            {status === "already" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={44} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Already Verified
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Your email has already been verified. You can log in to your
                  account.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  Go to Login
                </Link>
              </>
            )}

            {/* ── Failed ── */}
            {status === "failed" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={44} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  {error || "This verification link is invalid or has expired."}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-sm text-amber-700 mb-6">
                  <p className="font-semibold mb-1">💡 What to do:</p>
                  <ul className="space-y-1 text-amber-600 text-xs">
                    <li>• Try registering again — a new link will be sent</li>
                    <li>• Or use the resend option on the register page</li>
                    <li>• Verification links expire after 24 hours</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/register"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Mail size={15} /> Register Again
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-sm"
                  >
                    Go to Login
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

export default VerifyEmail;
