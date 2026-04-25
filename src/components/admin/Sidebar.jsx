import {
  BarChart,
  DollarSign,
  File,
  LayoutDashboard,
  ListOrdered,
  Package,
  Settings,
  User,
  Image,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed, activePage, setPage }) {
  const w = collapsed ? 70 : 260;
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard />,
      label: "Dashboard",
      section: "Main",
    },
    {
      id: "orders",
      icon: <ListOrdered />,
      label: "Orders",
      badge: "",
      section: null,
    },
    { id: "products", icon: <Package />, label: "Products", section: null },
    {
      id: "customers",
      icon: <User />,
      label: "Customers",
      section: null,
    },
    {
      id: "gallery",
      icon: <Image />,
      label: "Gallery",
      section: "Content",
    },
    {
      id: "contacts",
      icon: <MessageSquare />,
      label: "Contact Messages",
      section: null,
    },
    {
      id: "invoices",
      icon: <DollarSign />,
      label: "Tax Invoices",
      section: "Finance",
    },
    {
      id: "quotations",
      icon: <File />,
      label: "Quotations",
      section: null,
    },
    {
      id: "reports",
      icon: <BarChart />,
      label: "Reports",
      section: null,
    },
    {
      id: "settings",
      icon: <Settings />,
      label: "Settings",
      section: "Config",
    },
  ];

  return (
    <aside
      className="fixed top-0 left-0  h-screen bg-gradient-to-b from-gray-900 to-slate-900 flex flex-col z-50 overflow-hidden transition-all duration-300"
      style={{ width: w }}
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <img
              src="/fonts/assets/Logo.png"
              alt="Radhana Art Logo"
              className="w-24 mb-1"
            />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-poppins font-semibold text-sm m-0">
                Radhana Art
              </p>
              <p className="text-gray-400 font-poppins text-xs m-0">
                Admin Panel
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-none border-none text-gray-400 cursor-pointer p-1 flex-shrink-0 hover:text-white transition-colors"
        >
          <i className="fas fa-bars text-sm"></i>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item, i) => (
          <div key={item.id}>
            {item.section && !collapsed && (
              <p className="text-gray-500 font-poppins text-xs font-bold uppercase tracking-wider px-2 py-4 m-0">
                {item.section}
              </p>
            )}
            <button
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-poppins text-sm font-medium cursor-pointer transition-all mb-0.5 border-l-4 ${
                activePage === item.id
                  ? "bg-primary-600/25 text-white border-accent-600"
                  : "text-gray-400 border-transparent hover:bg-white/10 hover:text-white"
              }`}
              onMouseEnter={(e) => {
                if (activePage !== item.id) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,.07)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (activePage !== item.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#9ca3af";
                }
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-accent-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 mb-2.5">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            className="w-8 h-8 rounded-full flex-shrink-0"
            alt="admin"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-poppins text-sm font-semibold m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {user ? user.name : "Admin User"}
              </p>
              <p className="text-gray-400 font-poppins text-xs m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {user ? user.email : "Not logged in"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
