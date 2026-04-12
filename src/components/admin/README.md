# Admin Dashboard - Modular Component Structure

This documentation explains the new modular structure of the AdminDashboard and how to use the components.

## 📁 Folder Structure

```
src/
├── components/
│   └── admin/
│       ├── index.js                 # Main export file
│       ├── Sidebar.jsx              # Navigation sidebar
│       ├── Topbar.jsx               # Header with page title
│       ├── StatusBadge.jsx           # Status badge component
│       ├── Toast.jsx                # Toast notifications
│       ├── ActionBtn.jsx             # Action button with hover effects
│       ├── StatCard.jsx              # Statistics card
│       ├── ItemRow.jsx               # Invoice/Estimate item row
│       ├── constants.js              # Global constants and data
│       ├── utils.js                  # Utility functions
│       └── pages/
│           ├── DashboardPage.jsx    # Dashboard overview
│           ├── OrdersPage.jsx        # Orders management (TODO)
│           ├── ProductsPage.jsx      # Products management (TODO)
│           ├── CustomersPage.jsx     # Customers table (TODO)
│           ├── InvoicesPage.jsx      # Invoice creation (TODO)
│           ├── EstimatesPage.jsx     # Estimates creation (TODO)
│           ├── ReportsPage.jsx       # Analytics & reports (TODO)
│           └── SettingsPage.jsx      # Settings management (TODO)
└── pages/
    └── AdminDashboard.jsx            # Main dashboard container
```

## 🎯 Key Components

### Sidebar
- **File**: `components/admin/Sidebar.jsx`
- **Purpose**: Navigation menu with collapsible state
- **Props**: `collapsed`, `setCollapsed`, `activePage`, `setPage`
- **Styling**: Tailwind CSS
- **Features**: Collapse/expand, active page highlight, badges

### Topbar
- **File**: `components/admin/Topbar.jsx`
- **Purpose**: Header showing page title and notifications
- **Props**: `page`
- **Styling**: Tailwind CSS
- **Features**: Dynamic page titles, notification icons

### StatusBadge
- **File**: `components/admin/StatusBadge.jsx`
- **Purpose**: Displays order/payment status with color coding
- **Props**: `status`
- **Supports**: Pending, Processing, Completed, Cancelled, Unpaid

### Toast
- **File**: `components/admin/Toast.jsx`
- **Purpose**: Fixed toast notification
- **Props**: `msg`, `visible`
- **Styling**: Tailwind CSS + animations

### StatCard
- **File**: `components/admin/StatCard.jsx`
- **Purpose**: Displays statistics with icon and badge
- **Props**: `icon`, `iconBg`, `iconColor`, `badge`, `label`, `value`, `sub`
- **Styling**: Tailwind CSS

### DashboardPage
- **File**: `components/admin/pages/DashboardPage.jsx`
- **Purpose**: Dashboard overview with stats, recent orders, quick actions
- **Props**: `orders`, `setPage`

### ItemRow
- **File**: `components/admin/ItemRow.jsx`
- **Purpose**: Row for invoice/estimate items
- **Props**: `item`, `onChange`, `onRemove`

## 🎨 Tailwind CSS Configuration

Custom theme extended in `tailwind.config.js`:
- Custom colors: primary, accent, success, warning, danger
- Custom fonts: Poppins, Playfair Display
- Custom shadows: sm, md, lg, xl
- Custom letter-spacing and z-index values

## 📦 Utility Functions

Located in `components/admin/utils.js`:
- `numToWords(n)` - Convert numbers to words
- `today()` - Get today's date
- `daysAhead(d)` - Get date d days ahead

## 🗂️ Global Constants

Located in `components/admin/constants.js`:
- `INITIAL_ORDERS` - Sample orders data
- `INITIAL_PRODUCTS` - Sample products data
- `SAMPLE_CUSTOMERS` - Sample customers data
- `TOP_PRODUCTS` - Top products for dashboard
- `REPORT_CATEGORIES` - Categories for reports
- `MONTHLY_REPORTS` - Monthly report data

## 🚀 How to Use

### Import Components

```jsx
import {
  Sidebar,
  Topbar,
  StatusBadge,
  Toast,
  DashboardPage,
  INITIAL_ORDERS,
} from "../components/admin";
```

### Use in Main Component

```jsx
function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setPage={setActivePage}
      />
      <main className="flex-1">
        <Topbar page={activePage} />
        {/* Page content */}
      </main>
    </div>
  );
}
```

## 📝 TODO - Components to Extract (Next Steps)

- [ ] `OrdersPage.jsx` - Orders table with search, filter, and modal
- [ ] `ProductsPage.jsx` - Product management with modals
- [ ] `CustomersPage.jsx` - Customers table
- [ ] `InvoicesPage.jsx` - Invoice creation and preview
- [ ] `EstimatesPage.jsx` - Estimates creation and preview
- [ ] `ReportsPage.jsx` - Analytics and reports
- [ ] `SettingsPage.jsx` - Settings management

## 🎨 Styling Notes

All components use **Tailwind CSS** exclusively:
- No inline styles except for dynamic values
- Color variables from custom theme
- Responsive design with Tailwind breakpoints
- Smooth transitions and hover effects

## 💡 Best Practices

1. **Keep components focused** - Each component does one thing well
2. **Use Tailwind for styling** - Avoid inline styles when possible
3. **Extract pages as separate files** - Keep the main component clean
4. **Centralize data** - Use constants.js for global data
5. **Use utilities** - Leverage utils.js for common functions

## 🔄 Migration Status

✅ **Completed:**
- Sidebar, Topbar, StatusBadge, Toast
- ActionBtn, StatCard, ItemRow
- DashboardPage
- Constants, utilities
- Tailwind configuration

⏳ **In Progress:**
- Refactoring main AdminDashboard.jsx

📋 **Pending:**
- Extract remaining page components
- Add remaining pages functionality
- Test all components integration

---

**Original file backup**: `AdminDashboard.jsx.backup` (contains old code for reference)
