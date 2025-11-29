import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
// import Register from './pages/auth/Register.jsx';
import Shop from './pages/Shop.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import StudentRoute from './components/StudentRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminNavbar from './components/AdminNavbar.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import AdminCourses from './pages/admin/Courses.jsx';
import CoursePreview from './pages/admin/CoursePreview.jsx';
import Orders from './pages/admin/Orders.jsx';
import { logoutUser, fetchMe } from './store/slices/authSlice';
import { fetchMyOrders } from './store/slices/orderSlice';
import { getCartCount } from './store/slices/cartSlice';
// Removed separate admin login; use main login only

function Navbar() {
  const user = useSelector(state => state.auth.user);
  const cartCount = useSelector(state => state.cart.count);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [headerSearch, setHeaderSearch] = useState('');
  
  // Don't show cart count for admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      dispatch(getCartCount());
    }
  }, [user, dispatch]);

  const onLogout = async () => { 
    await dispatch(logoutUser()); 
    navigate('/login'); 
  };

  // Don't render navbar for admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const onHeaderSearchSubmit = (e) => {
    e.preventDefault();
    const query = headerSearch.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-40 shadow-sm border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SkillSwap
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <form onSubmit={onHeaderSearchSubmit} className="hidden md:block">
            <div className="relative">
              <input value={headerSearch} onChange={(e)=>setHeaderSearch(e.target.value)} placeholder="Search courses" className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100" />
              <i className="fas fa-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </form>
          <Link to="/shop" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Shop</Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">About</Link>
          {/* Hide cart for admin users */}
          {!user?.isAdmin && (
            <Link to="/cart" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1 relative">
              <i className="fas fa-shopping-cart"></i>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-200 font-medium">Hi, {user.name}</span>
              <button 
                onClick={onLogout} 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Check if user is logged in on app load
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      dispatch(fetchMyOrders({ limit: 500 }));
    }
  }, [dispatch, user?.id, user?.isAdmin]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Force dark mode globally
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/cart" element={<StudentRoute><Cart /></StudentRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            {/* No separate admin login route */}

            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
            <Route path="/admin/courses/:id" element={<AdminRoute><CoursePreview /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
          </Routes>
        </main>
        {!isAdminRoute && (
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">SkillSwap</h3>
                  <p className="text-gray-400">
                  Learn new skills anytime, anywhere with expert-led courses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/shop?category=development" className="hover:text-white transition-colors">Development</Link></li>
                  <li><Link to="/shop?category=business" className="hover:text-white transition-colors">Business</Link></li>
                  <li><Link to="/shop?category=it" className="hover:text-white transition-colors">IT & Software</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">support@skillswap.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
            </div>
          </div>
        </footer>
        )}
      </div>
    );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
