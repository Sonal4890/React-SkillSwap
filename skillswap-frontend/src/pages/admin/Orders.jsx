import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrdersAdmin, fetchOrderStatsAdmin } from '../../store/slices/orderSlice';
import { api } from '../../lib/api';

export default function Orders() {
  const dispatch = useDispatch();
  const ordersState = useSelector(s => s.orders);
  const auth = useSelector(s => s.auth);
  const admin = ordersState?.admin || { list: [], stats: null, total: 0, currentPage: 1 };
  const loading = ordersState?.loading;
  const error = ordersState?.error;
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (auth?.user?.isAdmin) {
      dispatch(fetchAllOrdersAdmin(statusFilter ? { status: statusFilter } : {}));
      dispatch(fetchOrderStatsAdmin());
    }
  }, [dispatch, statusFilter, auth?.user?.isAdmin]);

  const orders = useMemo(() => admin.list || [], [admin.list]);
  const [editMap, setEditMap] = useState({}); // { [orderId]: { status, paymentStatus } }

  const truncate = (text, max = 28) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  const startEdit = (order) => {
    setEditMap(prev => ({ ...prev, [order._id]: { status: order.status, paymentStatus: order.paymentStatus, saving: false } }));
  };

  const cancelEdit = (orderId) => {
    setEditMap(prev => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
  };

  const changeEdit = (orderId, field, value) => {
    setEditMap(prev => ({ ...prev, [orderId]: { ...prev[orderId], [field]: value } }));
  };

  const saveEdit = async (orderId) => {
    const data = editMap[orderId];
    if (!data) return;
    try {
      setEditMap(prev => ({ ...prev, [orderId]: { ...prev[orderId], saving: true } }));
      const res = await api.put(`/api/orders/${orderId}`, { status: data.status, paymentStatus: data.paymentStatus });
      // refresh list quickly
      dispatch(fetchAllOrdersAdmin(statusFilter ? { status: statusFilter } : {}));
      cancelEdit(orderId);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update order');
      setEditMap(prev => ({ ...prev, [orderId]: { ...prev[orderId], saving: false } }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Orders</h1>
          <p className="text-gray-400">Manage orders and payments</p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-100">All Orders</h2>
              <div className="flex space-x-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg text-sm">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          <div>
            <table className="w-full table-fixed divide-y divide-gray-800">
              <thead className="bg-gray-900 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-24">Order</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-56">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-24">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-28">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-32">Payment</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-28">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-400 uppercase tracking-wider w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-950 divide-y divide-gray-800 text-sm">
                {error && (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-red-400">{error}</td>
                  </tr>
                )}
                {loading && orders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Loading orders...</td>
                  </tr>
                )}
                {!loading && orders.length === 0 && !error && (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No orders found</td>
                  </tr>
                )}
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-900 align-top">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-100">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium text-gray-100 leading-tight">{order.user?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-400 leading-tight break-words">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 break-words text-gray-100">
                      {truncate(order.courses?.map(c => c.course?.course_name).join(', '), 34)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-100">
                      ₹{order.finalAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editMap[order._id] ? (
                        <select value={editMap[order._id].status} onChange={(e)=>changeEdit(order._id,'status',e.target.value)} className="px-2 py-1 border border-gray-800 bg-gray-900 text-gray-100 rounded text-sm">
                          <option value="pending">pending</option>
                          <option value="processing">processing</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                          <option value="refunded">refunded</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-900/30 text-green-300'
                            : order.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-200'
                            : 'bg-red-900/30 text-red-300'
                        }`}>
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {editMap[order._id] ? (
                          <>
                            <select value={editMap[order._id].paymentStatus} onChange={(e)=>changeEdit(order._id,'paymentStatus',e.target.value)} className="px-2 py-1 border border-gray-800 bg-gray-900 text-gray-100 rounded text-sm">
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="failed">failed</option>
                              <option value="refunded">refunded</option>
                            </select>
                            <span className="text-xs text-gray-400 ml-1">{order.paymentMethod}</span>
                          </>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.paymentStatus === 'paid' 
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-yellow-900/30 text-yellow-200'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <span className="text-xs text-gray-400">{order.paymentMethod}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium">
                      <div className="flex space-x-2">
                        {!editMap[order._id] ? (
                          <>
                            <button className="text-blue-400 hover:text-blue-300" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button onClick={()=>startEdit(order)} className="text-green-400 hover:text-green-300" title="Update Status">
                              <i className="fas fa-edit"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button disabled={editMap[order._id].saving} onClick={()=>saveEdit(order._id)} className="text-green-400 hover:text-green-300 disabled:opacity-50" title="Save">
                              <i className="fas fa-check"></i>
                            </button>
                            <button disabled={editMap[order._id].saving} onClick={()=>cancelEdit(order._id)} className="text-gray-400 hover:text-gray-200 disabled:opacity-50" title="Cancel">
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="fas fa-check-circle text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-100">{admin.stats?.completedOrders ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="fas fa-clock text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-100">{admin.stats?.pendingOrders ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="fas fa-rupee-sign text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-100">₹{admin.stats?.totalRevenue ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <i className="fas fa-chart-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-100">₹{orders.length ? Math.round(orders.reduce((s, o) => s + (o.finalAmount || 0), 0) / orders.length) : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}