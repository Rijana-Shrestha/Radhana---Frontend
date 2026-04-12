import React from 'react'

const ProductStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Active</p>
        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Inactive</p>
        <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Low Stock</p>
        <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
      </div>
    </div>
  )
}

export default ProductStats
