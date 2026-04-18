import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {registerUser}= useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agreed) {
      alert('Please agree to the Terms of Service and Privacy Policy')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await registerUser(formData.name, formData.email, formData.phone, formData.password, formData.confirmPassword)
      console.log('Registration successful:', res)
      
      // Check if email verification is required
      if (res?.pending_verification) {
        // Redirect to email verification page
        navigate(
          `/verify-email?email=${encodeURIComponent(formData.email)}&token=${encodeURIComponent(res.token || "")}`
        );
      } else {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        })
        setAgreed(false)
        
        // Redirect to home page
        navigate('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
      alert(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className='min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-purple-50 to-indigo-50'>
        <div className='w-full max-w-md'>
          {/* Logo */}
          <div className='text-center mb-10'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl mb-4'>
              <span className='text-white font-bold text-2xl'>RA</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-800'>Create Account</h1>
            <p className='text-gray-600 text-sm mt-1'>Join us for exclusive deals</p>
          </div>

          {/* Register Card */}
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Name */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your Full Name'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Email Address</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='you@example.com'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='+977 98xxxxxxxx'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Password</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-2'>Confirm Password</label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />
              </div>

              {/* Terms */}
              <label className='flex items-start gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className='w-4 h-4 rounded border-gray-300 mt-1'
                  required
                />
                <span className='text-sm text-gray-600'>
                  I agree to the{' '}
                  <Link to='#' className='text-blue-600 hover:underline'>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to='#' className='text-blue-600 hover:underline'>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                <i className='fas fa-user-plus'></i>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <p className='text-center text-gray-600 text-sm mt-6'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-600 font-bold hover:underline'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
