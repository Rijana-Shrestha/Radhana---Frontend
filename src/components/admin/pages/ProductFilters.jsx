import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axios";

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filteredCount,
  totalCount,
}) => {
  const [categories, setCategories] = useState([]);
  const statuses = ["all", "active", "inactive", "discontinued"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.map((c) => c.name));
      } catch {
        // fallback to defaults
        setCategories([
          "wooden",
          "qr",
          "keyring",
          "award",
          "numberplate",
          "signboard",
        ]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        {/* Category Filter — dynamically loaded from DB */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "all"
                ? "All Status"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredCount}</span> of{" "}
        <span className="font-semibold">{totalCount}</span> products
      </div>
    </div>
  );
};

export default ProductFilters;
