import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await loginUser(formData.email, formData.password)
      console.log('Login successful:', res)
      
      // Navigate to home page
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'Login failed. Please try again.')
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
            <h1 className='text-2xl font-bold text-gray-800'>Radhana Art</h1>
            <p className='text-gray-600 text-sm mt-1'>Welcome back to your account</p>
          </div>

          {/* Login Card */}
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Error Message */}
              {error && (
                <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
                  {error}
                </div>
              )}

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

              {/* Password */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-bold text-gray-800'>Password</label>
                  <Link to='#' className='text-sm text-blue-600 hover:underline'>
                    Forgot?
                  </Link>
                </div>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='••••••••'
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition pr-12'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <i className='fas fa-eye-slash text-xl'></i> : <i className='fas fa-eye text-xl'></i>}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 rounded border-gray-300'
                />
                <span className='text-sm text-gray-600'>Remember me for 30 days</span>
              </label>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                <i className='fas fa-sign-in-alt'></i>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className='my-6 flex items-center gap-3'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='text-sm text-gray-500'>Or continue with</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>

            {/* Social Login */}
            <button className='w-full border-2 border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition font-medium text-gray-700 flex items-center justify-center gap-2'>
              <i className='fab fa-google text-lg text-red-600'></i> Google
            </button>

            {/* Sign Up Link */}
            <p className='text-center text-gray-600 text-sm mt-6'>
              Don't have an account?{' '}
              <Link to='/register' className='text-blue-600 font-bold hover:underline'>
                Create one
              </Link>
            </p>
          </div>

          {/* Help */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600'>
              Need help?{' '}
              <a href='https://wa.me/9779823939106' className='text-green-600 font-bold hover:underline'>
                Chat with us
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
