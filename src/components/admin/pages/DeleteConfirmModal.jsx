import React from 'react'

const DeleteConfirmModal = ({ productId, onConfirm, onCancel }) => {
  if (!productId) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(productId)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
