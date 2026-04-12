import React, { useState, useMemo, useContext } from 'react'
import { StatusBadge, Toast } from '../index'
import { INITIAL_ORDERS } from '../constants'
import { AdminContext } from '../../../context/AdminContext'

const OrderPage = ({orders}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'success' })

  const statuses = ['all', 'pending', 'delivered']
  const {updateOrderStatus}= useContext(AdminContext);
  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    return orders.filter(order => {
      const orderNumber = order.orderNumber || order._id || '';
      const customer = order.shippingAddress?.firstName || '';
      const status = (order.status || 'pending').toLowerCase();
      
      const matchesSearch = 
        orderNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shippingAddress?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || status === filterStatus.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, filterStatus])

  // Calculate statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length || 0,
    delivered: orders?.filter(o => (o.status || 'pending').toLowerCase() === 'delivered').length || 0,
    totalAmount: orders?.reduce((sum, o) => sum + (o.totalPrice || 0), 0) || 0,
  }

  // Show toast notification
  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type })
    setTimeout(() => setToast({ visible: false, msg: '', type: 'success' }), 3000)
  }

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      await updateOrderStatus(selectedOrder._id, 'delivered')
      showToast('Order status updated to delivered successfully!', 'success')
      setShowConfirm(false)
      setSelectedOrder(null)
    } catch (error) {
      showToast(error.message || 'Failed to update order status', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Track and manage all customer orders</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Delivered</p>
          <p className="text-2xl font-bold text-blue-600">{stats.delivered}</p>
        </div>
        
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Product..."
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const orderId = order.orderNumber || order._id || '';
                const customer = order.shippingAddress?.firstName || 'N/A';
                const email = order.shippingAddress?.email || 'N/A';
                const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                const amount = order.totalPrice || 0;
                const status = order.status || 'pending';
                const itemCount = order.orderItems?.length || 0;
                  console.log(status)
                return (
                  <tr key={order._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rs. {(amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder.orderNumber || selectedOrder._id || 'N/A'}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                disabled={isUpdating}
                className="text-gray-400 hover:text-gray-600 text-2xl disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Customer Name</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.shippingAddress?.firstName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Phone</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.shippingAddress?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Order Date</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Items</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.orderItems?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Amount</p>
                  <p className="text-gray-900 font-semibold text-lg">Rs. {(selectedOrder.totalPrice || 0).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
                  <StatusBadge status={selectedOrder.status || 'pending'} />
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-sm font-medium mb-1">Shipping Address</p>
                  <p className="text-gray-900 font-semibold text-sm">
                    {selectedOrder.shippingAddress?.street || 'N/A'}, {selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.country || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={()=>setShowConfirm(true)}
                  disabled={isUpdating || selectedOrder.status?.toLowerCase() === 'delivered'}
                  className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    isUpdating || selectedOrder.status?.toLowerCase() === 'delivered'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Updating...
                    </>
                  ) : selectedOrder.status?.toLowerCase() === 'delivered' ? (
                    'Already Delivered'
                  ) : (
                    'Mark as Delivered'
                  )}
                </button>
                
                <button 
                  onClick={()=>setSelectedOrder(null)} 
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
                <span className="text-orange-600 text-xl">⚠</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Confirm Status Update</h3>
              <p className="text-gray-600 text-center mb-6">
                Mark order <span className="font-semibold">{selectedOrder.orderNumber || selectedOrder._id}</span> as delivered?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Updating...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        msg={toast.msg} 
        visible={toast.visible}
      />
    </div>
  )
}

export default OrderPage