import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()

  const handleQuantityChange = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQty)
    }
  }
  const removeItem = (productId) => {
    removeFromCart(productId)
  }

  const subtotal = getCartTotal()
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + tax

  return (
    <main>
      {/* PAGE HEADER */}
      <section className='bg-gradient-to-r from-purple-50 to-indigo-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Shopping Cart</h1>
          <p className='text-gray-600'>Review and manage your items</p>
        </div>
      </section>

      {/* CART CONTENT */}
      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto'>
          {cartItems.length === 0 ? (
            <div className='text-center py-20'>
              <div className='flex justify-center mb-4'>
                <i className='fas fa-shopping-cart text-8xl text-gray-300'></i>
              </div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h2>
              <p className='text-gray-600 mb-6'>Add some items to get started!</p>
              <Link to='/products' className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700'>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* ITEMS */}
              <div className='lg:col-span-2'>
                <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                  {cartItems.map((item) => {
                    const productId = item._id || item.id
                    const image = item.image || item.images?.[0] || item.imageUrls?.[0]
                    return (
                    <div key={productId} className='flex items-center gap-6 p-6 border-b border-gray-200 hover:bg-gray-50'>
                      <img 
                        src={image} 
                        alt={item.name} 
                        className='w-24 h-24 object-cover rounded-lg'
                        onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27100%27 height=%27100%27/%3E%3C/svg%3E'}
                      />

                      <div className='flex-1'>
                        <h3 className='font-bold text-gray-800 mb-1'>{item.name}</h3>
                        <p className='text-blue-600 font-bold'>Rs. {(item.price || 0).toLocaleString()}</p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleQuantityChange(productId, item.qty - 1)}
                          className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                        >
                          <i className='fas fa-minus text-sm'></i>
                        </button>
                        <input
                          type='number'
                          value={item.qty}
                          onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value))}
                          className='w-12 border border-gray-300 rounded text-center py-1'
                          min='1'
                        />
                        <button
                          onClick={() => handleQuantityChange(productId, item.qty + 1)}
                          className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                        >
                          <i className='fas fa-plus text-sm'></i>
                        </button>
                      </div>

                      <p className='font-bold text-gray-800 w-24 text-right'>Rs. {((item.price || 0) * (item.qty || 1)).toLocaleString()}</p>

                      <button
                        onClick={() => removeItem(productId)}
                        className='text-red-600 hover:text-red-700 w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded'
                      >
                        <i className='fas fa-trash text-lg'></i>
                      </button>
                    </div>
                    )
                  })}
                </div>

                <Link to='/products' className='inline-flex items-center gap-2 mt-6 text-blue-600 font-bold hover:underline'>
                  <i className='fas fa-arrow-left'></i> Continue Shopping
                </Link>
              </div>

              {/* ORDER SUMMARY */}
              <div className='lg:col-span-1'>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-20 h-fit'>
                  <h3 className='font-bold text-gray-800 mb-6 text-lg'>Order Summary</h3>

                  <div className='space-y-3 mb-6 pb-6 border-b border-gray-300'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-bold'>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Tax (13%)</span>
                      <span className='font-bold'>Rs. {tax.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Delivery</span>
                      <span className='font-bold text-green-600'>FREE</span>
                    </div>
                  </div>

                  <div className='flex justify-between text-lg font-bold mb-6 pb-6 border-b border-gray-300'>
                    <span>Total</span>
                    <span className='text-blue-600'>Rs. {total.toLocaleString()}</span>
                  </div>

                  <Link to='/checkout' className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 mb-3'>
                    <i className='fas fa-lock'></i>
                    Proceed to Checkout
                  </Link>

                  <button className='w-full border-2 border-gray-300 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-100'>
                    Continue Shopping
                  </button>

                  {/* Support */}
                  <div className='mt-6 pt-6 border-t border-gray-300'>
                    <p className='text-sm text-gray-600 mb-3'>Need help?</p>
                    <a href='https://wa.me/9779823939106' className='inline-flex items-center gap-2 text-green-600 font-medium hover:underline'>
                      <i className='fas fa-comment'></i>
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Cart
