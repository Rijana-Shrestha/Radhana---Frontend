/**
 * FonepayQRModal.jsx
 *
 * PLACEMENT: src/components/FonepayQRModal.jsx
 *
 * Full Fonepay Intent / Dynamic QR payment modal.
 * Matches the Khopne-style UI from the screenshot:
 *   - Fonepay logo header
 *   - Dynamic QR rendered from qrMessage string
 *   - Amount display
 *   - 5-minute countdown timer
 *   - Steps checklist
 *   - "Check Payment" button (polls /verify then /status)
 *   - WebSocket listener for real-time auto-confirmation
 *
 * INSTALL qrcode.react before using:
 *   npm install qrcode.react
 *
 * USAGE in Checkout.jsx:
 *   import FonepayQRModal from "../components/FonepayQRModal";
 *
 *   {showFonepayQR && (
 *     <FonepayQRModal
 *       orderId={createdOrder._id}
 *       orderNumber={createdOrder.orderNumber}
 *       amount={createdOrder.totalPrice}
 *       onSuccess={(result) => { setStep("paid"); }}
 *       onClose={() => setShowFonepayQR(false)}
 *     />
 *   )}
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { axiosInstance } from "../utils/axios";
import fonepayLogo from "../../Assets/fonepay.jpeg";

// QR expires after 5 minutes (300 seconds) per Fonepay standard
const QR_EXPIRY_SECONDS = 300;

// Poll interval when WebSocket is not available (ms)
const POLL_INTERVAL_MS = 10000;

// ── Helper: format MM:SS ─────────────────────────────────────────────────────
const formatTime = (secs) => {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ── Main Component ───────────────────────────────────────────────────────────
const FonepayQRModal = ({
  orderId,
  orderNumber,
  amount,
  onSuccess,
  onClose,
}) => {
  // ── State ──
  const [phase, setPhase] = useState("loading"); // loading | ready | checking | success | failed | expired
  const [qrData, setQrData] = useState(null); // { qrMessage, websocketId, referenceLabel, prn }
  const [timeLeft, setTimeLeft] = useState(QR_EXPIRY_SECONDS);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // ── Refs (don't cause re-renders) ──
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const verifiedRef = useRef(false); // prevent double-finalize

  // ── 1. Initiate QR on mount ──────────────────────────────────────────────
  const initiateQR = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const res = await axiosInstance.post(
        `/fonepay-intent/initiate/${orderId}`,
      );
      setQrData(res.data);
      setTimeLeft(QR_EXPIRY_SECONDS);
      setPhase("ready");
    } catch (e) {
      setError(
        e.response?.data?.message || "Failed to generate QR. Please try again.",
      );
      setPhase("failed");
    }
  }, [orderId]);

  useEffect(() => {
    initiateQR();
    return () => cleanup();
  }, [initiateQR]);

  // ── 2. Countdown timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "ready") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!verifiedRef.current) setPhase("expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── 3. WebSocket listener ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "ready" || !qrData?.websocketId) return;

    try {
      const ws = new WebSocket(qrData.websocketId);
      wsRef.current = ws;

      ws.onopen = () => console.log("[FonepayQR] WebSocket connected");

      ws.onmessage = async (event) => {
        console.log("[FonepayQR] WS message:", event.data);
        if (verifiedRef.current) return;

        // Parse the outer message — transactionStatus is a nested JSON string
        let outer;
        try {
          outer = JSON.parse(event.data);
        } catch {
          return;
        }

        const inner =
          typeof outer.transactionStatus === "string"
            ? JSON.parse(outer.transactionStatus)
            : outer.transactionStatus || {};

        if (inner.paymentSuccess === true) {
          // WebSocket says paid — call backend to verify + finalize
          await handleVerify(qrData.referenceLabel, outer);
        }
      };

      ws.onerror = (e) =>
        console.warn("[FonepayQR] WebSocket error — falling back to poll", e);

      ws.onclose = () => console.log("[FonepayQR] WebSocket closed");
    } catch (e) {
      console.warn("[FonepayQR] WebSocket not supported — using poll fallback");
    }

    // ── Fallback: poll every 10s in case WebSocket doesn't fire ──
    pollRef.current = setInterval(() => {
      if (!verifiedRef.current) pollStatus();
    }, POLL_INTERVAL_MS);

    return () => {
      wsRef.current?.close();
      clearInterval(pollRef.current);
    };
  }, [phase, qrData]);

  // ── 4. Cleanup ───────────────────────────────────────────────────────────
  const cleanup = () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    wsRef.current?.close();
  };

  // ── 5. Verify payment (called by WebSocket or "Check Payment" button) ────
  const handleVerify = useCallback(
    async (referenceLabel, websocketPayload = null) => {
      if (verifiedRef.current) return;
      verifiedRef.current = true;

      cleanup();
      setPhase("checking");
      setStatusMsg("Verifying payment with Fonepay...");
      setError("");

      try {
        const res = await axiosInstance.post(
          `/fonepay-intent/verify/${orderId}`,
          { referenceLabel, websocketPayload },
        );

        if (res.data?.success) {
          setPhase("success");
          setStatusMsg("Payment confirmed! ✓");
          setTimeout(() => onSuccess?.(res.data), 1500);
        } else {
          throw new Error("Verification returned unsuccessful");
        }
      } catch (e) {
        verifiedRef.current = false; // allow retry
        setPhase("ready");
        setError(
          e.response?.data?.message ||
            "Payment not confirmed yet. Please try again.",
        );
      }
    },
    [orderId, onSuccess],
  );

  // ── 6. Poll status (fallback) ────────────────────────────────────────────
  const pollStatus = useCallback(async () => {
    if (!qrData?.referenceLabel || verifiedRef.current) return;
    try {
      const res = await axiosInstance.get(
        `/fonepay-intent/status/${orderId}?referenceLabel=${qrData.referenceLabel}`,
      );
      if (res.data?.paymentStatus === "success") {
        await handleVerify(qrData.referenceLabel, null);
      }
    } catch {
      // Silent — timer/WebSocket will handle it
    }
  }, [qrData, orderId, handleVerify]);

  // ── Timer color: green > 60s, orange 30-60s, red < 30s ──────────────────
  const timerColor =
    timeLeft > 60 ? "#16a34a" : timeLeft > 30 ? "#ea580c" : "#dc2626";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src={fonepayLogo} alt="FonePay" className="h-8 object-contain" />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {/* ── LOADING ── */}
          {phase === "loading" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Generating QR code...</p>
            </div>
          )}

          {/* ── READY: Show QR ── */}
          {(phase === "ready" || phase === "checking") && qrData && (
            <>
              {/* QR Code */}
              <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                {phase === "checking" ? (
                  <div className="w-48 h-48 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 text-center">
                      {statusMsg}
                    </p>
                  </div>
                ) : (
                  <QRCodeSVG
                    value={qrData.qrMessage}
                    size={200}
                    level="M"
                    includeMargin={false}
                  />
                )}
              </div>

              {/* Amount */}
              <div className="flex justify-center mb-3">
                <div className="border-2 border-dashed border-gray-300 rounded-xl px-8 py-3 text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    Rs {Number(amount).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Timer */}
              {phase === "ready" && (
                <p className="text-center text-sm text-gray-500 mb-4">
                  QR will expire in{" "}
                  <span className="font-bold" style={{ color: timerColor }}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-3 text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Steps */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Steps to complete payment:
                </p>
                <ul className="space-y-1">
                  {[
                    "Scan / Screenshot this QR",
                    "Open any wallet / mobile banking App",
                    "Complete the payment",
                    "Click Check Payment below",
                  ].map((step, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="text-green-500 text-base">✅</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Check Payment button */}
              <button
                onClick={() => handleVerify(qrData.referenceLabel, null)}
                disabled={phase === "checking"}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#7a5230" }}
              >
                {phase === "checking" ? "Checking..." : "Check Payment"}
              </button>
            </>
          )}

          {/* ── SUCCESS ── */}
          {phase === "success" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Payment Successful!
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Rs {Number(amount).toLocaleString()} paid via FonePay
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Order #{orderNumber}
                </p>
              </div>
            </div>
          )}

          {/* ── EXPIRED ── */}
          {phase === "expired" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                ⏰
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  QR Code Expired
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  The QR code has expired. Generate a new one to try again.
                </p>
              </div>
              <button
                onClick={initiateQR}
                className="w-full py-3 rounded-xl font-bold text-white text-sm bg-red-600 hover:bg-red-700 transition"
              >
                Generate New QR
              </button>
            </div>
          )}

          {/* ── FAILED ── */}
          {phase === "failed" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">
                ❌
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Something went wrong
                </h3>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={initiateQR}
                className="w-full py-3 rounded-xl font-bold text-white text-sm bg-red-600 hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FonepayQRModal;
