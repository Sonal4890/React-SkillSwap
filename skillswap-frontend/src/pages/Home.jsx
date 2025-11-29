import { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestCourses, fetchTrendingCourses } from '../store/slices/coursesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const { latest, trending, loading } = useSelector(s => s.courses);
  const { user } = useSelector(s => s.auth);
  const myOrders = useSelector(s => s.orders.orders);
  
  // Carousel state - High-quality tech images (Replace with Pinterest URLs: https://i.pinimg.com/...)
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    { 
      // Replace this URL with your Pinterest image URL
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80&auto=format&fit=crop'
    },
    { 
      src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80&auto=format&fit=crop'
    },
    { 
      src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=80&auto=format&fit=crop'
    },
    { 
      src: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1920&q=80&auto=format&fit=crop'
    }
  ];
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

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

  const uniqueLatest = useMemo(() => {
    const seen = new Set();
    return (latest || []).filter(course => {
      const id = course?._id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [latest]);

  const uniqueTrending = useMemo(() => {
    const seen = new Set();
    return (trending || []).filter(course => {
      const id = course?._id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [trending]);

  // Auto-scroll refs for Latest Courses and Trending
  const latestScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);
  const [latestIsHovered, setLatestIsHovered] = useState(false);
  const [trendingIsHovered, setTrendingIsHovered] = useState(false);

  // Continuous smooth auto-scroll Latest Courses with marquee effect
  useEffect(() => {
    const scrollContainer = latestScrollRef.current;
    if (!scrollContainer || uniqueLatest.length === 0) return;

    let animationId;
    const normalSpeed = 0.5; // pixels per frame - normal speed
    const hoverSpeed = 0.15; // pixels per frame - slower on hover
    
    const animateScroll = () => {
      const scrollSpeed = latestIsHovered ? hoverSpeed : normalSpeed;
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;
      
      if (currentScroll >= maxScroll - 1) {
        // Reset to start seamlessly for infinite marquee
        scrollContainer.scrollLeft = 0;
      } else {
        // Continuous smooth scroll from left to right
        scrollContainer.scrollLeft += scrollSpeed;
      }
      
      animationId = requestAnimationFrame(animateScroll);
    };

    animationId = requestAnimationFrame(animateScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [uniqueLatest.length, uniqueLatest, latestIsHovered]);

  // Continuous smooth auto-scroll Trending Courses with marquee effect
  useEffect(() => {
    const scrollContainer = trendingScrollRef.current;
    if (!scrollContainer || uniqueTrending.length === 0) return;

    let animationId;
    const normalSpeed = 0.5; // pixels per frame - normal speed
    const hoverSpeed = 0.15; // pixels per frame - slower on hover
    
    const animateScroll = () => {
      const scrollSpeed = trendingIsHovered ? hoverSpeed : normalSpeed;
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;
      
      if (currentScroll >= maxScroll - 1) {
        // Reset to start seamlessly for infinite marquee
        scrollContainer.scrollLeft = 0;
      } else {
        // Continuous smooth scroll from left to right
        scrollContainer.scrollLeft += scrollSpeed;
      }
      
      animationId = requestAnimationFrame(animateScroll);
    };

    animationId = requestAnimationFrame(animateScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [uniqueTrending.length, uniqueTrending, trendingIsHovered]);

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
    if (purchasedCourseIds.has(courseId)) {
      alert('You are already enrolled in this course.');
      return;
    }
    try {
      await dispatch(addToCart(courseId)).unwrap();
      window.location.href = '/cart';
    } catch (e) {
      window.location.href = '/login';
    }
  };

  const handleAddToWishlist = (courseId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.isAdmin) return; // admins cannot wishlist
    if (purchasedCourseIds.has(courseId)) {
      alert('Already enrolled – no need to add to wishlist.');
      return;
    }
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
      {/* Hero Section with Live Background Images */}
      <section className="relative overflow-hidden h-[55vh] md:h-[60vh] flex items-center">
        {/* Live Background Images - Rotating Carousel */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={`Background ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          </div>
        ))}

        {/* Subtle Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Main Content */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-2 md:space-y-3">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 text-white leading-tight drop-shadow-2xl">
              Master Your
              <span className="block text-white">
                Future Skills
              </span>
            </h2>

            {/* Short Description */}
            <p className="text-sm md:text-base text-white/90 max-w-lg mx-auto drop-shadow-lg mb-4">
              Learn at your own pace with industry experts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link 
                to="/shop" 
                className="group inline-flex items-center justify-center text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-rocket mr-2 text-sm group-hover:animate-bounce"></i>
                Start Learning Now
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center text-sm md:text-base px-5 md:px-7 py-2.5 md:py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <i className="fas fa-play-circle mr-2 text-sm"></i>
                Watch Demo
              </Link>
            </div>

            {/* Carousel Controls - Bottom */}
            <div className="flex items-center justify-center mt-4">
              {/* Carousel Indicators */}
              <div className="flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentSlide
                        ? 'w-8 h-2 bg-green-400 shadow-lg shadow-green-400/50'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
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

      {/* Latest Courses - Horizontal Scroller */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(229,231,235,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(229,231,235,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Latest Courses
            </h2>
            <p className="text-lg text-gray-600">
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
            <div 
              ref={latestScrollRef}
              className="overflow-x-hidden scrollbar-hide" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={() => setLatestIsHovered(true)}
              onMouseLeave={() => setLatestIsHovered(false)}
            >
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {/* First set of courses for seamless marquee */}
                {uniqueLatest.map((course, index) => {
                  const isOwned = purchasedCourseIds.has(course._id);
                  return (
                  <div 
                    key={`latest-${course._id}-${index}`} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 flex-shrink-0"
                    style={{ width: '300px' }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.course_image} 
                        alt={course.course_name} 
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800">
                          New
                        </span>
                      </div>
                      {!isOwned && (
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => handleAddToWishlist(course._id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {course.course_name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-xs leading-snug">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className="fas fa-star text-xs"></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.8)</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{course.price}
                        </span>
                      </div>
                      {isOwned ? (
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">
                          <span><i className="fas fa-check-circle text-green-500 mr-1.5 text-xs"></i>Enrolled</span>
                          <Link to={`/course/${course._id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(course._id)}
                            className="flex-1 py-2 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                          >
                            <i className="fas fa-rocket mr-1.5"></i>
                            Enroll
                          </button>
                          <Link 
                            to={`/course/${course._id}`} 
                            className="px-3 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );})}
                {/* Duplicate set for seamless infinite marquee */}
                {uniqueLatest.map((course, index) => {
                  const isOwned = purchasedCourseIds.has(course._id);
                  return (
                  <div 
                    key={`latest-dup-${course._id}-${index}`} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 flex-shrink-0"
                    style={{ width: '300px' }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.course_image} 
                        alt={course.course_name} 
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800">
                          New
                        </span>
                      </div>
                      {!isOwned && (
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => handleAddToWishlist(course._id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {course.course_name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-xs leading-snug">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className="fas fa-star text-xs"></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.8)</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{course.price}
                        </span>
                      </div>
                      {isOwned ? (
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">
                          <span><i className="fas fa-check-circle text-green-500 mr-1.5 text-xs"></i>Enrolled</span>
                          <Link to={`/course/${course._id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(course._id)}
                            className="flex-1 py-2 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                          >
                            <i className="fas fa-rocket mr-1.5"></i>
                            Enroll
                          </button>
                          <Link 
                            to={`/course/${course._id}`} 
                            className="px-3 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );})}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trending Courses - Horizontal Scroller */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <p className="text-lg text-gray-600">
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
            <div 
              ref={trendingScrollRef}
              className="overflow-x-hidden scrollbar-hide" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={() => setTrendingIsHovered(true)}
              onMouseLeave={() => setTrendingIsHovered(false)}
            >
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {/* First set of courses for seamless marquee */}
                {uniqueTrending.map((course, index) => {
                  const isOwned = purchasedCourseIds.has(course._id);
                  return (
                  <div 
                    key={`trending-${course._id}-${index}`} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 flex-shrink-0"
                    style={{ width: '300px' }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.course_image} 
                        alt={course.course_name} 
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                          🔥 Trending
                        </span>
                      </div>
                      {!isOwned && (
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => handleAddToWishlist(course._id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                        {course.course_name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-xs leading-snug">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className="fas fa-star text-xs"></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.9)</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₹{course.price}
                        </span>
                      </div>
                      {isOwned ? (
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">
                          <span><i className="fas fa-check-circle text-green-500 mr-1.5 text-xs"></i>Enrolled</span>
                          <Link to={`/course/${course._id}`} className="text-purple-600 hover:underline text-sm">View</Link>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(course._id)}
                            className="flex-1 py-2 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                          >
                            <i className="fas fa-fire mr-1.5"></i>
                            Join
                          </button>
                          <Link 
                            to={`/course/${course._id}`} 
                            className="px-3 py-2 rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );})}
                {/* Duplicate set for seamless infinite marquee */}
                {uniqueTrending.map((course, index) => {
                  const isOwned = purchasedCourseIds.has(course._id);
                  return (
                  <div 
                    key={`trending-dup-${course._id}-${index}`} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 flex-shrink-0"
                    style={{ width: '300px' }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.course_image} 
                        alt={course.course_name} 
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                          🔥 Trending
                        </span>
                      </div>
                      {!isOwned && (
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => handleAddToWishlist(course._id)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                        {course.course_name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-xs leading-snug">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className="fas fa-star text-xs"></i>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.9)</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₹{course.price}
                        </span>
                      </div>
                      {isOwned ? (
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">
                          <span><i className="fas fa-check-circle text-green-500 mr-1.5 text-xs"></i>Enrolled</span>
                          <Link to={`/course/${course._id}`} className="text-purple-600 hover:underline text-sm">View</Link>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(course._id)}
                            className="flex-1 py-2 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                          >
                            <i className="fas fa-fire mr-1.5"></i>
                            Join
                          </button>
                          <Link 
                            to={`/course/${course._id}`} 
                            className="px-3 py-2 rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 text-sm"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );})}
              </div>
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