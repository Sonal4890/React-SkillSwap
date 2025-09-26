import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/orderSlice';
import { useState } from 'react';

export default function Cart() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const result = await dispatch(placeOrder({ paymentMethod }));
      if (result.meta.requestStatus === 'fulfilled') {
        // Redirect to success page or show success message
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-300">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.courses || cart.courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center animate-fade-in-up">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center">
              <i className="fas fa-shopping-cart text-6xl text-blue-400"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-100 mb-6">
              Your cart is empty
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Looks like you haven't added any courses to your cart yet. Start your learning journey today!
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-rocket mr-3"></i>
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-100 mb-2">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-300">
              {cart.totalItems} {cart.totalItems === 1 ? 'course' : 'courses'} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center px-6 py-3 bg-red-900/30 text-red-300 rounded-2xl font-semibold hover:bg-red-900/40 transition-all duration-300 hover:scale-105"
          >
            <i className="fas fa-trash mr-2"></i>
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {/* Cart Items */}
          <div>
            <div className="bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
              {cart.courses.map((item, index) => (
                <div key={index} className="group flex items-center p-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={item.course.course_image} 
                      alt={item.course.course_name}
                      className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  </div>
                  <div className="flex-1 ml-6">
                    <h3 className="font-bold text-xl text-gray-100 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {item.course.course_name}
                    </h3>
                    <p className="text-gray-400 mb-3">
                      <i className="fas fa-user mr-2"></i>
                      by {item.course.instructor}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ₹{item.course.price}
                      </span>
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star text-sm"></i>
                        ))}
                        <span className="ml-2 text-sm text-gray-400">(4.8)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.course._id)}
                    className="w-12 h-12 bg-red-900/30 text-red-300 rounded-2xl flex items-center justify-center hover:bg-red-900/50 hover:scale-110 transition-all duration-300"
                    title="Remove from cart"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-950 rounded-3xl shadow-2xl p-8 border border-gray-800">
              <h2 className="text-2xl font-black text-gray-100 mb-6 flex items-center">
                <i className="fas fa-receipt mr-3 text-blue-600"></i>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-2xl">
                  <span className="text-gray-300 font-medium">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-bold text-lg text-gray-100">₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-900 rounded-2xl">
                  <span className="text-gray-300 font-medium">Tax (GST)</span>
                  <span className="font-bold text-lg text-gray-100">₹0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border-2 border-green-900/30">
                  <span className="text-gray-100 font-bold text-lg">Total</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ₹{cart.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Payment Method</label>
                <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-800 bg-gray-900 text-gray-100">
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Wallet</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl mb-6"
              >
                <i className="fas fa-credit-card mr-3"></i>
                Proceed to Checkout
              </button>

              <div className="text-center">
                <Link 
                  to="/shop" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-8 p-4 bg-blue-900/20 rounded-2xl border border-blue-900/30">
                <div className="flex items-center justify-center space-x-2 text-blue-400">
                  <i className="fas fa-shield-alt"></i>
                  <span className="text-sm font-semibold">Secure Checkout</span>
                </div>
                <p className="text-xs text-blue-300 text-center mt-2">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}