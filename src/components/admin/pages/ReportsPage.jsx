import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  Truck,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { axiosInstance } from "../../../utils/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const COLORS = {
  blue: "#3B82F6",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  teal: "#14B8A6",
  orange: "#F97316",
  indigo: "#6366F1",
  cyan: "#06B6D4",
};

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtShort = (n) =>
  n >= 100000
    ? "₹" + (n / 100000).toFixed(1) + "L"
    : n >= 1000
      ? "₹" + (n / 1000).toFixed(1) + "K"
      : "₹" + n;

const KPICard = ({ title, value, sub, icon: Icon, color, bg }) => (
  <div className={`rounded-2xl p-6 border shadow-sm ${bg}`}>
    <div className="flex items-start justify-between mb-3">
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-xs text-gray-500">{sub}</p>
  </div>
);

const tooltipStyle = {
  backgroundColor: "rgba(15,23,42,0.9)",
  padding: 12,
  borderRadius: 8,
  titleFont: { size: 13, weight: "bold" },
  bodyFont: { size: 12 },
  borderColor: "#334155",
  borderWidth: 1,
};

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("30d"); // '7d' | '30d' | '12m'

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/admin/reports/summary");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg mx-auto mt-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-bold text-red-800 text-lg mb-2">
          Failed to load reports
        </h3>
        <p className="text-red-600 text-sm mb-6">{error}</p>
        <button
          onClick={fetchReports}
          className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition font-semibold"
        >
          Try Again
        </button>
      </div>
    );

  if (!data) return null;

  const {
    totalRevenue = 0,
    paidRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    avgOrderValue = 0,
    deliveredCount = 0,
    pendingCount = 0,
    confirmedCount = 0,
    shippedCount = 0,
    ordersByStatus = [],
    ordersByPaymentMethod = [],
    revenueByPaymentMethod = [],
    monthlyRevenue = [],
    dailyOrders = [],
    topProducts = [],
    newCustomersPerMonth = [],
  } = data;

  // ── Filter daily data by range ───────────────────────────
  const filteredDaily =
    range === "7d" ? dailyOrders.slice(-7) : dailyOrders.slice(-30);
  const filteredMonthly =
    range === "12m" ? monthlyRevenue : monthlyRevenue.slice(-6);

  // ── Monthly Revenue Line Chart ───────────────────────────
  const monthLabels = filteredMonthly.map((m) => {
    const [y, mo] = m.month.split("-");
    return new Date(y, mo - 1).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
  });
  const monthlyRevenueChart = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: filteredMonthly.map((m) => m.revenue),
        borderColor: COLORS.blue,
        backgroundColor: "rgba(59,130,246,0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.blue,
        borderWidth: 2,
      },
      {
        label: "Orders",
        data: filteredMonthly.map(
          (m) => m.orders * (avgOrderValue / 10 || 100),
        ),
        borderColor: COLORS.green,
        backgroundColor: "rgba(16,185,129,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  // ── Daily Orders Bar Chart ───────────────────────────────
  const dailyChart = {
    labels: filteredDaily.map((d) => {
      const dt = new Date(d.date);
      return dt.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Daily Orders",
        data: filteredDaily.map((d) => d.orders),
        backgroundColor: filteredDaily.map((d) =>
          d.orders > 3
            ? COLORS.blue
            : d.orders > 1
              ? "rgba(59,130,246,0.6)"
              : "rgba(59,130,246,0.3)",
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // ── Daily Revenue Line ────────────────────────────────────
  const dailyRevenueChart = {
    labels: filteredDaily.map((d) => {
      const dt = new Date(d.date);
      return dt.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: filteredDaily.map((d) => d.revenue),
        borderColor: COLORS.purple,
        backgroundColor: "rgba(139,92,246,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  // ── Order Status Doughnut ────────────────────────────────
  const statusColors = {
    pending: COLORS.amber,
    confirmed: COLORS.blue,
    shipped: COLORS.teal,
    delivered: COLORS.green,
  };
  const statusDoughnut = {
    labels: ordersByStatus.map(
      (s) => s._id.charAt(0).toUpperCase() + s._id.slice(1),
    ),
    datasets: [
      {
        data: ordersByStatus.map((s) => s.count),
        backgroundColor: ordersByStatus.map(
          (s) => statusColors[s._id] || COLORS.indigo,
        ),
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  // ── Payment Method Pie ────────────────────────────────────
  const methodColors = {
    khalti: "#8B5CF6",
    fonepay: "#3B82F6",
    cod: "#10B981",
    bank: "#F59E0B",
    esewa: "#EF4444",
    cash: "#6B7280",
  };
  const paymentPie = {
    labels: ordersByPaymentMethod.map((m) => m._id.toUpperCase()),
    datasets: [
      {
        data: ordersByPaymentMethod.map((m) => m.count),
        backgroundColor: ordersByPaymentMethod.map(
          (m) => methodColors[m._id] || COLORS.indigo,
        ),
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  // ── Revenue by Payment Method Bar ────────────────────────
  const paymentRevenueBar = {
    labels: revenueByPaymentMethod.map((m) => m._id.toUpperCase()),
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueByPaymentMethod.map((m) => m.revenue),
        backgroundColor: revenueByPaymentMethod.map(
          (m) => methodColors[m._id] || COLORS.indigo,
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // ── Top Products Bar ──────────────────────────────────────
  const topProductsBar = {
    labels: topProducts.map((p) =>
      p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    ),
    datasets: [
      {
        label: "Revenue (₹)",
        data: topProducts.map((p) => p.revenue),
        backgroundColor: [
          COLORS.blue,
          COLORS.green,
          COLORS.purple,
          COLORS.amber,
          COLORS.pink,
          COLORS.teal,
          COLORS.orange,
          COLORS.indigo,
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // ── New Customers Line ────────────────────────────────────
  const custChart = {
    labels: newCustomersPerMonth.map((m) => {
      const [y, mo] = m.month.split("-");
      return new Date(y, mo - 1).toLocaleString("default", { month: "short" });
    }),
    datasets: [
      {
        label: "New Customers",
        data: newCustomersPerMonth.map((m) => m.customers),
        borderColor: COLORS.pink,
        backgroundColor: "rgba(236,72,153,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: COLORS.pink,
        borderWidth: 2,
      },
    ],
  };

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 14, font: { size: 12 } },
      },
      tooltip: tooltipStyle,
    },
  };
  const lineOpts = {
    ...baseOpts,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { callback: (v) => fmtShort(v) },
      },
      x: { grid: { display: false } },
    },
  };
  const barOpts = {
    ...baseOpts,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { callback: (v) => fmtShort(v) },
      },
      x: { grid: { display: false } },
    },
  };
  const donutOpts = {
    ...baseOpts,
    cutout: "65%",
    plugins: {
      ...baseOpts.plugins,
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
      },
    },
  };
  const pieOpts = {
    ...baseOpts,
    plugins: {
      ...baseOpts.plugins,
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 14, font: { size: 12 } },
      },
    },
  };

  const ChartCard = ({
    title,
    sub,
    icon: Icon,
    iconColor,
    children,
    span = 1,
  }) => (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${span === 2 ? "lg:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} className={iconColor} />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-xs text-gray-400 mb-5">{sub}</p>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Analytics & Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Live business insights · Last updated{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1 text-sm">
            {[
              ["7d", "7 Days"],
              ["30d", "30 Days"],
              ["12m", "12 Months"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setRange(v)}
                className={`px-4 py-1.5 rounded-lg font-semibold transition ${range === v ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={fmt(totalRevenue)}
          sub="All orders combined"
          icon={TrendingUp}
          color="bg-blue-500"
          bg="bg-blue-50 border-blue-100"
        />
        <KPICard
          title="Paid Revenue"
          value={fmt(paidRevenue)}
          sub="Confirmed payments only"
          icon={CreditCard}
          color="bg-green-500"
          bg="bg-green-50 border-green-100"
        />
        <KPICard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          sub="All time"
          icon={ShoppingBag}
          color="bg-purple-500"
          bg="bg-purple-50 border-purple-100"
        />
        <KPICard
          title="Avg Order Value"
          value={fmt(avgOrderValue)}
          sub="Per transaction"
          icon={BarChart3}
          color="bg-amber-500"
          bg="bg-amber-50 border-amber-100"
        />
        <KPICard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          sub="Registered users"
          icon={Users}
          color="bg-pink-500"
          bg="bg-pink-50 border-pink-100"
        />
        <KPICard
          title="Pending"
          value={pendingCount}
          sub="Awaiting processing"
          icon={Clock}
          color="bg-orange-400"
          bg="bg-orange-50 border-orange-100"
        />
        <KPICard
          title="Confirmed"
          value={confirmedCount}
          sub="Payment verified"
          icon={CheckCircle}
          color="bg-teal-500"
          bg="bg-teal-50 border-teal-100"
        />
        <KPICard
          title="Delivered"
          value={deliveredCount}
          sub="Successfully fulfilled"
          icon={Truck}
          color="bg-indigo-500"
          bg="bg-indigo-50 border-indigo-100"
        />
      </div>

      {/* Revenue trend + Daily orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Trend"
          sub={`Monthly revenue over ${range === "12m" ? "12" : "6"} months`}
          icon={TrendingUp}
          iconColor="text-blue-500"
        >
          <div className="h-64">
            <Line data={monthlyRevenueChart} options={lineOpts} />
          </div>
        </ChartCard>
        <ChartCard
          title="Daily Orders"
          sub={`Order volume — last ${range === "7d" ? "7" : "30"} days`}
          icon={ShoppingBag}
          iconColor="text-purple-500"
        >
          <div className="h-64">
            <Bar data={dailyChart} options={barOpts} />
          </div>
        </ChartCard>
      </div>

      {/* Daily revenue + Customer growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Daily Revenue"
          sub={`Revenue breakdown — last ${range === "7d" ? "7" : "30"} days`}
          icon={CreditCard}
          iconColor="text-violet-500"
        >
          <div className="h-64">
            <Line data={dailyRevenueChart} options={lineOpts} />
          </div>
        </ChartCard>
        <ChartCard
          title="New Customers"
          sub="Monthly customer registrations"
          icon={Users}
          iconColor="text-pink-500"
        >
          <div className="h-64">
            <Line
              data={custChart}
              options={{
                ...lineOpts,
                scales: {
                  ...lineOpts.scales,
                  y: { ...lineOpts.scales.y, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>
        </ChartCard>
      </div>

      {/* Order status + Payment method */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Order Status"
          sub="Distribution by status"
          icon={Package}
          iconColor="text-amber-500"
        >
          <div className="h-64">
            <Doughnut data={statusDoughnut} options={donutOpts} />
          </div>
        </ChartCard>
        <ChartCard
          title="Payment Methods"
          sub="Orders by payment type"
          icon={CreditCard}
          iconColor="text-green-500"
        >
          <div className="h-64">
            <Pie data={paymentPie} options={pieOpts} />
          </div>
        </ChartCard>
        <ChartCard
          title="Revenue by Method"
          sub="How revenue arrives by gateway"
          icon={TrendingUp}
          iconColor="text-indigo-500"
        >
          <div className="h-64">
            <Bar data={paymentRevenueBar} options={barOpts} />
          </div>
        </ChartCard>
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <ChartCard
          title="Top Products by Revenue"
          sub="Best performing products"
          icon={ShoppingBag}
          iconColor="text-blue-500"
          span={2}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72">
              <Bar
                data={topProductsBar}
                options={{
                  ...barOpts,
                  indexAxis: "y",
                  plugins: { ...barOpts.plugins, legend: { display: false } },
                }}
              />
            </div>
            <div className="overflow-y-auto h-72">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-semibold">
                      #
                    </th>
                    <th className="text-left py-2 text-gray-500 font-semibold">
                      Product
                    </th>
                    <th className="text-right py-2 text-gray-500 font-semibold">
                      Qty
                    </th>
                    <th className="text-right py-2 text-gray-500 font-semibold">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-2.5 pr-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-gray-200 text-gray-600"}`}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2.5 font-medium text-gray-700 max-w-[140px] truncate">
                        {p.name}
                      </td>
                      <td className="py-2.5 text-right text-gray-500">
                        {p.quantity}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-gray-800">
                        {fmt(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ChartCard>
      )}

      {/* Order status table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package size={18} className="text-amber-500" /> Order Status
          Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                  Count
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                  Share
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold w-48">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersByStatus.map((s, i) => {
                const pct =
                  totalOrders > 0
                    ? ((s.count / totalOrders) * 100).toFixed(1)
                    : 0;
                const color = statusColors[s._id] || COLORS.indigo;
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 font-medium capitalize text-gray-700">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        {s._id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {s.count}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{pct}%</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pt-2">
        📊 Live data · Auto-refreshes on page load ·{" "}
        {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default ReportsPage;
