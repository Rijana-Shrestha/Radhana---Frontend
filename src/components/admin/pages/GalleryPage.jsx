import React, { useState, useMemo, useContext, useEffect } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import ImageSelector from '../ImageSelector'

const GalleryPage = () => {
  const { getAllGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } = useContext(AdminContext)
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    imageUrl: '',
    imageFile: null,
    description: '',
    isActive: true,
  })

  // Fetch gallery items on component mount
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true)
        const data = await getAllGallery()
        if (data && Array.isArray(data)) {
          setGalleryItems(data)
          setError(null)
        } else {
          setError('Invalid gallery data format')
        }
      } catch (err) {
        setError('Failed to fetch gallery items')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadGallery()
  }, [getAllGallery])

  // Filter gallery items
  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSearch
    })
  }, [galleryItems, searchTerm])

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle image change
  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageFile: imageData
    }))
  }

  // Handle add/edit gallery item
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category || !formData.imageFile) {
      alert('Please fill in all required fields including an image')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('cat', formData.category)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('isActive', formData.isActive)
      
      // Append the image file
      if (formData.imageFile instanceof File) {
        formDataToSend.append('images', formData.imageFile)
      }

      if (editingId) {
        // Update existing item
        await updateGalleryItem(editingId, formDataToSend)
        const updatedItems = await getAllGallery()
        setGalleryItems(updatedItems)
      } else {
        // Create new item
        await createGalleryItem(formDataToSend)
        const updatedItems = await getAllGallery()
        setGalleryItems(updatedItems)
      }
      
      resetForm()
    } catch (err) {
      alert('Failed to save gallery item: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handle edit
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrls?.[0] || '',
      imageFile: null,
      description: item.description || '',
      isActive: item.isActive,
    })
    setEditingId(item._id || item.id)
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await deleteGalleryItem(id)
        const updatedItems = await getAllGallery()
        setGalleryItems(updatedItems)
      } catch (err) {
        alert('Failed to delete gallery item: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      imageUrl: '',
      imageFile: null,
      description: '',
      isActive: true,
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Manage gallery items and showcase</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-gray-200 hover:bg-gray-700 hover:text-white text-black px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          Loading gallery items...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item._id || item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="relative overflow-hidden h-40 bg-gray-100">
                  <img 
                    src={item.imageUrls?.[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27300%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27300%27 height=%27300%27/%3E%3C/svg%3E'}
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold">
                    {item.isActive ? '✓ Active' : '✗ Inactive'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-semibold">No gallery items found</p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <ImageSelector 
                image={formData.imageUrl || formData.imageFile}
                onImageChange={handleImageChange}
                label="Gallery Image *"
                preview={true}
                returnFile={true}
              />

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-800">Active</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryPage
