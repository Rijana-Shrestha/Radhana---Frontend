import React, { useContext } from 'react'
import { User, Mail, Phone, MapPin, Calendar, LogOut } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Loading profile information...</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex justify-between items-center'>
        <div>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Settings</h1>
        <p className='text-gray-600'>Manage your admin profile and preferences</p>
      </div>
      <Link to="/" className='text-blue-600 hover:text-blue-800 font-semibold'>
        View Store
      </Link>
      </div>

      {/* Admin Profile Card */}
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Header Background */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 h-32'></div>

        {/* Profile Content */}
        <div className='px-6 md:px-8 pb-8'>
          {/* Profile Avatar & Basic Info */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-16 mb-8'>
            <div className='flex items-end gap-4'>
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className='w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover'
                />
              ) : (
                <div className='w-32 h-32 rounded-lg border-4 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow-lg'>
                  <User size={64} className='text-blue-600' />
                </div>
              )}
              <div className=''>
                <h2 className='text-3xl  font-bold text-gray-800'>{user.name}</h2>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                    👑 Admin
                  </span>
                  {user.roles?.includes('ADMIN') && (
                    <span className='text-xs text-purple-600 font-semibold'>Administrator</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 w-full md:w-auto'>
              <button
                onClick={handleLogout}
                className='flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold'
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Email */}
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200'>
              <div className='flex items-center gap-3 mb-2'>
                <Mail size={20} className='text-blue-600' />
                <h3 className='font-semibold text-gray-700'>Email Address</h3>
              </div>
              <p className='text-gray-800 ml-8 break-all'>{user.email}</p>
            </div>

            {/* Phone */}
            <div className='bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200'>
              <div className='flex items-center gap-3 mb-2'>
                <Phone size={20} className='text-green-600' />
                <h3 className='font-semibold text-gray-700'>Phone Number</h3>
              </div>
              <p className='text-gray-800 ml-8'>{user.phone}</p>
            </div>

            {/* City */}
            <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200'>
              <div className='flex items-center gap-3 mb-2'>
                <MapPin size={20} className='text-purple-600' />
                <h3 className='font-semibold text-gray-700'>City</h3>
              </div>
              <p className='text-gray-800 ml-8'>{user.address?.city || 'Not specified'}</p>
            </div>

            {/* Street */}
            <div className='bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-lg border border-pink-200'>
              <div className='flex items-center gap-3 mb-2'>
                <MapPin size={20} className='text-pink-600' />
                <h3 className='font-semibold text-gray-700'>Street Address</h3>
              </div>
              <p className='text-gray-800 ml-8'>{user.address?.street || 'Not specified'}</p>
            </div>

            {/* Province */}
            <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200'>
              <div className='flex items-center gap-3 mb-2'>
                <MapPin size={20} className='text-orange-600' />
                <h3 className='font-semibold text-gray-700'>Province</h3>
              </div>
              <p className='text-gray-800 ml-8'>{user.address?.province || 'Not specified'}</p>
            </div>

            {/* Country */}
            <div className='bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-lg border border-cyan-200'>
              <div className='flex items-center gap-3 mb-2'>
                <MapPin size={20} className='text-cyan-600' />
                <h3 className='font-semibold text-gray-700'>Country</h3>
              </div>
              <p className='text-gray-800 ml-8'>{user.address?.country || 'Nepal'}</p>
            </div>

            {/* Member Since - Full Width */}
            <div className='md:col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border border-indigo-200'>
              <div className='flex items-center gap-3 mb-2'>
                <Calendar size={20} className='text-indigo-600' />
                <h3 className='font-semibold text-gray-700'>Administrator Since</h3>
              </div>
              <p className='text-gray-800 ml-8'>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* User ID Section */}
          <div className='mt-6 bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border border-gray-700'>
            <p className='text-xs text-gray-300 font-semibold mb-2'>ADMIN ID</p>
            <p className='text-gray-100 font-mono text-sm break-all'>{user._id}</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Security Settings */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>🔒 Security</h3>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Change password - Coming soon</p>
            <p className='text-sm text-gray-600'>Two-factor authentication - Coming soon</p>
            <p className='text-sm text-gray-600'>Login history - Coming soon</p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>🔔 Notifications</h3>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Email notifications - Coming soon</p>
            <p className='text-sm text-gray-600'>Order alerts - Coming soon</p>
            <p className='text-sm text-gray-600'>System updates - Coming soon</p>
          </div>
        </div>

        {/* System Settings */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>⚙️ System</h3>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Theme preference - Coming soon</p>
            <p className='text-sm text-gray-600'>Language settings - Coming soon</p>
            <p className='text-sm text-gray-600'>Timezone - Coming soon</p>
          </div>
        </div>

        {/* Billing & License */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>💳 Billing</h3>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Subscription status - Coming soon</p>
            <p className='text-sm text-gray-600'>Invoice history - Coming soon</p>
            <p className='text-sm text-gray-600'>License information - Coming soon</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className='bg-red-50 border-2 border-red-300 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-red-700 mb-4'>⚠️ Danger Zone</h3>
        <p className='text-sm text-red-600 mb-4'>These actions cannot be undone</p>
        <button
          disabled
          className='bg-red-600 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-50'
        >
          Delete Admin Account
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
