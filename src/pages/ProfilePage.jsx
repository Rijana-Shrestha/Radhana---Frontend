import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Calendar, Edit2, LogOut, Settings } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect if not logged in
  if (!isLoggedIn || !user) {
    return (
      <main className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-md mx-auto text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Not Logged In</h2>
          <p className='text-gray-600 mb-6'>Please log in to view your profile</p>
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

  const handleEditProfile = () => {
    // Navigate to edit profile page (create this later)
    navigate('/edit-profile')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.roles?.includes('ADMIN')

  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Page Header */}
        <section className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>My Profile</h1>
          <p className='text-gray-600'>View and manage your account information</p>
        </section>

        {/* Profile Card */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Header Background */}
          <div className='bg-gradient-to-r from-blue-600 to-pink-500 h-32'></div>

          {/* Profile Content */}
          <div className='px-6 md:px-8 pb-8'>
            {/* Profile Avatar & Actions */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 -mt-16 mb-8'>
              <div className='flex items-end gap-4'>
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className='w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover'
                  />
                ) : (
                  <div className='w-32 h-32 rounded-lg border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg'>
                    <User size={64} className='text-gray-400' />
                  </div>
                )}
                <div className='pt-15'>
                  <h2 className='text-2xl font-bold text-gray-800'>{user.name}</h2>
                  <p className='text-gray-600 text-sm'>
                    {user.roles?.includes('ADMIN') ? '👑 Admin' : '👤 User'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 w-full md:w-auto flex-wrap'>
                {!isAdmin && (
                  <button
                    onClick={handleEditProfile}
                    className='flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/settings')}
                    className='flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition'
                  >
                    <Settings size={18} />
                    Admin Settings
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className='flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition'
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {/* Email */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <Mail size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Email</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.email}</p>
              </div>

              {/* Phone */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <Phone size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Phone</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.phone}</p>
              </div>

              {/* City */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <MapPin size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>City</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.address?.city || 'Not specified'}</p>
              </div>

              {/* Street */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <MapPin size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Street</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.address?.street || 'Not specified'}</p>
              </div>

              {/* Province */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <MapPin size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Province</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.address?.province || 'Not specified'}</p>
              </div>

              {/* Country */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-3 mb-2'>
                  <MapPin size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Country</h3>
                </div>
                <p className='text-gray-600 ml-8'>{user.address?.country || 'Nepal'}</p>
              </div>

              {/* Member Since */}
              <div className='bg-gray-50 p-4 rounded-lg md:col-span-2'>
                <div className='flex items-center gap-3 mb-2'>
                  <Calendar size={20} className='text-blue-600' />
                  <h3 className='font-semibold text-gray-700'>Member Since</h3>
                </div>
                <p className='text-gray-600 ml-8'>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
              <p className='text-xs text-blue-600 font-semibold mb-1'>User ID</p>
              <p className='text-blue-700 font-mono text-sm break-all'>{user._id}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage