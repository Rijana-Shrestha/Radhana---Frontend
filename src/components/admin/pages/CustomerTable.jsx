import React from 'react'

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Spent</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers && customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.email} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {customer.totalOrders || customer.orders || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">Rs. {(customer.totalSpent || customer.spent || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : customer.joined || 'N/A'}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-primary-600 hover:text-primary-700 font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(customer._id || customer.id)}
                    className="text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-600">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
