import React from 'react'

const CustomerStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">High Value</p>
        <p className="text-2xl font-bold text-primary-600">{stats.highValue}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Total Spent</p>
        <p className="text-2xl font-bold text-green-600">Rs. {(stats?.totalSpent || 0).toLocaleString()}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 text-sm font-medium mb-1">Avg. Spent</p>
        <p className="text-2xl font-bold text-blue-600">Rs. {(stats?.avgSpent || 0).toLocaleString()}</p>
      </div>
    </div>
  )
}

export default CustomerStats
