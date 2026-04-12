import React, { useState, useMemo, useContext, useEffect } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import ProductStats from './ProductStats'
import ProductFilters from './ProductFilters'
import ProductTable from './ProductTable'
import ProductModal from './ProductModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import { Plus } from 'lucide-react'

const ProductPage = () => {
  const { getAllProducts, createProduct, updateProduct, deleteProduct } = useContext(AdminContext)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    isActive: true,
    imageFile: null,
  })

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await getAllProducts()
        if (data && Array.isArray(data)) {
          setProducts(data)
          setError(null)
        } else {
          setError('Invalid product data format')
        }
      } catch (err) {
        setError('Failed to fetch products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [getAllProducts])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && product.isActive) ||
        (filterStatus === 'inactive' && !product.isActive)
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [products, searchTerm, filterStatus, filterCategory])

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle add/edit product
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields')
      return
    }

    if (!editingId && !formData.imageFile) {
      alert('Please select a product image')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', parseInt(formData.price))
      formDataToSend.append('stock', parseInt(formData.stock))
      formDataToSend.append('description', formData.description)
      formDataToSend.append('isActive', formData.isActive)
      
      // Append the image file
      if (formData.imageFile instanceof File) {
        formDataToSend.append('images', formData.imageFile)
      }

      if (editingId) {
        // Update existing product
        await updateProduct(editingId, formDataToSend)
        const updatedProducts = await getAllProducts()
        setProducts(updatedProducts)
      } else {
        // Create new product
        await createProduct(formDataToSend)
        const updatedProducts = await getAllProducts()
        setProducts(updatedProducts)
      }
      
      resetForm()
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message))
    }
  }

  // HandleFile: null
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      isActive: product.isActive,
      images: product.images || [],
    })
    setEditingId(product._id || product.id)
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      const updatedProducts = await getAllProducts()
      setProducts(updatedProducts)
      setDeleteConfirm(null)
    } catch (err) {
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message))
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      isActive: true,
      imageFile: null,
    })
    setEditingId(null)
    setShowModal(false)
  }

  // Calculate statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    lowStock: products.filter(p => p.stock < 50).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage products, inventory, and pricing</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-primary-600 text-black px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white font-medium transition flex items-center gap-2"
          disabled={loading}
        >
          <Plus />
          Add Product
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <i className="fas fa-spinner fa-spin mr-2"></i> Loading products...
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
          <ProductStats stats={stats} />

          {/* Filters Component */}
          <ProductFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Table Component */}
          <ProductTable 
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        </>
      )}

      {/* Product Modal Component */}
      <ProductModal
        isOpen={showModal}
        isEditing={editingId !== null}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={resetForm}
      />

      {/* Delete Confirmation Modal Component */}
      <DeleteConfirmModal
        productId={deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

export default ProductPage