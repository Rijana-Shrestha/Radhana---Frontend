import { useState, useMemo } from "react";
import StatCard from "../StatCard";
import StatusBadge from "../StatusBadge";
import { BarChart, CircleDollarSign, File, IndianRupee, PlusCircle, ShoppingBag, Star, User } from "lucide-react";


function DashboardPage({ orders, products, users, setPage }) {
  // Calculate dynamic stats
  const stats = useMemo(() => {
    const stats = {
      totalOrders: 0,
      thisMonthOrders: 0,
      totalRevenue: 0,
      thisMonthRevenue: 0,
      thisYearRevenue: 0,
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      avgRating: 0,
      totalReviews: 0,
    };

    // Calculate order-related stats
    if (orders && Array.isArray(orders)) {
      stats.totalOrders = orders.length;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Calculate this month and year revenue
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        stats.totalRevenue += order.totalPrice || 0;

        if (orderMonth === currentMonth && orderYear === currentYear) {
          stats.thisMonthRevenue += order.totalPrice || 0;
          stats.thisMonthOrders += 1;
        }

        if (orderYear === currentYear) {
          stats.thisYearRevenue += order.totalPrice || 0;
        }
      });
    }

    // Calculate customer stats
    if (users && Array.isArray(users)) {
      stats.totalCustomers = users.length;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      users.forEach((user) => {
        const userDate = new Date(user.createdAt);
        const userMonth = userDate.getMonth();
        const userYear = userDate.getFullYear();

        if (userMonth === currentMonth && userYear === currentYear) {
          stats.newCustomersThisMonth += 1;
        }
      });
    }

    // Calculate average rating
    if (orders && Array.isArray(orders)) {
      const ordersWithRating = orders.filter((o) => o.rating);
      if (ordersWithRating.length > 0) {
        const totalRating = ordersWithRating.reduce((sum, o) => sum + o.rating, 0);
        stats.avgRating = (totalRating / ordersWithRating.length).toFixed(1);
        stats.totalReviews = ordersWithRating.length;
      }
    }

    return stats;
  }, [orders, users]);

  // Calculate percentage change (comparing month to month)
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `Rs. ${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs. ${amount.toLocaleString()}`;
  };
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<ShoppingBag />}
          iconBg="#eff6ff"
          iconColor="#145faf"
          badge={getPercentageChange(stats.thisMonthOrders, Math.max(1, stats.totalOrders - stats.thisMonthOrders))}
          badgeColor="#16a34a"
          label="Total Orders"
          value={stats.totalOrders.toString()}
          sub={`${stats.thisMonthOrders} this month`}
        />
        <StatCard
          icon={<IndianRupee />}
          iconBg="#fdf2f8"
          iconColor="#D93A6A"
          badge={getPercentageChange(stats.thisMonthRevenue, Math.max(1, stats.totalRevenue - stats.thisMonthRevenue))}
          badgeColor="#16a34a"
          label="Revenue (Month)"
          value={formatCurrency(stats.thisMonthRevenue)}
          sub={formatCurrency(stats.thisYearRevenue) + " this year"}
        />
        <StatCard
          icon={<User />}
          iconBg="#f0fdf4"
          iconColor="#16a34a"
          badge={getPercentageChange(stats.newCustomersThisMonth, Math.max(1, stats.totalCustomers - stats.newCustomersThisMonth))}
          badgeColor="#16a34a"
          label="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          sub={`${stats.newCustomersThisMonth} new this month`}
        />
        <StatCard
          icon={<Star />}
          iconBg="#fffbeb"
          iconColor="#f59e0b"
          badge="stable"
          badgeColor={null}
          label="Avg. Rating"
          value={`${stats.avgRating}<span style="color:#f59e0b;font-size:22px">★</span>`}
          sub={`from ${stats.totalReviews} reviews`}
        />
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="m-0 font-playfair text-lg text-gray-900">
              Recent Orders
            </h2>
            <button
              onClick={() => setPage("orders")}
              className="bg-none border-none text-primary-600 font-poppins text-xs font-medium cursor-pointer hover:text-primary-700"
            >
              View All <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["Order ID", "Customer", "Amount", "Status", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 font-poppins text-xs font-bold uppercase tracking-widest text-gray-400"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders && Array.isArray(orders) && orders.length > 0 ? (
                  orders.slice(0, 5).map((o, i) => {
                    // Map backend order structure to display fields
                    const orderId = o.orderNumber || o._id || 'N/A';
                    const customer = o.shippingAddress?.firstName || 'Customer';
                    const amount = o.totalPrice || 0;
                    const status = o.status || 'pending';
                    
                    return (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-poppins text-sm font-bold text-primary-600">
                          {orderId}
                        </td>
                        <td className="px-4 py-3 font-poppins text-sm text-gray-700">
                          {customer}
                        </td>
                        <td className="px-4 py-3 font-poppins text-sm font-bold text-gray-900">
                          Rs. {(amount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setPage("orders")}
                            className="bg-none border-none text-primary-600 font-poppins text-xs font-medium cursor-pointer hover:text-primary-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-600">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="m-0 mb-4 font-playfair text-lg text-gray-900">
            Quick Actions
          </h2>
          {[
            {
              label: "New Tax Invoice",
              sub: "Create VAT invoice",
              icon: <CircleDollarSign />,
              bg: "rgba(20,95,175,.05)",
              hoverBg: "#145faf",
              color: "#145faf",
              page: "invoices",
            },
            {
              label: "New Estimate",
              sub: "Create quotation",
              icon: <File />,
              bg: "rgba(217,58,106,.05)",
              hoverBg: "#D93A6A",
              color: "#D93A6A",
              page: "estimates",
            },
            {
              label: "Add Product",
              sub: "Add new item",
              icon: <PlusCircle />,
              bg: "#f0fdf4",
              hoverBg: "#16a34a",
              color: "#15803d",
              page: "products",
            },
            {
              label: "View Reports",
              sub: "Analytics",
              icon: <BarChart />,
              bg: "#fffbeb",
              hoverBg: "#f59e0b",
              color: "#92400e",
              page: "reports",
            },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => setPage(a.page)}
              className="w-full flex items-center gap-3 p-3.5 mb-2.5 rounded-xl border-none cursor-pointer transition-all hover:shadow-md font-poppins"
              style={{
                backgroundColor: a.bg,
                color: a.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = a.hoverBg;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = a.bg;
                e.currentTarget.style.color = a.color;
              }}
            >
              <div className="w-9 h-9 bg-black/10 rounded-lg flex items-center justify-center shrink-0">
                {a.icon}
              </div>
              <div className="text-left">
                <p className="m-0 text-sm font-bold">{a.label}</p>
                <p className="m-0 text-xs opacity-60">{a.sub}</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-xs"></i>
            </button>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="m-0 mb-5 font-playfair text-lg text-gray-900">
          Top Products by Orders
        </h2>
        {products && Array.isArray(products) && products.length > 0 ? (
          products.slice(0, 5).map((product, i) => {
            // Count orders for this product
            const productOrderCount = orders
              .filter((order) =>
                order.items && order.items.some((item) => item.productId === product._id)
              )
              .length;

            // Calculate percentage (out of total orders)
            const percentage = stats.totalOrders > 0
              ? Math.round((productOrderCount / stats.totalOrders) * 100)
              : 0;

            const colors = ["#145faf", "#22c55e", "#D93A6A", "#f59e0b", "#a855f7"];

            return (
              <div key={i} className="flex items-center gap-4 mb-4">
                <span className="font-poppins text-sm text-gray-700 w-40 shrink-0">
                  {product.name || `Product ${i + 1}`}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{
                      width: `${Math.max(percentage, 5)}%`,
                      height: "100%",
                      backgroundColor: colors[i % colors.length],
                      borderRadius: 999,
                    }}
                  ></div>
                </div>
                <span className="font-poppins text-sm font-bold text-gray-900 w-9 text-right">
                  {percentage}%
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
