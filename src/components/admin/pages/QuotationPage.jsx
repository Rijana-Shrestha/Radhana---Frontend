import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Edit3,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { AdminContext } from "../../../context/AdminContext";

// ── helpers ───────────────────────────────────────────────────────────────────
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
function n2w(n) {
  if (!n || n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000)
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + n2w(n % 100) : "")
    );
  if (n < 100000)
    return (
      n2w(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + n2w(n % 1000) : "")
    );
  return (
    n2w(Math.floor(n / 100000)) +
    " Lakh" +
    (n % 100000 ? " " + n2w(n % 100000) : "")
  );
}
const inWords = (n) => n2w(Math.floor(n || 0)) + " Rupees only";
const fmtD = (s) =>
  s
    ? new Date(s).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const blankItem = () => ({
  itemName: "",
  description: "",
  quantity: 1,
  pricePerUnit: 0,
});
const blankForm = () => ({
  billTo: { name: "", address: "", phone: "", email: "" },
  items: [blankItem()],
  discount: 0,
  notes:
    "This quotation is valid for the duration mentioned. Prices are subject to change after the validity date.",
  validUntil: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  quotationDate: new Date().toISOString().slice(0, 10),
});

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ qt }) => {
  const now = new Date();
  const exp = qt.validUntil ? new Date(qt.validUntil) : null;
  if (!exp)
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        No expiry
      </span>
    );
  const days = Math.ceil((exp - now) / 86400000);
  if (days < 0)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
        <Clock size={10} /> Expired
      </span>
    );
  if (days <= 3)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
        <Clock size={10} /> {days}d left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <CheckCircle size={10} /> Active
    </span>
  );
};

// ── Print preview ─────────────────────────────────────────────────────────────
const PreviewModal = ({ qt, onClose }) => {
  const ref = useRef();
  const sub = (qt.items || []).reduce(
    (s, i) => s + i.quantity * i.pricePerUnit,
    0,
  );
  const total = sub - (qt.discount || 0);

  const doPrint = () => {
    const win = window.open("", "_blank");
    win.document
      .write(`<!DOCTYPE html><html><head><title>Quotation ${qt.invoiceNumber}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Poppins',sans-serif;font-size:13px;color:#1e293b;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .wrap{max-width:760px;margin:auto;padding:44px 40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:22px;border-bottom:2px solid #f1f5f9}
      .co{font-size:22px;font-weight:700;color:#0f172a}
      .co-sub{font-size:11px;color:#94a3b8;margin-top:3px}
      .badge{display:inline-block;background:#D93A6A;color:#fff;font-weight:700;font-size:11px;padding:4px 14px;border-radius:20px;letter-spacing:1px;text-transform:uppercase}
      .qt-no{font-size:28px;font-weight:700;color:#D93A6A;line-height:1.1;margin-top:6px}
      .two-col{display:flex;gap:28px;margin-bottom:28px}
      .col{flex:1}
      .label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:6px}
      .client-name{font-size:16px;font-weight:700}
      .client-sub{font-size:12px;color:#64748b;margin-top:2px}
      .validity{border:2px dashed #D93A6A44;border-radius:10px;padding:14px;background:#fff5f7}
      .v-date{font-size:18px;font-weight:700;margin-top:2px}
      .v-sub{font-size:11px;color:#94a3b8;margin-top:3px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      th{background:#f8fafc;border-bottom:2px solid #e2e8f0;padding:9px 12px;font-size:10px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;text-align:left}
      th.r,td.r{text-align:right}
      td{padding:11px 12px;border-bottom:1px solid #f1f5f9;font-size:12px}
      .item-name{font-weight:600;font-size:13px}
      .item-desc{font-size:11px;color:#94a3b8;margin-top:1px}
      .foot-row td{border-top:1px solid #e2e8f0;padding:8px 12px}
      .total-row td{border-top:2px solid #e2e8f0;background:#f8fafc;font-weight:700;font-size:14px}
      .amount-words{font-size:12px;color:#64748b;font-style:italic;margin-bottom:20px}
      .notes-box{background:#f8fafc;border-radius:8px;padding:14px;font-size:12px;color:#64748b;margin-bottom:28px}
      .notes-title{font-weight:600;color:#475569;margin-bottom:4px;font-size:12px}
      .footer-sig{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #f1f5f9;padding-top:22px;margin-top:32px}
      .sig-line{border-top:1px solid #94a3b8;width:140px;padding-top:5px;font-size:11px;color:#64748b}
      .disclaimer{font-size:11px;color:#94a3b8}
      @media print{@page{size:A4;margin:15mm}}
    </style></head><body><div class="wrap">${ref.current.innerHTML}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg">
            Quotation Preview
          </h2>
          <div className="flex gap-3">
            <button
              onClick={doPrint}
              className="flex items-center gap-2 bg-accent-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Send size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X size={17} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div ref={ref} style={{ padding: "44px 40px" }}>
          {/* Header */}
          <div
            className="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 36,
              paddingBottom: 22,
              borderBottom: "2px solid #f1f5f9",
            }}
          >
            <div>
              <div
                className="co"
                style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}
              >
                Radhana Enterprises
              </div>
              <div
                className="co-sub"
                style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}
              >
                PAN: 128464005 · +977 9823939106
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                radhanaart@gmail.com · Sitapaila, Kathmandu
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="badge"
                style={{
                  display: "inline-block",
                  background: "#D93A6A",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 11,
                  padding: "4px 14px",
                  borderRadius: 20,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Quotation
              </div>
              <div
                className="qt-no"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#D93A6A",
                  lineHeight: 1.1,
                  marginTop: 6,
                }}
              >
                {qt.invoiceNumber}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                Date: {fmtD(qt.invoiceDate || qt.createdAt)}
              </div>
            </div>
          </div>

          {/* Client + Validity */}
          <div style={{ display: "flex", gap: 28, marginBottom: 28 }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#94a3b8",
                  marginBottom: 6,
                }}
              >
                Prepared For
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {qt.billTo?.name || "—"}
              </div>
              {qt.billTo?.address && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {qt.billTo.address}
                </div>
              )}
              {qt.billTo?.phone && (
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  📞 {qt.billTo.phone}
                </div>
              )}
              {qt.billTo?.email && (
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {qt.billTo.email}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  border: "2px dashed #D93A6A44",
                  borderRadius: 10,
                  padding: 14,
                  background: "#fff5f7",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: "#D93A6A",
                    marginBottom: 4,
                  }}
                >
                  Valid Until
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {fmtD(qt.validUntil)}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                  Please respond before this date
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {["#", "Item / Service", "Qty", "Unit Price", "Total"].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "9px 12px",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        textAlign: i >= 2 ? "right" : "left",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(qt.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td
                    style={{
                      padding: "11px 12px",
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {item.itemName}
                    </div>
                    {item.description && (
                      <div
                        style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}
                      >
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "11px 12px",
                      textAlign: "right",
                      fontSize: 12,
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "11px 12px",
                      textAlign: "right",
                      fontSize: 12,
                    }}
                  >
                    Rs. {Number(item.pricePerUnit).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "11px 12px",
                      textAlign: "right",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    Rs. {(item.quantity * item.pricePerUnit).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {(qt.discount || 0) > 0 && (
                <>
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "7px 12px",
                        textAlign: "right",
                        color: "#64748b",
                        fontSize: 12,
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      Sub Total
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        textAlign: "right",
                        fontSize: 12,
                      }}
                    >
                      Rs. {sub.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "5px 12px",
                        textAlign: "right",
                        color: "#D93A6A",
                        fontSize: 12,
                      }}
                    >
                      Discount
                    </td>
                    <td
                      style={{
                        padding: "5px 12px",
                        textAlign: "right",
                        color: "#D93A6A",
                        fontSize: 12,
                      }}
                    >
                      — Rs. {Number(qt.discount).toLocaleString()}
                    </td>
                  </tr>
                </>
              )}
              <tr
                style={{
                  borderTop: "2px solid #e2e8f0",
                  background: "#f8fafc",
                }}
              >
                <td
                  colSpan={4}
                  style={{
                    padding: 14,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Estimated Total
                </td>
                <td
                  style={{
                    padding: 14,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#D93A6A",
                  }}
                >
                  Rs. {total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              fontStyle: "italic",
              marginBottom: 20,
            }}
          >
            Amount in Words: <strong>{inWords(total)}</strong>
          </div>

          {qt.notes && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: "13px 16px",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: 4,
                  fontSize: 12,
                }}
              >
                Notes & Terms
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{qt.notes}</div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid #f1f5f9",
              paddingTop: 22,
              marginTop: 32,
            }}
          >
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              This is a quotation only — not a final invoice.
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 40, fontSize: 12, color: "#475569" }}>
                For, Radhana Enterprises
              </div>
              <div
                style={{
                  borderTop: "1px solid #94a3b8",
                  paddingTop: 5,
                  width: 140,
                  fontSize: 11,
                  color: "#64748b",
                }}
              >
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Create / Edit Modal ───────────────────────────────────────────────────────
const QuoteModal = ({ onClose, onSave, editData }) => {
  const [form, setForm] = useState(
    editData
      ? {
          billTo: editData.billTo || {
            name: "",
            address: "",
            phone: "",
            email: "",
          },
          items: editData.items || [blankItem()],
          discount: editData.discount || 0,
          notes: editData.notes || "",
          validUntil: editData.validUntil
            ? new Date(editData.validUntil).toISOString().slice(0, 10)
            : "",
          quotationDate: editData.invoiceDate
            ? new Date(editData.invoiceDate).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        }
      : blankForm(),
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const sub = form.items.reduce(
    (s, i) => s + Number(i.quantity) * Number(i.pricePerUnit),
    0,
  );
  const total = sub - Number(form.discount || 0);

  const sf = (path, val) =>
    setForm((p) =>
      path.startsWith("billTo.")
        ? { ...p, billTo: { ...p.billTo, [path.slice(7)]: val } }
        : { ...p, [path]: val },
    );
  const si = (idx, field, val) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((it, i) =>
        i !== idx
          ? it
          : {
              ...it,
              [field]:
                field === "itemName" || field === "description"
                  ? val
                  : Number(val),
            },
      ),
    }));
  const addRow = () =>
    setForm((p) => ({ ...p, items: [...p.items, blankItem()] }));
  const delRow = (idx) =>
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const save = async () => {
    if (!form.billTo.name.trim()) return setErr("Customer name is required.");
    if (!form.items[0]?.itemName.trim())
      return setErr("Add at least one item.");
    setSaving(true);
    setErr("");
    try {
      await onSave({
        type: "quotation",
        billTo: form.billTo,
        items: form.items.map((i) => ({
          ...i,
          amount: i.quantity * i.pricePerUnit,
        })),
        discount: Number(form.discount),
        subTotal: sub,
        taxRate: 0,
        taxAmount: 0,
        totalAmount: total,
        balanceAmount: total,
        receivedAmount: 0,
        notes: form.notes,
        validUntil: form.validUntil || null,
        invoiceDate: form.quotationDate,
      });
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
              <Sparkles size={17} className="text-accent-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {editData ? "Edit" : "New"} Quotation
              </h2>
              <p className="text-xs text-gray-400">
                Prepare a price estimate for your customer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 bg-rose-50/50 border border-rose-100 rounded-xl p-4">
            <div>
              <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1.5 block">
                Quotation Date
              </label>
              <input
                type="date"
                value={form.quotationDate}
                onChange={(e) => sf("quotationDate", e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <Clock size={10} /> Valid Until
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => sf("validUntil", e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
          </div>

          {/* Client */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Prepared For
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Customer / Company Name *"
                value={form.billTo.name}
                onChange={(e) => sf("billTo.name", e.target.value)}
                className="col-span-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
              <input
                placeholder="Address"
                value={form.billTo.address}
                onChange={(e) => sf("billTo.address", e.target.value)}
                className="col-span-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
              <input
                placeholder="Phone"
                value={form.billTo.phone}
                onChange={(e) => sf("billTo.phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
              <input
                placeholder="Email"
                value={form.billTo.email}
                onChange={(e) => sf("billTo.email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Items / Services
              </h3>
              <button
                onClick={addRow}
                className="flex items-center gap-1 text-xs text-accent-600 font-bold hover:opacity-70"
              >
                <Plus size={13} /> Add Row
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs text-gray-400 font-semibold">
                      #
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-gray-400 font-semibold">
                      Item
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-gray-400 font-semibold w-16">
                      Qty
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs text-gray-400 font-semibold w-28">
                      Price (Rs.)
                    </th>
                    <th className="text-right px-3 py-2.5 text-xs text-gray-400 font-semibold w-24">
                      Total
                    </th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-3 py-2 text-xs text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          placeholder="Item name *"
                          value={item.itemName}
                          onChange={(e) => si(idx, "itemName", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-600 mb-1"
                        />
                        <input
                          placeholder="Description (optional)"
                          value={item.description}
                          onChange={(e) =>
                            si(idx, "description", e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs text-gray-400 border-0 focus:outline-none bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => si(idx, "quantity", e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-accent-600"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={item.pricePerUnit}
                          onChange={(e) =>
                            si(idx, "pricePerUnit", e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent-600"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-gray-700">
                        Rs.{" "}
                        {(item.quantity * item.pricePerUnit).toLocaleString()}
                      </td>
                      <td className="px-2 py-2">
                        {form.items.length > 1 && (
                          <button
                            onClick={() => delRow(idx)}
                            className="text-red-400 hover:text-red-600 p-0.5"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals + Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                  Discount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.discount}
                  onChange={(e) => sf("discount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                  Notes / Terms
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => sf("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sub Total</span>
                  <span>Rs. {sub.toLocaleString()}</span>
                </div>
                {Number(form.discount) > 0 && (
                  <div className="flex justify-between text-sm text-accent-600">
                    <span>Discount</span>
                    <span>— Rs. {Number(form.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-rose-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Estimated Total</span>
                  <span className="text-accent-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 italic">
                {inWords(total)}
              </p>
            </div>
          </div>

          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={14} />
              {err}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2 text-sm text-white bg-accent-600 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Sparkles size={13} />
                Save Quotation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const QuotationPage = () => {
  const { getInvoices, createInvoice, updateInvoice, deleteInvoice } =
    useContext(AdminContext);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editQt, setEditQt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", ok: true });

  const notify = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await getInvoices("quotation");
      setQuotes(Array.isArray(d) ? d : []);
    } catch {
      notify("Failed to load.", false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const now = new Date();
  const filtered = quotes.filter(
    (q) =>
      (q.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.billTo?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.billTo?.phone || "").includes(search),
  );

  const stats = {
    total: quotes.length,
    active: quotes.filter((q) => !q.validUntil || new Date(q.validUntil) >= now)
      .length,
    expired: quotes.filter((q) => q.validUntil && new Date(q.validUntil) < now)
      .length,
    value: quotes.reduce((s, q) => s + (q.totalAmount || 0), 0),
  };

  const handleSave = async (data) => {
    if (editQt) {
      await updateInvoice(editQt._id, data);
      notify("Quotation updated.");
    } else {
      await createInvoice(data);
      notify("Quotation created.");
    }
    setEditQt(null);
    load();
  };
  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteId);
      notify("Deleted.");
      setDeleteId(null);
      load();
    } catch {
      notify("Delete failed.", false);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"></div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Create and send price estimates to customers
          </p>
        </div>
        <button
          onClick={() => {
            setEditQt(null);
            setModal(true);
          }}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} /> New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            cls: "text-gray-800",
            bg: "bg-gray-50 border-gray-100",
          },
          {
            label: "Active",
            value: stats.active,
            cls: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
          },
          {
            label: "Expired",
            value: stats.expired,
            cls: "text-red-500",
            bg: "bg-red-50 border-red-100",
          },
          {
            label: "Total Value",
            value: `Rs. ${stats.value.toLocaleString()}`,
            cls: "text-accent-600",
            bg: "bg-rose-50 border-rose-100",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-2xl p-4`}>
            <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
        <Search size={14} className="text-gray-300 shrink-0" />
        <input
          placeholder="Search by quote number, customer name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-300 bg-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-300 hover:text-gray-500"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <RefreshCw size={22} className="animate-spin mr-3 text-accent-600" />{" "}
          Loading quotations…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-rose-200" />
          </div>
          <p className="text-gray-400 font-medium">No quotations yet</p>
          <p className="text-gray-300 text-sm mt-1">
            Create your first quotation using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((qt) => {
            const sub = (qt.items || []).reduce(
              (s, i) => s + i.quantity * i.pricePerUnit,
              0,
            );
            return (
              <div
                key={qt._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-accent-600 to-pink-300" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 mr-2">
                      <p className="text-xs font-bold text-accent-600 tracking-wider">
                        {qt.invoiceNumber}
                      </p>
                      <h3 className="font-bold text-gray-800 mt-0.5 truncate">
                        {qt.billTo?.name || "—"}
                      </h3>
                      {qt.billTo?.phone && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {qt.billTo.phone}
                        </p>
                      )}
                    </div>
                    <StatusBadge qt={qt} />
                  </div>

                  <div className="space-y-1 mb-4">
                    {(qt.items || []).slice(0, 2).map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-gray-500"
                      >
                        <span className="truncate mr-2">
                          {item.itemName} ×{item.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          Rs.{" "}
                          {(item.quantity * item.pricePerUnit).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {(qt.items || []).length > 2 && (
                      <p className="text-xs text-gray-300">
                        +{qt.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Estimated Total</p>
                      <p className="font-bold text-accent-600 text-base">
                        Rs. {(qt.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Valid until</p>
                      <p className="text-xs font-medium text-gray-600">
                        {qt.validUntil ? fmtD(qt.validUntil) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreview(qt)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-accent-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Eye size={13} /> Preview
                    </button>
                    <button
                      onClick={() => {
                        setEditQt(qt);
                        setModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(qt._id)}
                      className="w-9 flex items-center justify-center py-2 text-red-400 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <QuoteModal
          onClose={() => {
            setModal(false);
            setEditQt(null);
          }}
          onSave={handleSave}
          editData={editQt}
        />
      )}
      {preview && (
        <PreviewModal qt={preview} onClose={() => setPreview(null)} />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Delete Quotation?</h3>
            <p className="text-sm text-gray-400 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}{" "}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default QuotationPage;
