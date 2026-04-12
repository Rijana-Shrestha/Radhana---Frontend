import { useContext, useEffect, useState } from "react";
import {
  Sidebar,
  Topbar,
  Toast,
  DashboardPage,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from "../components/admin";
import OrderPage from "../components/admin/pages/OrderPage";
import ProductPage from "../components/admin/pages/ProductPage";
import CustomersPage from "../components/admin/pages/CustomersPage";
import GalleryPage from "../components/admin/pages/GalleryPage";
import ContactsPage from "../components/admin/pages/ContactsPage";
import InvoicePage from "../components/admin/pages/InvoicePage";
import QuotationPage from "../components/admin/pages/QuotationPage";
import ReportsPage from "../components/admin/pages/ReportsPage";
import SettingsPage from "../components/admin/pages/SettingsPage";
import { AdminContext } from "../context/AdminContext";

function AdminDashboard() {
  const { getAllOrders, getAllUsers, getAllProducts } =
    useContext(AdminContext);
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [dashboardStats, setDashboardStats] = useState(null);

  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load orders
        const ordersData = await getAllOrders();
        if (ordersData && Array.isArray(ordersData)) {
          setOrders(ordersData);
        }

        // Load users
        const usersData = await getAllUsers();
        if (usersData && Array.isArray(usersData)) {
          setUsers(usersData);
        }

        // Load products
        const productsData = await getAllProducts();
        if (productsData && Array.isArray(productsData)) {
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    loadData();
  }, []);

  const sidebarWidth = collapsed ? 70 : 260;

  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setPage={setActivePage}
      />

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Topbar */}
        <Topbar page={activePage} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {activePage === "dashboard" && (
            <DashboardPage
              orders={orders}
              products={products}
              users={users}
              setPage={setActivePage}
            />
          )}

          {/* More pages coming soon */}
          {activePage === "orders" && (
            <OrderPage orders={orders} setPage={setActivePage} />
          )}
          {activePage === "products" && <ProductPage />}
          {activePage === "customers" && <CustomersPage />}
          {activePage === "gallery" && <GalleryPage />}
          {activePage === "contacts" && <ContactsPage />}
          {activePage === "invoices" && <InvoicePage />}
          {activePage === "estimates" && <QuotationPage />}
          {activePage === "reports" && <ReportsPage />}
          {activePage === "settings" && (
            <SettingsPage />
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <Toast msg={toastMsg} visible={showToast} />
    </div>
  );
}

export default AdminDashboard;
