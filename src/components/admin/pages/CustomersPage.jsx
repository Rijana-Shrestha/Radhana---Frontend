import React, { useState, useMemo, useContext, useEffect } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import CustomerStats from './CustomerStats'
import CustomerFilters from './CustomerFilters'
import CustomerTable from './CustomerTable'
import CustomerModal from './CustomerModal'

const CustomersPage = () => {
  const { getAllUsers, updateUser, deleteUser } = useContext(AdminContext)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await getAllUsers()
        if (data && Array.isArray(data)) {
          setCustomers(data)
          setError(null)
        } else {
          setError('Invalid customer data format')
        }
      } catch (err) {
        setError('Failed to fetch customers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadUsers()
  }, [getAllUsers])

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      
      return matchesSearch
    })
  }, [customers, searchTerm])

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle edit
  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    })
    setEditingId(customer._id || customer.id)
    setShowModal(true)
  }

  // Handle update customer
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        await updateUser(editingId, formData)
        const updatedCustomers = await getAllUsers()
        setCustomers(updatedCustomers)
      }
      resetForm()
    } catch (err) {
      alert('Failed to update customer: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteUser(id)
        const updatedCustomers = await getAllUsers()
        setCustomers(updatedCustomers)
      } catch (err) {
        alert('Failed to delete customer: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
    })
    setEditingId(null)
    setShowModal(false)
  }

  // Calculate statistics
  const stats = {
    total: customers.length,
    highValue: customers.filter(c => c.totalOrders && c.totalOrders > 5).length || 0,
    totalSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    avgSpent: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length) : 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">View and manage customer information</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <i className="fas fa-spinner fa-spin mr-2"></i> Loading customers...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <i className="fas fa-exclamation-triangle mr-2"></i> {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Stats Component */}
          <CustomerStats stats={stats} />

          {/* Filters Component */}
          <CustomerFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Table Component */}
          <CustomerTable 
            customers={filteredCustomers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Modal */}
      {showModal && (
        <CustomerModal
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          isEditing={editingId !== null}
        />
      )}
    </div>
  )
}

export default CustomersPage
