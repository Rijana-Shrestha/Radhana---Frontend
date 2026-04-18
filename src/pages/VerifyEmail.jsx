import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const { fetchUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");

      if (!token || !userId) {
        setStatus("error");
        setMessage("Invalid verification link. Please register again.");
        return;
      }

      try {
        // Backend verifies token, marks user verified, sets auth cookie, returns user
        await axiosInstance.get("/auth/verify-email", {
          params: { token, userId },
        });
        // Fetch profile to update AuthContext (user is now logged in)
        await fetchUserProfile();
        setStatus("success");
        // Redirect to home after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. Please try again.",
        );
      }
    };

    verify();
  }, []);

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl mb-6 shadow-lg">
              <span className="text-white text-2xl">🪷</span>
            </div>

            {/* Loading */}
            {status === "loading" && (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader size={40} className="text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verifying your email...
                </h2>
                <p className="text-gray-500 text-sm">Please wait a moment.</p>
              </>
            )}

            {/* Success */}
            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Email Verified! 🎉
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Your account is now active. Redirecting you to the home
                  page...
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-1.5 rounded-full animate-[width_2s_ease-in-out]"
                    style={{ width: "100%", transition: "width 2s" }}
                  />
                </div>
              </>
            )}

            {/* Error */}
            {status === "error" && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-500 text-sm mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    to="/register"
                    className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
                  >
                    Register Again
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-sm"
                  >
                    Back to Login
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
