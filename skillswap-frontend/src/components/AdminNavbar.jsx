import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';

export default function AdminNavbar() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => { 
    await dispatch(logoutUser()); 
    navigate('/login'); 
  };

  return (
    <header className="bg-gray-900 text-gray-100 border-b border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-crown text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-100">Admin Panel</span>
          </Link>

          {/* Admin Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/admin" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center space-x-2"
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/admin/courses" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center space-x-2"
            >
              <i className="fas fa-book"></i>
              <span>Courses</span>
            </Link>
            <Link 
              to="/admin/users" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center space-x-2"
            >
              <i className="fas fa-users"></i>
              <span>Users</span>
            </Link>
            <Link 
              to="/admin/orders" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center space-x-2"
            >
              <i className="fas fa-shopping-bag"></i>
              <span>Orders</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            {/* Dark mode enforced globally; no toggle */}

            {/* Admin User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="ml-1 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 py-2 space-y-1">
          <Link 
            to="/admin" 
            className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/courses" 
            className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
          >
            <i className="fas fa-book w-5"></i>
            <span>Courses</span>
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
          >
            <i className="fas fa-users w-5"></i>
            <span>Users</span>
          </Link>
          <Link 
            to="/admin/orders" 
            className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
          >
            <i className="fas fa-shopping-bag w-5"></i>
            <span>Orders</span>
          </Link>
          
        </div>
      </div>
    </header>
  );
}
