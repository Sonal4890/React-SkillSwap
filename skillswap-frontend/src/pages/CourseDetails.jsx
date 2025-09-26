import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCourseById } from '../store/slices/coursesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';

export default function CourseDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector(s => s.courses);
  const { user } = useSelector(s => s.auth);

  useEffect(() => { 
    if (id) {
      dispatch(fetchCourseById(id)); 
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.isAdmin) return;
    try {
      await dispatch(addToCart(current._id)).unwrap();
      navigate('/cart');
    } catch (e) {
      // no-op; error is handled in slice
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.isAdmin) return;
    dispatch(addToWishlist(current._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/shop" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Course Image */}
            <div className="relative overflow-hidden">
              <img 
                src={current.course_image} 
                alt={current.course_name} 
                className="w-full h-64 lg:h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-2xl shadow-lg">
                  {current.category}
                </span>
              </div>
              <div className="absolute top-6 right-6">
                <button 
                  onClick={handleAddToWishlist}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                  title="Add to Wishlist"
                >
                  <i className="far fa-heart text-lg"></i>
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-8 lg:p-12">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {current.course_name}
                </h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center text-yellow-400 mr-6">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-lg"></i>
                    ))}
                    <span className="ml-2 text-lg font-semibold text-gray-700">{current.rating || 4.8}</span>
                  </div>
                  <span className="text-lg text-gray-600 font-medium">
                    <i className="fas fa-users mr-2"></i>
                    {current.enrolledCount || 1250} students
                  </span>
                </div>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{current.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                      <i className="fas fa-user text-blue-600 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-semibold text-gray-900">{current.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-green-600 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{current.duration || 'Self-paced'}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                      <i className="fas fa-signal text-purple-600 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-semibold text-gray-900">{current.level || 'All levels'}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
                      <i className="fas fa-globe text-orange-600 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="font-semibold text-gray-900">{current.language || 'English'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{current.price}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">One-time payment</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-4 px-8 rounded-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                  >
                    <i className="fas fa-rocket mr-3"></i>
                    Enroll Now
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="px-6 py-4 rounded-2xl border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105"
                    title="Add to Cart"
                  >
                    <i className="fas fa-shopping-cart text-lg"></i>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-graduation-cap mr-3 text-blue-600"></i>
                    What you'll learn:
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mr-3 mt-1 text-lg"></i>
                      <span>Master the fundamentals of {current.course_name}</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mr-3 mt-1 text-lg"></i>
                      <span>Build real-world projects and applications</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mr-3 mt-1 text-lg"></i>
                      <span>Get lifetime access to course materials</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mr-3 mt-1 text-lg"></i>
                      <span>Receive a certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
