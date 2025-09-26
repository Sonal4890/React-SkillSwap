import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: adminStats }, { data: ordersRes }, { data: usersRes }] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/orders/admin/all', { params: { limit: 5 } }),
          api.get('/api/admin/users')
        ]);
        setStats({ totalUsers: 0, totalCourses: 0, totalOrders: 0, totalRevenue: 0, ...(adminStats.stats || {}) });
        setRecentOrders((ordersRes.orders || []).slice(0, 5));
        setRecentUsers((usersRes.users || []).slice(0, 5));
      } catch (e) {
        // fail silently for now; could show a toast
      }
    };
    if (user?.isAdmin) load();
  }, [user?.isAdmin]);

  const [search, setSearch] = useState('');
  const filteredOrders = useMemo(() => {
    if (!search) return recentOrders;
    const q = search.toLowerCase();
    return recentOrders.filter(o =>
      (o.user?.name || '').toLowerCase().includes(q) ||
      (o.courses || []).some(c => (c.course?.course_name || '').toLowerCase().includes(q))
    );
  }, [recentOrders, search]);
  const filteredUsers = useMemo(() => {
    if (!search) return recentUsers;
    const q = search.toLowerCase();
    return recentUsers.filter(u =>
      (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    );
  }, [recentUsers, search]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name || 'Admin'}!</p>
            </div>
            <div className="w-full max-w-sm ml-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users and orders" className="w-full px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-100" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-950 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="fas fa-users text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-100">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="fas fa-graduation-cap text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-100">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="fas fa-shopping-cart text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-100">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <i className="fas fa-rupee-sign text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-100">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-gray-950 rounded-lg shadow-sm border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-100">Recent Orders</h2>
                <Link to="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-100">{order.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-400">{order.courses?.map(c => c.course?.course_name).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-100">₹{order.finalAmount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-gray-950 rounded-lg shadow-sm border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-100">Recent Users</h2>
                <Link to="/admin/users" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredUsers.map(u => (
                  <div key={u._id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <i className="fas fa-user text-gray-300"></i>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-100">{u.name}</p>
                      <p className="text-sm text-gray-400">{u.email}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/admin/courses" 
              className="flex items-center p-4 bg-gray-950 border border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-plus-circle text-2xl text-blue-600"></i>
              </div>
              <div>
                <p className="font-medium text-gray-100">Manage Courses</p>
                <p className="text-sm text-gray-400">Create, edit, and manage courses</p>
              </div>
            </Link>
            
            <Link 
              to="/admin/users" 
              className="flex items-center p-4 bg-gray-950 border border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-users text-2xl text-green-600"></i>
              </div>
              <div>
                <p className="font-medium text-gray-100">Manage Users</p>
                <p className="text-sm text-gray-400">View, edit, and manage user accounts</p>
              </div>
            </Link>
            
            <Link 
              to="/admin/orders" 
              className="flex items-center p-4 bg-gray-950 border border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-chart-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <p className="font-medium text-gray-100">View Analytics</p>
                <p className="text-sm text-gray-400">Monitor sales and user analytics</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}