import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { axiosInstance } from '../utils/axios'

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart()
  const { user, isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    country: 'Nepal',
    paymentMethod: 'khalti',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState(null)

  // Populate form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        ...(user.address && {
          address: user.address.street || '',
          city: user.address.city || '',
          province: user.address.province || '',
          country: user.address.country || 'Nepal',
        })
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required fields')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    console.log('Cart items:', cartItems);

    // Validate each cart item
    const invalidItems = cartItems.filter(item => !item.price || item.qty < 1 || !item._id && !item.id);
    if (invalidItems.length > 0) {
      console.error('Invalid items found:', invalidItems);
      setError('Some cart items have invalid data. Please review your cart.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Build order items array with proper field names
      const items = cartItems.map(item => {
        console.log('Processing item:', item);
        return {
          product: item._id || item.id, // Handle both _id and id
          quantity: item.qty || 1,
          price: Math.max(0, item.price), // Ensure positive price
        };
      });

      console.log('Items array to send:', items);

      // Validate items array
      if (items.length === 0) {
        throw new Error('No valid items in cart');
      }

      // Validate each item has required fields
      items.forEach((item, index) => {
        if (!item.product) {
          console.error(`Item ${index} missing product ID:`, item);
          throw new Error(`Item ${index} is missing product ID`);
        }
        if (!item.quantity || item.quantity < 1) {
          console.error(`Item ${index} invalid quantity:`, item);
          throw new Error(`Item ${index} has invalid quantity`);
        }
        if (item.price === undefined || item.price === null || item.price < 0) {
          console.error(`Item ${index} invalid price:`, item);
          throw new Error(`Item ${index} has invalid price`);
        }
      });

      // Build order payload with correct field names for backend
      const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
      
      const orderPayload = {
        orderItems: items, // Backend expects "orderItems" not "items"
        totalPrice: totalPrice, // Backend expects "totalPrice"
        shippingAddress: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          street: formData.address.trim(),
          city: formData.city.trim(),
          landmark: '', // Optional landmark
          country: formData.country.trim(),
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: '', // Optional order notes
      }

      console.log('Final order payload:', JSON.stringify(orderPayload, null, 2));

      // Create order
      const res = await axiosInstance.post("/orders/", orderPayload)
      
      console.log('Order created successfully:', res.data)
      
      // Set order ID from response
      if (res.data && (res.data._id || res.data.id)) {
        setOrderId(res.data._id || res.data.id)
      } else {
        console.warn('Order created but no ID in response:', res.data)
        setOrderId('Order submitted successfully')
      }
      
      // Clear cart
      clearCart()
      
      // Show success
      setOrderPlaced(true)
      
      // Scroll to top
      window.scrollTo(0, 0)
    } catch (err) {
      console.error('Order creation error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create order. Please try again.'
      setError(errorMessage)
      console.log(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <main>
        <section className='min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-purple-50 to-indigo-50'>
          <div className='w-full max-w-md text-center'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6'>
              <i className='fas fa-exclamation-circle text-6xl text-yellow-600'></i>
            </div>
            <h1 className='text-3xl font-bold text-gray-800 mb-3'>Cart is Empty</h1>
            <p className='text-gray-600 mb-8'>Add some products before checking out</p>

            <Link to='/products' className='w-full inline-block bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700'>
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    )
  }

  if (orderPlaced) {
    return (
      <main>
        <section className='min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-violet-50 to-purple-50'>
          <div className='w-full max-w-md text-center'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6'>
              <i className='fas fa-check text-6xl text-green-600'></i>
            </div>
            <h1 className='text-3xl font-bold text-gray-800 mb-3'>Order Confirmed!</h1>
            <p className='text-gray-600 mb-2'>Thank you for your purchase</p>
            <p className='text-gray-500 text-sm mb-8'>
              We've sent a confirmation email to <span className='font-bold'>{formData.email}</span>
            </p>

            <div className='bg-white rounded-lg p-6 mb-6 border-2 border-green-200'>
              <p className='text-sm text-gray-600 mb-2'>Order ID</p>
              <p className='text-2xl font-bold text-gray-800 font-mono break-all'>{orderId || 'Processing...'}</p>
            </div>

            <p className='text-gray-600 mb-8'>You can track your order status in your account dashboard</p>

            <div className='space-y-3'>
              <Link to='/' className='w-full inline-block bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700'>
                Back to Home
              </Link>
              <a href='https://wa.me/9779823939106' className='w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700'>
                <i className='fas fa-comment'></i>
                Chat with Us
              </a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className='bg-gradient-to-r from-purple-50 to-violet-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Checkout</h1>
          <p className='text-gray-600'>Complete your purchase</p>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-5xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* FORM */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-8'>Shipping Information</h2>

              {error && (
                <div className='mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-center gap-3'>
                  <i className='fas fa-circle-exclamation text-2xl text-red-600'></i>
                  <div>
                    <p className='font-bold text-red-800'>Error</p>
                    <p className='text-sm text-red-700'>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>First Name *</label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>Last Name *</label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Email *</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Phone *</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Address *</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder='Street address'
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>City *</label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>Province</label>
                    <input
                      type='text'
                      name='province'
                      value={formData.province}
                      onChange={handleChange}
                      placeholder='Optional'
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                </div>

                <div className='mt-8 pt-8 border-t border-gray-200'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>Payment Method</h3>

                  <div className='space-y-3'>
                    {[
                      { id: 'khalti', name: 'Khalti', icon: 'fa-wallet' },
                      { id: 'esewa', name: 'eSewa', icon: 'fa-credit-card' },
                      { id: 'fonepay', name: 'FonePay', icon: 'fa-mobile' },
                      { id: 'bank', name: 'Bank Transfer', icon: 'fa-building' },
                    ].map((method) => {
                      return (
                        <label key={method.id} className='flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50'>
                          <input
                            type='radio'
                            name='paymentMethod'
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleChange}
                            className='w-4 h-4'
                          />
                          <i className={`fas ${method.icon} text-xl text-blue-600`}></i>
                          <span className='font-medium text-gray-800'>{method.name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition text-lg mt-8 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  <i className='fas fa-lock'></i>
                  {loading ? 'Processing...' : `Place Order - Rs. ${getCartTotal()}`}
                </button>
              </form>
            </div>

            {/* ORDER SUMMARY */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-8'>Order Summary</h2>

              <div className='bg-gray-50 rounded-lg p-6 sticky top-20 h-fit'>
                <div className='space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-96 overflow-y-auto'>
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className='flex items-center gap-4'>
                      <img 
                        src={item.image || item.imageUrls?.[0]} 
                        alt={item.name}
                        className='w-16 h-16 object-cover rounded'
                        onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27100%27 height=%27100%27/%3E%3C/svg%3E'}
                      />
                      <div className='flex-1'>
                        <p className='font-bold text-gray-800'>{item.name}</p>
                        <p className='text-sm text-gray-600'>Qty: {item.qty}</p>
                      </div>
                      <p className='font-bold'>Rs. {item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-bold'>Rs. {getCartTotal()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Delivery</span>
                    <span className='text-green-600 font-bold'>FREE</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold pt-3 border-t border-gray-300'>
                    <span>Total</span>
                    <span className='text-blue-600'>Rs. {getCartTotal()}</span>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-xs text-blue-600 font-medium mb-2 flex items-center gap-2'>
                    <i className='fas fa-lock text-sm'></i> Your payment is secure
                  </p>
                  <p className='text-xs text-blue-600'>This connection is encrypted with SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Checkout
