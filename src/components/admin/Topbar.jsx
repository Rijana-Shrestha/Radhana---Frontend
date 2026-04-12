import { Bell, Mail } from "lucide-react";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Overview & quick actions" },
  orders: { title: "All Orders", sub: "Manage customer orders" },
  products: {
    title: "Product Management",
    sub: "Add, edit or remove products",
  },
  customers: { title: "Customers", sub: "Customer database" },
  invoices: { title: "Tax Invoices", sub: "Create VAT compliant invoices" },
  estimates: { title: "Estimates", sub: "Create price quotations" },
  reports: { title: "Reports & Analytics", sub: "Sales analytics" },
  settings: { title: "Settings", sub: "Configure your store" },
};

function Topbar({ page }) {
  const info = PAGE_TITLES[page] || { title: page, sub: "" };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div>
        <h1 className="m-0 font-playfair text-2xl text-gray-900">
          {info.title}
        </h1>
        <p className="m-0 font-poppins text-xs text-gray-400 mt-0.5">
          {info.sub}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {[
          { icon: <Bell />, dot: "red" },
          { icon: <Mail />, dot: "#D93A6A" },
        ].map((b, i) => (
          <button
            key={i}
            className="relative p-2 bg-none border-none text-gray-400 cursor-pointer rounded-2xl hover:bg-gray-100 transition-colors"
          >
            {b.icon}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: b.dot }}
            ></span>
          </button>
        ))}
       
      </div>
    </header>
  );
}

export default Topbar;
