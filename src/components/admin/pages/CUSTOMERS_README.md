# Customers Page Components

## Overview
The CustomersPage is a modular customer management system for the admin dashboard. It follows the same architectural pattern as ProductPage with separated, reusable components.

## Folder Structure
```
pages/
├── CustomersPage.jsx          # Main container component
├── CustomerStats.jsx          # Statistics cards display
├── CustomerFilters.jsx        # Search and filter controls
├── CustomerTable.jsx          # Customer list table
├── CustomerModal.jsx          # Add/Edit customer form
├── index.js                   # Barrel exports for clean imports
└── README.md                  # This file
```

## Components

### CustomersPage.jsx
**Purpose:** Main container managing customer state and business logic

**Key Features:**
- Manages customer data from `SAMPLE_CUSTOMERS` constants
- State management: customers, searchTerm, filterStatus, showModal, editingId, formData
- Filtering by name, email, phone with category (All, High-Value, Regular, New)
- CRUD operations: Add, Edit, Delete customers
- Calculate statistics: Total, High-Value count, Total Spent, Average Spent

**Props:** None (self-contained)

**Sample Usage:**
```jsx
import CustomersPage from './pages/CustomersPage'

<CustomersPage />
```

---

### CustomerStats.jsx
**Purpose:** Reusable statistics display component

**Features:**
- 4 stat cards: Total Customers, High Value, Total Spent, Average Spent
- Color-coded values for visual distinction
- Responsive grid layout

**Props:**
```jsx
stats: {
  total: number,
  highValue: number,
  totalSpent: number,
  avgSpent: number
}
```

**Sample Usage:**
```jsx
<CustomerStats stats={{
  total: 5,
  highValue: 2,
  totalSpent: 108700,
  avgSpent: 21740
}} />
```

---

### CustomerFilters.jsx
**Purpose:** Centralized filter and search controls

**Features:**
- Search input (name, email, phone)
- Status filter dropdown (All, High-Value, Regular, New)
- Results count display
- Responsive layout

**Props:**
- `searchTerm: string` - Current search text
- `setSearchTerm: function` - Update search
- `filterStatus: string` - Current status filter
- `setFilterStatus: function` - Update status filter
- `filteredCount: number` - Number of filtered results
- `totalCount: number` - Total customers

**Sample Usage:**
```jsx
<CustomerFilters 
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  filterStatus={filterStatus}
  setFilterStatus={setFilterStatus}
  filteredCount={3}
  totalCount={5}
/>
```

---

### CustomerTable.jsx
**Purpose:** Customer list display with action buttons

**Features:**
- 7-column table: Name, Email, Phone, Orders, Spent, Joined, Actions
- Order count badge (blue)
- Edit and Delete action buttons
- Hover effects
- Empty state handling

**Props:**
- `customers: array` - Array of customer objects
- `onEdit: function` - Called when edit button clicked
- `onDelete: function` - Called when delete button clicked

**Customer Object Structure:**
```jsx
{
  name: "Ramesh Shrestha",
  email: "ramesh@gmail.com",
  phone: "+977 9812345678",
  orders: 8,
  spent: 24500,
  joined: "Jan 2024"
}
```

**Sample Usage:**
```jsx
<CustomerTable 
  customers={filteredCustomers}
  onEdit={(customer) => handleEdit(customer)}
  onDelete={(customer) => handleDelete(customer)}
/>
```

---

### CustomerModal.jsx
**Purpose:** Add/Edit customer form in modal dialog

**Features:**
- Form fields: Name, Email, Phone, Orders, Spent, Joined Date
- Required field validation
- Edit vs Add mode toggle
- Close button and backdrop click
- Submit, Cancel, Update buttons

**Props:**
- `isOpen: boolean` - Show/hide modal
- `isEditing: boolean` - Is in edit mode
- `formData: object` - Form data object
- `onInputChange: function` - Handle input changes
- `onSubmit: function` - Handle form submission
- `onClose: function` - Handle modal close

**Sample FormData Structure:**
```jsx
{
  name: "Ramesh Shrestha",
  email: "ramesh@gmail.com",
  phone: "+977 9812345678",
  orders: "8",
  spent: "24500",
  joined: "Jan 2024"
}
```

**Sample Usage:**
```jsx
<CustomerModal
  isOpen={showModal}
  isEditing={editingId !== null}
  formData={formData}
  onInputChange={handleInputChange}
  onSubmit={handleSubmit}
  onClose={resetForm}
/>
```

---

## Integration with AdminDashboard

The CustomersPage is integrated into AdminDashboard and accessible via the sidebar:

```jsx
import CustomersPage from '../components/admin/pages/CustomersPage'

// In AdminDashboard component:
{activePage === "customers" && <CustomersPage />}
```

---

## Data Source

Customer data comes from `SAMPLE_CUSTOMERS` in `constants.js`:
- 5 sample customers with full details
- Expandable to connect to backend API

---

## Features

✅ Display customers from dummy data  
✅ Add new customers  
✅ Edit existing customers  
✅ Delete customers with confirmation  
✅ Search by name, email, or phone  
✅ Filter by customer segment (High-Value, Regular, New)  
✅ Show customer statistics  
✅ Responsive design with Tailwind CSS  
✅ Form validation for required fields  
✅ Modular component architecture  

---

## TODO / Future Enhancements

- [ ] Connect to backend API endpoint `/api/customers`
- [ ] Add customer profile modal with order history
- [ ] Implement customer segmentation analytics
- [ ] Export customer list to CSV
- [ ] Bulk customer actions (delete, update status)
- [ ] Customer activity timeline
- [ ] Advanced filtering (date ranges, spending ranges)
- [ ] Pagination for large customer lists
- [ ] Customer communication/notes
- [ ] Import customers from CSV

---

## Styling

All components use Tailwind CSS with custom theme:
- Primary color: `#145faf`
- Accent color: `#D93A6A`
- Uses custom theme defined in `tailwind.config.js`
- Responsive breakpoints: sm, md, lg, xl

---

## Notes

- Each customer uses array index for identification (since no unique ID in SAMPLE_CUSTOMERS)
- Stats calculate dynamically from customer data
- All validations are client-side (no backend yet)
- Time format uses "Mon YYYY" pattern (e.g., "Jan 2024")
