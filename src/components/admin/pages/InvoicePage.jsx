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
  Printer,
  Eye,
  Trash2,
  X,
  ChevronDown,
  FileText,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { AdminContext } from "../../../context/AdminContext";

// ─── Number-to-Words (Nepali Rupees) ─────────────────────────────────────────
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

function numToWords(n) {
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000)
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + numToWords(n % 100) : "")
    );
  if (n < 100000)
    return (
      numToWords(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + numToWords(n % 1000) : "")
    );
  if (n < 10000000)
    return (
      numToWords(Math.floor(n / 100000)) +
      " Lakh" +
      (n % 100000 ? " " + numToWords(n % 100000) : "")
    );
  return (
    numToWords(Math.floor(n / 10000000)) +
    " Crore" +
    (n % 10000000 ? " " + numToWords(n % 10000000) : "")
  );
}

function amountInWords(amount) {
  const whole = Math.floor(amount);
  const paisa = Math.round((amount - whole) * 100);
  let result = numToWords(whole) + " Rupees";
  if (paisa > 0) result += " and " + numToWords(paisa) + " Paisa";
  return result + " only";
}

// ─── Empty item row ───────────────────────────────────────────────────────────
const emptyItem = () => ({
  itemName: "",
  description: "",
  quantity: 1,
  pricePerUnit: 0,
  amount: 0,
});

// ─── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = () => ({
  type: "tax_invoice",
  orderId: "",
  billTo: { name: "", address: "", phone: "", email: "", pan: "" },
  items: [emptyItem()],
  taxRate: 0,
  discount: 0,
  receivedAmount: 0,
  paymentMethod: "",
  notes: "Thank you for doing business with us.",
  termsAndConditions: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
});

// ─── Status Badge ─────────────────────────────────────────────────────────────
const PayBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || map.unpaid}`}
    >
      {status}
    </span>
  );
};

// ─── Print / Invoice Preview ──────────────────────────────────────────────────
const InvoicePreview = ({ invoice, onClose }) => {
  const printRef = useRef();
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Poppins',sans-serif; font-size:13px; color:#222; background:#fff; }
        .page { width:794px; min-height:1123px; padding:40px; margin:auto; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #ccc; padding:8px 10px; }
        th { background:#7b1fa2; color:#fff; font-weight:600; }
        .header-bar { background:#7b1fa2; padding:18px 24px; display:flex; justify-content:space-between; align-items:center; }
        .header-bar h1 { color:#fff; font-size:22px; font-weight:700; }
        .header-bar p { color:#e9d5ff; font-size:12px; }
        .section-label { background:#7b1fa2; color:#fff; font-weight:600; padding:6px 10px; font-size:12px; }
        .totals td { border:none; border-bottom:1px solid #eee; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const inv = invoice;
  const date = new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4">
        {/* Modal controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-poppins font-semibold text-gray-800 text-lg">
            Invoice Preview
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-500 transition-colors"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div
          ref={printRef}
          className="page"
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 13,
            color: "#222",
            padding: 40,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#7b1fa2",
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: "#fff2",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
                RA
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Radhana Enterprises
              </h1>
              <p style={{ color: "#e9d5ff", fontSize: 12, margin: "4px 0 0" }}>
                PAN No.: 128464005
              </p>
              <p style={{ color: "#e9d5ff", fontSize: 12, margin: 0 }}>
                Phone no.: 9823939106 &nbsp;|&nbsp; Email: radhanaart@gmail.com
              </p>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#7b1fa2",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {inv.type === "quotation" ? "Quotation" : "Tax Invoice"}
            </h2>
          </div>

          {/* Bill To + Invoice Details */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: "50%",
                    border: "1px solid #ccc",
                    verticalAlign: "top",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      background: "#7b1fa2",
                      color: "#fff",
                      padding: "6px 10px",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    Bill To
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <strong>{inv.billTo?.name}</strong>
                    {inv.billTo?.address && (
                      <div
                        style={{ color: "#555", fontSize: 12, marginTop: 4 }}
                      >
                        {inv.billTo.address}
                      </div>
                    )}
                    {inv.billTo?.phone && (
                      <div style={{ color: "#555", fontSize: 12 }}>
                        Ph: {inv.billTo.phone}
                      </div>
                    )}
                    {inv.billTo?.email && (
                      <div style={{ color: "#555", fontSize: 12 }}>
                        {inv.billTo.email}
                      </div>
                    )}
                    {inv.billTo?.pan && (
                      <div style={{ color: "#555", fontSize: 12 }}>
                        PAN: {inv.billTo.pan}
                      </div>
                    )}
                  </div>
                </td>
                <td
                  style={{
                    width: "50%",
                    border: "1px solid #ccc",
                    verticalAlign: "top",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      background: "#7b1fa2",
                      color: "#fff",
                      padding: "6px 10px",
                      fontWeight: 600,
                      fontSize: 12,
                      textAlign: "right",
                    }}
                  >
                    Invoice Details
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "right" }}>
                    <div style={{ fontSize: 13 }}>
                      Invoice No.: <strong>{inv.invoiceNumber}</strong>
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Date: <strong>{date}</strong>
                    </div>
                    {inv.order && (
                      <div
                        style={{ fontSize: 12, color: "#555", marginTop: 4 }}
                      >
                        Order: {inv.order?.orderNumber || inv.order}
                      </div>
                    )}
                    {inv.type === "quotation" && inv.validUntil && (
                      <div style={{ fontSize: 12, color: "#555" }}>
                        Valid Until:{" "}
                        {new Date(inv.validUntil).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead>
              <tr style={{ background: "#7b1fa2" }}>
                <th
                  style={{
                    color: "#fff",
                    padding: "8px 10px",
                    textAlign: "left",
                    fontWeight: 600,
                    border: "1px solid #7b1fa2",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    color: "#fff",
                    padding: "8px 10px",
                    textAlign: "left",
                    fontWeight: 600,
                    border: "1px solid #7b1fa2",
                  }}
                >
                  Item Name
                </th>
                <th
                  style={{
                    color: "#fff",
                    padding: "8px 10px",
                    textAlign: "center",
                    fontWeight: 600,
                    border: "1px solid #7b1fa2",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    color: "#fff",
                    padding: "8px 10px",
                    textAlign: "right",
                    fontWeight: 600,
                    border: "1px solid #7b1fa2",
                  }}
                >
                  Price/Unit
                </th>
                <th
                  style={{
                    color: "#fff",
                    padding: "8px 10px",
                    textAlign: "right",
                    fontWeight: 600,
                    border: "1px solid #7b1fa2",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {(inv.items || []).map((item, idx) => (
                <tr
                  key={idx}
                  style={{ background: idx % 2 === 0 ? "#fafafa" : "#fff" }}
                >
                  <td
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "8px 10px",
                      color: "#555",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{ border: "1px solid #e0e0e0", padding: "8px 10px" }}
                  >
                    <strong>{item.itemName}</strong>
                    {item.description && (
                      <div
                        style={{ fontSize: 11, color: "#888", marginTop: 2 }}
                      >
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "8px 10px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "8px 10px",
                      textAlign: "right",
                    }}
                  >
                    Rs {Number(item.pricePerUnit).toFixed(3)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "8px 10px",
                      textAlign: "right",
                    }}
                  >
                    Rs{" "}
                    {Number(
                      item.amount || item.quantity * item.pricePerUnit,
                    ).toFixed(3)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2}
                  style={{ border: "1px solid #e0e0e0", padding: "8px 10px" }}
                />
                <td
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "8px 10px",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {(inv.items || []).reduce((s, i) => s + i.quantity, 0)}
                </td>
                <td
                  style={{ border: "1px solid #e0e0e0", padding: "8px 10px" }}
                />
                <td
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "8px 10px",
                    textAlign: "right",
                    fontWeight: 700,
                  }}
                >
                  Rs {Number(inv.totalAmount).toFixed(3)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bottom section: words + amounts */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: "50%",
                    verticalAlign: "top",
                    border: "1px solid #ccc",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      background: "#7b1fa2",
                      color: "#fff",
                      padding: "6px 10px",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    Invoice Amount In Words:
                  </div>
                  <div style={{ padding: "10px 12px", fontSize: 13 }}>
                    {amountInWords(inv.totalAmount || 0)}
                  </div>
                  {inv.notes && (
                    <>
                      <div
                        style={{
                          background: "#7b1fa2",
                          color: "#fff",
                          padding: "6px 10px",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Terms and conditions
                      </div>
                      <div
                        style={{
                          padding: "10px 12px",
                          fontSize: 12,
                          color: "#555",
                        }}
                      >
                        {inv.notes}
                      </div>
                    </>
                  )}
                </td>
                <td
                  style={{
                    width: "50%",
                    verticalAlign: "top",
                    border: "1px solid #ccc",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      background: "#7b1fa2",
                      color: "#fff",
                      padding: "6px 10px",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    Amounts
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "6px 12px", color: "#555" }}>
                          Sub Total
                        </td>
                        <td style={{ padding: "6px 12px", textAlign: "right" }}>
                          Rs {Number(inv.subTotal).toFixed(3)}
                        </td>
                      </tr>
                      {inv.taxRate > 0 && (
                        <tr>
                          <td style={{ padding: "6px 12px", color: "#555" }}>
                            Tax ({inv.taxRate}%)
                          </td>
                          <td
                            style={{ padding: "6px 12px", textAlign: "right" }}
                          >
                            Rs {Number(inv.taxAmount).toFixed(3)}
                          </td>
                        </tr>
                      )}
                      {inv.discount > 0 && (
                        <tr>
                          <td style={{ padding: "6px 12px", color: "#555" }}>
                            Discount
                          </td>
                          <td
                            style={{ padding: "6px 12px", textAlign: "right" }}
                          >
                            - Rs {Number(inv.discount).toFixed(3)}
                          </td>
                        </tr>
                      )}
                      <tr style={{ borderTop: "2px solid #eee" }}>
                        <td style={{ padding: "6px 12px", fontWeight: 700 }}>
                          Total
                        </td>
                        <td
                          style={{
                            padding: "6px 12px",
                            textAlign: "right",
                            fontWeight: 700,
                          }}
                        >
                          Rs {Number(inv.totalAmount).toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "6px 12px", color: "#555" }}>
                          Received
                        </td>
                        <td style={{ padding: "6px 12px", textAlign: "right" }}>
                          Rs {Number(inv.receivedAmount).toFixed(3)}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "1px solid #eee" }}>
                        <td style={{ padding: "6px 12px", color: "#555" }}>
                          Balance
                        </td>
                        <td style={{ padding: "6px 12px", textAlign: "right" }}>
                          Rs {Number(inv.balanceAmount).toFixed(3)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signature */}
          <div style={{ textAlign: "right", marginTop: 32 }}>
            <p style={{ marginBottom: 40 }}>For, Radhana Enterprises</p>
            <div
              style={{
                borderTop: "1px solid #999",
                width: 160,
                marginLeft: "auto",
                paddingTop: 6,
              }}
            >
              <p style={{ fontSize: 12 }}>Accountant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
const InvoiceModal = ({ onClose, onSave, orders, editData, invoiceType }) => {
  const { getInvoiceDraftFromOrder } = useContext(AdminContext);
  const [form, setForm] = useState(
    editData || { ...emptyForm(), type: invoiceType || "tax_invoice" },
  );
  const [mode, setMode] = useState("manual"); // "order" | "manual"
  const [orderSearch, setOrderSearch] = useState("");
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      !o.isInvoiceGenerated &&
      ((o.orderNumber || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.shippingAddress?.firstName || "")
          .toLowerCase()
          .includes(orderSearch.toLowerCase())),
  );

  const subTotal = form.items.reduce(
    (s, i) => s + Number(i.quantity) * Number(i.pricePerUnit),
    0,
  );
  const taxAmount = Math.round((subTotal * Number(form.taxRate || 0)) / 100);
  const totalAmount = subTotal + taxAmount - Number(form.discount || 0);
  const balanceAmount = totalAmount - Number(form.receivedAmount || 0);

  const setField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      if (path.startsWith("billTo.")) {
        next.billTo = { ...prev.billTo, [path.replace("billTo.", "")]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const setItem = (idx, field, val) => {
    setForm((prev) => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const updated = {
          ...it,
          [field]:
            field === "itemName" || field === "description" ? val : Number(val),
        };
        updated.amount = updated.quantity * updated.pricePerUnit;
        return updated;
      });
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  const removeItem = (idx) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const loadFromOrder = async (order) => {
    setLoadingDraft(true);
    setError("");
    try {
      const draft = await getInvoiceDraftFromOrder(order._id);
      setForm((prev) => ({
        ...prev,
        orderId: order._id,
        billTo: draft.billTo || prev.billTo,
        items: draft.items || prev.items,
        paymentMethod: draft.paymentMethod || prev.paymentMethod,
      }));
      setMode("manual");
    } catch {
      setError("Could not load order details. You can fill manually.");
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleSave = async () => {
    if (!form.billTo.name.trim()) return setError("Bill To name is required.");
    if (!form.items.length || !form.items[0].itemName.trim())
      return setError("At least one item is required.");
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        subTotal,
        taxAmount,
        totalAmount,
        balanceAmount,
      });
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-poppins font-bold text-gray-800 text-xl">
            {editData ? "Edit" : "Create"}{" "}
            {invoiceType === "quotation" ? "Quotation" : "Tax Invoice"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode toggle */}
          {!editData && (
            <div className="flex gap-3">
              <button
                onClick={() => setMode("order")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${mode === "order" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-600"}`}
              >
                <Package size={15} /> From Existing Order
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${mode === "manual" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-600"}`}
              >
                <Edit3 size={15} /> Manual / Offline
              </button>
            </div>
          )}

          {/* Order picker */}
          {mode === "order" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700 font-medium mb-3">
                Search and select an order to auto-fill the invoice:
              </p>
              <input
                type="text"
                placeholder="Search by order number or customer name..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 mb-3"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredOrders.slice(0, 20).map((o) => (
                  <button
                    key={o._id}
                    onClick={() => loadFromOrder(o)}
                    disabled={loadingDraft}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-sm"
                  >
                    <span className="font-medium text-gray-800">
                      {o.orderNumber || o._id?.slice(-8)}
                    </span>
                    <span className="text-gray-500">
                      {o.shippingAddress?.firstName}{" "}
                      {o.shippingAddress?.lastName} — Rs{" "}
                      {o.totalPrice?.toLocaleString()}
                    </span>
                  </button>
                ))}
                {filteredOrders.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No orders found.
                  </p>
                )}
              </div>
              {loadingDraft && (
                <div className="flex items-center gap-2 mt-3 text-sm text-blue-600">
                  <RefreshCw size={13} className="animate-spin" /> Loading order
                  details…
                </div>
              )}
            </div>
          )}

          {/* Bill To + Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Bill To
              </h3>
              <input
                placeholder="Customer / Company Name *"
                value={form.billTo.name}
                onChange={(e) => setField("billTo.name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                placeholder="Address"
                value={form.billTo.address}
                onChange={(e) => setField("billTo.address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                placeholder="Phone"
                value={form.billTo.phone}
                onChange={(e) => setField("billTo.phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                placeholder="Email"
                value={form.billTo.email}
                onChange={(e) => setField("billTo.email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                placeholder="Buyer PAN (optional)"
                value={form.billTo.pan}
                onChange={(e) => setField("billTo.pan", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Invoice Details
              </h3>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => setField("invoiceDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              {invoiceType === "quotation" && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={form.validUntil || ""}
                    onChange={(e) => setField("validUntil", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Payment Method
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setField("paymentMethod", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">— Select —</option>
                  <option value="cash">Cash</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Items
              </h3>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-pink-500 transition-colors"
              >
                <Plus size={15} /> Add Row
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-gray-600 font-medium w-8">
                      #
                    </th>
                    <th className="text-left px-3 py-2.5 text-gray-600 font-medium">
                      Item Name
                    </th>
                    <th className="text-left px-3 py-2.5 text-gray-600 font-medium w-20">
                      Qty
                    </th>
                    <th className="text-left px-3 py-2.5 text-gray-600 font-medium w-32">
                      Price/Unit (Rs)
                    </th>
                    <th className="text-right px-3 py-2.5 text-gray-600 font-medium w-28">
                      Amount
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-3 py-2 text-gray-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          placeholder="Item name"
                          value={item.itemName}
                          onChange={(e) =>
                            setItem(idx, "itemName", e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <input
                          placeholder="Description (optional)"
                          value={item.description}
                          onChange={(e) =>
                            setItem(idx, "description", e.target.value)
                          }
                          className="w-full px-2 py-1 border-0 text-xs text-gray-400 focus:outline-none mt-0.5"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            setItem(idx, "quantity", e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={item.pricePerUnit}
                          onChange={(e) =>
                            setItem(idx, "pricePerUnit", e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-700">
                        Rs {(item.quantity * item.pricePerUnit).toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        {form.items.length > 1 && (
                          <button
                            onClick={() => removeItem(idx)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax, discount, received */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Payment
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.taxRate}
                    onChange={(e) => setField("taxRate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Discount (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.discount}
                    onChange={(e) => setField("discount", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Received Amount (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.receivedAmount}
                  onChange={(e) => setField("receivedAmount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>

            {/* Amount summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">
                Summary
              </h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sub Total</span>
                <span>Rs {subTotal.toFixed(2)}</span>
              </div>
              {Number(form.taxRate) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax ({form.taxRate}%)</span>
                  <span>Rs {taxAmount.toFixed(2)}</span>
                </div>
              )}
              {Number(form.discount) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span>- Rs {Number(form.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>Rs {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Received</span>
                <span>Rs {Number(form.receivedAmount).toFixed(2)}</span>
              </div>
              <div
                className={`flex justify-between text-sm font-semibold ${balanceAmount > 0 ? "text-red-600" : "text-green-600"}`}
              >
                <span>Balance Due</span>
                <span>Rs {balanceAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 text-xs text-gray-500 italic">
                {amountInWords(totalAmount)}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm text-white bg-blue-600 rounded-xl hover:bg-pink-500 transition-colors font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <CheckCircle size={13} /> Save Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main InvoicePage ─────────────────────────────────────────────────────────
const InvoicePage = ({ invoiceType = "tax_invoice" }) => {
  const {
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getAllOrders,
  } = useContext(AdminContext);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", ok: true });

  const label = invoiceType === "quotation" ? "Quotation" : "Tax Invoice";

  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, ord] = await Promise.all([
        getInvoices(invoiceType),
        getAllOrders(),
      ]);
      setInvoices(Array.isArray(inv) ? inv : []);
      setOrders(Array.isArray(ord) ? ord : []);
    } catch {
      showToast("Failed to load data.", false);
    } finally {
      setLoading(false);
    }
  }, [invoiceType]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      (inv.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.billTo?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.billTo?.phone || "").includes(search);
    const matchStatus =
      filterStatus === "all" || inv.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.paymentStatus === "paid").length,
    unpaid: invoices.filter((i) => i.paymentStatus === "unpaid").length,
    partial: invoices.filter((i) => i.paymentStatus === "partial").length,
    revenue: invoices
      .filter((i) => i.paymentStatus === "paid")
      .reduce((s, i) => s + i.totalAmount, 0),
  };

  const handleSave = async (data) => {
    if (editInvoice) {
      await updateInvoice(editInvoice._id, data);
      showToast(`${label} updated successfully.`);
    } else {
      await createInvoice({ ...data, type: invoiceType });
      showToast(`${label} created successfully.`);
    }
    setEditInvoice(null);
    load();
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteId);
      showToast(`${label} deleted.`);
      setDeleteId(null);
      load();
    } catch {
      showToast("Delete failed.", false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            {invoiceType === "quotation" ? "Quotations" : "Tax Invoices"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {invoiceType === "quotation"
              ? "Create and manage price quotations for customers"
              : "Create and manage tax invoices for orders"}
          </p>
        </div>
        <button
          onClick={() => {
            setEditInvoice(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-pink-500 transition-colors shadow-sm"
        >
          <Plus size={16} /> New {label}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-gray-800" },
          { label: "Paid", value: stats.paid, color: "text-green-600" },
          { label: "Partial", value: stats.partial, color: "text-yellow-600" },
          { label: "Unpaid", value: stats.unpaid, color: "text-red-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder={`Search by ${label.toLowerCase()} no., customer name, phone…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "paid", "partial", "unpaid"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filterStatus === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RefreshCw size={24} className="animate-spin mr-3" /> Loading{" "}
            {invoiceType === "quotation" ? "quotations" : "invoices"}…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              No {invoiceType === "quotation" ? "quotations" : "invoices"} found
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Create your first {label.toLowerCase()} using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                    {label} No.
                  </th>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                    Bill To
                  </th>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 text-gray-600 font-semibold">
                    Total
                  </th>
                  <th className="text-right px-5 py-3 text-gray-600 font-semibold">
                    Balance
                  </th>
                  <th className="text-center px-5 py-3 text-gray-600 font-semibold">
                    Status
                  </th>
                  <th className="text-center px-5 py-3 text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, idx) => (
                  <tr
                    key={inv._id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/40"}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-blue-600">
                        {inv.invoiceNumber}
                      </span>
                      {inv.order && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Order: {inv.order?.orderNumber || inv.order}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">
                        {inv.billTo?.name}
                      </p>
                      {inv.billTo?.phone && (
                        <p className="text-xs text-gray-400">
                          {inv.billTo.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {new Date(
                        inv.invoiceDate || inv.createdAt,
                      ).toLocaleDateString("en-GB")}
                      {inv.type === "quotation" && inv.validUntil && (
                        <div className="text-xs text-gray-400">
                          Until:{" "}
                          {new Date(inv.validUntil).toLocaleDateString("en-GB")}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                      Rs {Number(inv.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-700">
                      Rs {Number(inv.balanceAmount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <PayBadge status={inv.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          title="Preview & Print"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setEditInvoice(inv);
                            setShowModal(true);
                          }}
                          title="Edit"
                          className="p-2 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(inv._id)}
                          title="Delete"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <InvoiceModal
          onClose={() => {
            setShowModal(false);
            setEditInvoice(null);
          }}
          onSave={handleSave}
          orders={orders}
          editData={editInvoice}
          invoiceType={invoiceType}
        />
      )}

      {previewInvoice && (
        <InvoicePreview
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Delete {label}?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
