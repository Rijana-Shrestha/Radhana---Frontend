import React from 'react'

const CustomerFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredCount, totalCount }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="all">All Customers</option>
          <option value="high-value">High Value</option>
          <option value="regular">Regular</option>
          <option value="new">New</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredCount}</span> of <span className="font-semibold">{totalCount}</span> customers
      </div>
    </div>
  )
}

export default CustomerFilters
