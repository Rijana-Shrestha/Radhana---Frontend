# ProductPage Components

Modular components structure for the Product Management page in the admin dashboard.

## 📂 Folder Structure

```
pages/
├── ProductPage.jsx          # Main container component
├── ProductStats.jsx         # Statistics cards (Total, Active, Inactive, Low Stock)
├── ProductFilters.jsx       # Search and filter UI
├── ProductTable.jsx         # Products table display
├── ProductModal.jsx         # Add/Edit product modal
├── DeleteConfirmModal.jsx   # Delete confirmation dialog
└── index.js                 # Barrel export file
```

## 🎯 Components Overview

### ProductPage.jsx (Main Container)
- Manages all state (products, filters, modals)
- Handles CRUD operations (Create, Read, Update, Delete)
- Orchestrates all sub-components
- **Key Props:** None (standalone page)

### ProductStats.jsx
- Displays 4 statistics cards
- Shows: Total Products, Active, Inactive, Low Stock
- **Props:** `stats` object with total, active, inactive, lowStock

### ProductFilters.jsx
- Search input for product names
- Category dropdown filter
- Status dropdown filter
- Shows filtered results count
- **Props:** searchTerm, setSearchTerm, filterCategory, setFilterCategory, filterStatus, setFilterStatus, filteredCount, totalCount

### ProductTable.jsx
- Displays products in table format
- Shows: Product image, name, category, price, stock, status, badge
- Edit and Delete action buttons
- **Props:** products array, onEdit callback, onDelete callback

### ProductModal.jsx
- Add/Edit product form
- Form fields: name, category, price, maxPrice, stock, badge, status, image
- Input validation messages
- **Props:** isOpen, isEditing, formData, onInputChange, onSubmit, onClose

### DeleteConfirmModal.jsx
- Confirmation dialog before deletion
- Shows warning message
- Confirm/Cancel buttons
- **Props:** productId, onConfirm callback, onCancel callback

## 🔄 Data Flow

```
ProductPage (State Manager)
├── ProductStats (Display Only)
├── ProductFilters (Update Filters)
├── ProductTable (Display + Actions)
├── ProductModal (Add/Edit Product)
└── DeleteConfirmModal (Delete Confirmation)
```

## ✨ Features

- ✅ Display products from INITIAL_PRODUCTS constant
- ✅ Add new products with auto-generated ID
- ✅ Edit existing products
- ✅ Delete products with confirmation
- ✅ Search by product name
- ✅ Filter by category and status
- ✅ Show statistics (total, active, inactive, low stock alerts)
- ✅ Responsive design (mobile & desktop)
- ✅ Tailwind CSS styling
- ✅ Form validation

## 🚀 Usage

```jsx
import ProductPage from '../components/admin/pages/ProductPage'

// In AdminDashboard or any parent component:
{activePage === "products" && <ProductPage />}
```

## 📋 Product Data Structure

```javascript
{
  id: 1,
  name: "Wooden Photo Engraving",
  category: "wooden",
  price: 500,
  maxPrice: 2000,
  stock: 99,
  badge: "Popular",
  status: "active",
  image: "https://..."
}
```

## 🎨 Styling

- All components use Tailwind CSS
- Color scheme: primary (#145faf), accent (#D93A6A)
- Responsive breakpoints: sm, md, lg
- Custom shadows and rounded corners
- Font: Poppins (sans-serif)

## 📝 Notes

- Each component is single-responsibility
- Easy to test and maintain
- Props are clearly documented
- All state logic centralized in ProductPage
- Modal components are reusable

## ✅ TODO

- [ ] Connect to backend API for products
- [ ] Add bulk action capabilities
- [ ] Implement product image upload
- [ ] Add sorting by price/stock
- [ ] Implement pagination for large product lists
- [ ] Add export to CSV functionality
