import { Edit, Trash } from 'lucide-react'
import React from 'react'

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Badge</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id || product.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.imageUrls[0   ]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">ID: {product._id || product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ₹{product.price} <span className="text-gray-500 text-xs"></span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className={product.stock < 50 ? 'text-yellow-600 font-semibold' : ''}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs  font-semibold ${
                    product.isActive === true 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.isActive === true ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  { (
                    <span className="bg-accent-600 text-black px-2 py-1 rounded text-xs font-semibold">
                      {product.badge?.toUpperCase()|| "Common"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(product._id || product.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
