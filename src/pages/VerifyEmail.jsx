import React, { useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [timeRemaining, setTimeRemaining] = useState(60);
  const [status, setStatus] = useState("waiting"); // waiting | verified | expired | error
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, token]);

  // Check verification status every 2 seconds
  useEffect(() => {
    if (!email || !token || status !== "waiting" || timeRemaining <= 0) return;

    const checkVerification = async () => {
      try {
        const res = await axiosInstance.get(
          `/auth/check-verification?email=${encodeURIComponent(email)}`
        );

        if (res.data.verified) {
          setStatus("verified");
          // Verify email and log in
          setLoading(true);
          try {
            await axiosInstance.post("/auth/verify-email", { token, email });
            // Redirect to home after short delay to show success
            setTimeout(() => navigate("/"), 1500);
          } catch (err) {
            setStatus("error");
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Verification check error:", err);
      }
    };

    const interval = setInterval(checkVerification, 2000);
    return () => clearInterval(interval);
  }, [email, token, status, timeRemaining, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Status Icon */}
        {status === "waiting" && (
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <Mail className="w-20 h-20 text-blue-500 animate-bounce" />
              <Clock className="w-6 h-6 absolute bottom-0 right-0 text-orange-500 animate-spin" />
            </div>
          </div>
        )}

        {status === "verified" && (
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 animate-pulse" />
          </div>
        )}

        {(status === "expired" || status === "error") && (
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-20 h-20 text-red-500" />
          </div>
        )}

        {/* Content */}
        {status === "waiting" && (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verify Your Email
            </h1>
            <p className="text-center text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-center text-blue-700 font-semibold">
                ⏱️ Time remaining: {timeRemaining}s
              </p>
            </div>

            <p className="text-center text-gray-600 text-sm">
              Waiting for email verification... Please click the link in your
              email.
            </p>

            {/* Manual verify button */}
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  await axiosInstance.post("/auth/verify-email", {
                    token,
                    email,
                  });
                  setStatus("verified");
                  setTimeout(() => navigate("/"), 1500);
                } catch (err) {
                  setStatus("error");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Already Verified?"}
            </button>
          </>
        )}

        {status === "verified" && (
          <>
            <h1 className="text-2xl font-bold text-center text-green-600 mb-2">
              Email Verified!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Your account has been successfully created and verified.
            </p>
            <p className="text-center text-gray-500 text-sm">
              Redirecting to home page...
            </p>
          </>
        )}

        {status === "expired" && (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600 mb-2">
              Link Expired
            </h1>
            <p className="text-center text-gray-600 mb-6">
              The verification link has expired. Please try logging in again.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Back to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-center text-gray-600 mb-6">
              An error occurred during verification. Please try again.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
