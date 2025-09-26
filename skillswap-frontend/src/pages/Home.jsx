import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestCourses, fetchTrendingCourses } from '../store/slices/coursesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const { latest, trending, loading } = useSelector(s => s.courses);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(fetchLatestCourses());
    dispatch(fetchTrendingCourses());
  }, [dispatch]);

  const handleAddToCart = async (courseId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.isAdmin) return; // admins cannot buy
    try {
      await dispatch(addToCart(courseId)).unwrap();
      window.location.href = '/cart';
    } catch {}
  };

  const handleAddToWishlist = (courseId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.isAdmin) return; // admins cannot wishlist
    dispatch(addToWishlist(courseId));
  };

  const categories = [
    { name: 'Development', icon: 'fa-code', category: 'development' },
    { name: 'Business', icon: 'fa-briefcase', category: 'business' },
    { name: 'IT & Software', icon: 'fa-network-wired', category: 'it' },
    { name: 'Marketing', icon: 'fa-bullhorn', category: 'marketing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-400/10 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-white leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Future Skills
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Transform your career with cutting-edge courses taught by industry experts. 
              Learn at your own pace with our interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/shop" 
                className="group relative inline-flex items-center text-lg px-12 py-5 rounded-2xl bg-white text-purple-600 font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:-translate-y-2"
              >
                <i className="fas fa-rocket mr-3 text-xl group-hover:animate-bounce"></i>
                Start Learning Now
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center text-lg px-8 py-5 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-play-circle mr-3"></i>
                Watch Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your passion and unlock new opportunities with our diverse course categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat, index) => (
              <Link 
                key={cat.category}
                to={`/shop?category=${cat.category}`} 
                className="group relative p-8 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl rounded-3xl bg-white border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:animate-bounce bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <i className={`fa-solid ${cat.icon} text-3xl text-white`}></i>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    Explore courses
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Courses */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(229,231,235,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(229,231,235,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Latest Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay ahead with our newest and most innovative courses
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...new Map(latest.map(c => [c._id, c])).values()].map((course, index) => (
                <div 
                  key={course._id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.course_image} 
                      alt={course.course_name} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-semibold rounded-full text-gray-800">
                        New
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => handleAddToWishlist(course._id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {course.course_name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fas fa-star text-sm"></i>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.8)</span>
                      </div>
                      <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{course.price}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAddToCart(course._id)}
                        className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <i className="fas fa-rocket mr-2"></i>
                        Enroll Now
                      </button>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="px-4 py-3 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners in these popular courses
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...new Map(trending.map(c => [c._id, c])).values()].map((course, index) => (
                <div 
                  key={course._id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.course_image} 
                      alt={course.course_name} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                        🔥 Trending
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => handleAddToWishlist(course._id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {course.course_name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fas fa-star text-sm"></i>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.9)</span>
                      </div>
                      <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{course.price}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAddToCart(course._id)}
                        className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <i className="fas fa-fire mr-2"></i>
                        Join Now
                      </button>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="px-4 py-3 rounded-2xl border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(229,231,235,0.2) 2px, transparent 2px), radial-gradient(circle at 70% 70%, rgba(229,231,235,0.2) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
              Why Choose SkillSwap?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our innovative learning platform designed for success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center group-hover:animate-bounce bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <i className="fa-solid fa-chalkboard-teacher text-4xl text-white"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-star text-white text-sm"></i>
                </div>
              </div>
              <h3 className="font-black text-2xl mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Expert Instructors</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Learn from industry professionals with years of real-world experience and proven track records.</p>
            </div>
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center group-hover:animate-bounce bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <i className="fa-solid fa-clock text-4xl text-white"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
              </div>
              <h3 className="font-black text-2xl mb-4 text-gray-900 group-hover:text-green-600 transition-colors duration-300">Learn at Your Pace</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Flexible learning with lifetime course access and self-paced modules that fit your schedule.</p>
            </div>
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center group-hover:animate-bounce bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <i className="fa-solid fa-certificate text-4xl text-white"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-award text-white text-sm"></i>
                </div>
              </div>
              <h3 className="font-black text-2xl mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Industry Certificates</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Get certified and boost your career opportunities with recognized industry credentials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-pink-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-14 h-14 bg-green-400/20 rounded-full animate-bounce"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Ready to Transform
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Your Future?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join over 100,000 students who have already started their learning journey with us
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to={user ? "/shop" : "/register"}
              className="group relative inline-flex items-center text-xl px-12 py-6 rounded-2xl font-black bg-white text-purple-600 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:-translate-y-2"
            >
              <i className="fas fa-rocket mr-3 text-2xl group-hover:animate-bounce"></i>
              {user ? 'Explore Courses' : 'Start Learning Free'}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/about"
              className="inline-flex items-center text-lg px-8 py-6 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <i className="fas fa-play-circle mr-3"></i>
              Watch Success Stories
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">100K+</div>
              <div className="text-white/80">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">500+</div>
              <div className="text-white/80">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}