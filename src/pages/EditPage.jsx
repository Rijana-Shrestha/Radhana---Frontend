import React, { useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { User, Camera, ArrowLeft, AlertCircle } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { axiosInstance } from '../utils/axios'

const EditPage = () => {
    const {id}=useParams();
  const { user, isLoggedIn, fetchUserProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl || null)
  const [selectedFile, setSelectedFile] = useState(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      city: user?.address?.city || '',
      street: user?.address?.street || '',
      province: user?.address?.province || '',
      country: user?.address?.country || 'Nepal',
    }
  })

  // Redirect if not logged in
  if (!isLoggedIn || !user) {
    return (
      <main className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-md mx-auto text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Not Logged In</h2>
          <p className='text-gray-600 mb-6'>Please log in to edit your profile</p>
          <button
            onClick={() => navigate('/login')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  // Redirect if admin (admins cannot edit their profile)
  const isAdmin = user?.roles?.includes('ADMIN')
  if (isAdmin) {
    return (
      <main className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-md mx-auto text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Access Denied</h2>
          <p className='text-gray-600 mb-6'>Admin accounts cannot edit their profile through this interface</p>
          <button
            onClick={() => navigate('/settings')}
            className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition'
          >
            Go to Admin Settings
          </button>
        </div>
      </main>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const fieldName = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [fieldName]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Name is required')
        setLoading(false)
        return
      }

      if (!formData.phone.trim()) {
        setError('Phone number is required')
        setLoading(false)
        return
      }

      // Update user profile data
      await axiosInstance.put(`/users/${user._id}`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address
      })

      // Upload profile image if selected
      if (selectedFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', selectedFile)
        
        await axiosInstance.patch(`/users/${user._id}/profile-image`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      // Refresh user profile
      await fetchUserProfile()

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className='flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6'
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        {/* Page Header */}
        <section className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Edit Profile</h1>
          <p className='text-gray-600'>Update your account information</p>
        </section>

        {/* Success Message */}
        {success && (
          <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3'>
            <div className='w-2 h-2 bg-green-700 rounded-full'></div>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3'>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Edit Form Card */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Header Background */}
          <div className='bg-gradient-to-r from-blue-600 to-pink-500 h-32'></div>

          <form onSubmit={handleSubmit} className='px-6 md:px-8 pb-8'>
            {/* Profile Image Upload */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-16 mb-8'>
              <div className='relative'>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover'
                  />
                ) : (
                  <div className='w-32 h-32 rounded-lg border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg'>
                    <User size={64} className='text-gray-400' />
                  </div>
                )}
                <label
                  htmlFor='profileImage'
                  className='absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg'
                >
                  <Camera size={20} />
                </label>
                <input
                  id='profileImage'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                  disabled={loading}
                />
              </div>

              <div className='text-sm text-gray-600'>
                <p className='font-semibold mb-2'>Profile Picture</p>
                <p>Click the camera icon to upload a new photo</p>
                <p className='text-xs mt-2 text-gray-500'>JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {/* Name */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Full Name *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='John Doe'
                  disabled={loading}
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={user.email}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed'
                  disabled
                />
                <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone Number *
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='+977 9823939106'
                  disabled={loading}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  name='address.city'
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='Kathmandu'
                  disabled={loading}
                />
              </div>

              {/* Street */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Street Address
                </label>
                <input
                  type='text'
                  name='address.street'
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='123 Main Street'
                  disabled={loading}
                />
              </div>

              {/* Province */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Province
                </label>
                <input
                  type='text'
                  name='address.province'
                  value={formData.address.province}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='Bagmati'
                  disabled={loading}
                />
              </div>

              {/* Country */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  name='address.country'
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  placeholder='Nepal'
                  disabled={loading}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 md:gap-6'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/profile')}
                disabled={loading}
                className='flex-1 md:flex-none bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold disabled:bg-gray-200 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default EditPage