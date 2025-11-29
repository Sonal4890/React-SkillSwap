import { useEffect, useMemo } from 'react';
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
  const myOrders = useSelector(s => s.orders.orders);

  const purchasedCourseIds = useMemo(() => {
    const ids = new Set();
    (myOrders || []).forEach(order => {
      (order?.courses || []).forEach(item => {
        const id = item?.course?._id || item?.course;
        if (id) ids.add(id.toString());
      });
    });
    return ids;
  }, [myOrders]);

  const isOwned = current ? purchasedCourseIds.has(current._id) : false;

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
    if (purchasedCourseIds.has(current._id)) {
      alert('You are already enrolled in this course.');
      return;
    }
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
    if (purchasedCourseIds.has(current._id)) {
      alert('Already enrolled – wishlist not needed.');
      return;
    }
    dispatch(addToWishlist(current._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <i className="fas fa-exclamation-circle text-6xl text-gray-400"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Course Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section with Course Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={current.course_image} 
            alt={current.course_name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pb-8 md:pb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                {current.category}
              </span>
              {!isOwned && (
                <button 
                  onClick={handleAddToWishlist}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/20"
                  title="Add to Wishlist"
                >
                  <i className="far fa-heart"></i>
                </button>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
              {current.course_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white">
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-sm md:text-base"></i>
                  ))}
                </div>
                <span className="text-sm md:text-base font-semibold">{current.rating || 4.8}</span>
                <span className="text-sm md:text-base text-white/80 ml-1">({current.reviews || 1247} reviews)</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <i className="fas fa-users mr-2"></i>
                <span>{current.enrolledCount || 1250} students enrolled</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <i className="fas fa-clock mr-2"></i>
                <span>{current.duration || 'Self-paced'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">About This Course</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{current.description}</p>
            </section>

            {/* What You'll Learn */}
            <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <i className="fas fa-graduation-cap text-white"></i>
                </div>
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  `Master the fundamentals of ${current.course_name}`,
                  'Build real-world projects and applications',
                  'Get lifetime access to course materials',
                  'Receive a certificate of completion',
                  'Learn from industry experts',
                  'Join a community of learners'
                ].map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Details Grid */}
            <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Course Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-user text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Instructor</p>
                      <p className="text-lg font-bold text-gray-900">{current.instructor || 'Expert Instructor'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Duration</p>
                      <p className="text-lg font-bold text-gray-900">{current.duration || 'Self-paced'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-signal text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Level</p>
                      <p className="text-lg font-bold text-gray-900">{current.level || 'All levels'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="fas fa-globe text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Language</p>
                      <p className="text-lg font-bold text-gray-900">{current.language || 'English'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{current.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">One-time payment • Lifetime access</p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  {isOwned ? (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center justify-center mb-2">
                        <i className="fas fa-check-circle text-green-500 text-2xl mr-2"></i>
                        <span className="font-bold text-green-700">You're Enrolled!</span>
                      </div>
                      <Link 
                        to={`/course/${current._id}`}
                        className="block w-full text-center py-3 px-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors duration-300"
                      >
                        Go to Course
                      </Link>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleAddToCart}
                        className="w-full py-4 px-6 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <i className="fas fa-rocket mr-2"></i>
                        Enroll Now
                      </button>
                      <button 
                        onClick={handleAddToCart}
                        className="w-full py-3 px-6 rounded-xl border-2 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300 font-semibold flex items-center justify-center"
                        title="Add to Cart"
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>

                {/* Course Includes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">This course includes:</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: 'play-circle', text: 'Video lectures' },
                      { icon: 'file-alt', text: 'Downloadable resources' },
                      { icon: 'certificate', text: 'Certificate of completion' },
                      { icon: 'infinity', text: 'Lifetime access' },
                      { icon: 'mobile-alt', text: 'Mobile & desktop access' }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <i className={`fas fa-${item.icon} text-green-500 mr-3 w-5`}></i>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guarantee Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-blue-600 text-xl mr-3"></i>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">30-Day Money-Back Guarantee</p>
                      <p className="text-xs text-gray-600">Full refund if not satisfied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
