import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchAllCourses, searchCourses, fetchCoursesByCategory } from '../store/slices/coursesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector(s => s.auth);
  const { list, searchResults, categoryResults, pagination, loading } = useSelector(s => s.courses);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'business', label: 'Business' },
    { value: 'it', label: 'IT & Software' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'course_name', label: 'Name: A to Z' },
    { value: 'enrolledCount', label: 'Most Popular' }
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('search', searchQuery);
      dispatch(searchCourses(searchQuery));
    } else if (selectedCategory) {
      params.set('category', selectedCategory);
      dispatch(fetchCoursesByCategory(selectedCategory));
    } else {
      dispatch(fetchAllCourses({
        page: currentPage,
        category: selectedCategory,
        sort: sortBy,
        order: sortOrder
      }));
    }
    
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'createdAt') params.set('sort', sortBy);
    if (sortOrder !== 'desc') params.set('order', sortOrder);
    if (currentPage > 1) params.set('page', currentPage);
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, currentPage, dispatch, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

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

  const dedupe = (arr) => {
    const seen = new Set();
    const out = [];
    for (const c of arr || []) {
      if (c && !seen.has(c._id)) {
        seen.add(c._id);
        out.push(c);
      }
    }
    return out;
  };

  const getDisplayCourses = () => {
    if (searchQuery) return dedupe(searchResults);
    if (selectedCategory) return dedupe(categoryResults);
    return dedupe(list);
  };

  const courses = getDisplayCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Next Skill
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Explore our curated collection of expert-led courses designed to accelerate your career
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for courses, skills, or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm text-lg"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-300">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>

            {/* Category Filter */}
            <div className="lg:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm text-lg font-medium"
              >
                <option value="">🎯 All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm text-lg font-medium"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {courses.length} of {pagination.total} courses
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
              </p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <div 
                  key={course._id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.course_image} 
                      alt={course.course_name} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-bold rounded-full text-gray-800">
                        {categories.find(c => c.value === course.category)?.label || course.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => handleAddToWishlist(course._id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Add to Wishlist"
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link 
                        to={`/course/${course._id}`} 
                        className="w-full py-2 px-4 bg-white/90 backdrop-blur-sm rounded-xl text-center font-semibold text-gray-800 hover:bg-white transition-all duration-300"
                      >
                        View Details
                      </Link>
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
                        <span className="text-sm text-gray-500">({course.rating || 4.8})</span>
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
                      <button 
                        onClick={() => handleAddToCart(course._id)}
                        className="px-4 py-3 rounded-2xl border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105"
                        title="Add to Cart"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                    {course.enrolledCount > 0 && (
                      <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500">
                          <i className="fas fa-users mr-1"></i>
                          {course.enrolledCount} students enrolled
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No courses found for "${searchQuery}"` : 'No courses available in this category'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}