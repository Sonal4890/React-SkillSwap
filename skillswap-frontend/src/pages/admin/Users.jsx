import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const { data } = await api.get('/api/admin/users');
			setUsers(data.users || []);
		} catch (e) {
			setError(e.response?.data?.message || 'Failed to load users');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchUsers(); }, []);

	const toggleBlock = async (id) => {
		try {
			await api.put(`/api/admin/users/${id}/block`);
			setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
		} catch (e) {
			alert(e.response?.data?.message || 'Action failed');
		}
	};

	const removeUser = async (id) => {
		if (!confirm('Delete this user?')) return;
		try {
			await api.delete(`/api/admin/users/${id}`);
			setUsers(prev => prev.filter(u => u._id !== id));
		} catch (e) {
			alert(e.response?.data?.message || 'Delete failed');
		}
	};

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-100">Users</h1>
					<p className="text-gray-400">Manage user accounts and permissions</p>
				</div>

				<div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-800">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-100">All Users</h2>
							<button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								<i className="fas fa-rotate mr-2"></i>
								Refresh
							</button>
						</div>
					</div>

					{error && (
						<div className="px-6 py-3 text-red-400 bg-red-900/20 border-b border-red-900/30">{error}</div>
					)}

					<div className="overflow-x-auto">
						{loading ? (
							<div className="p-8 text-center text-gray-400">Loading…</div>
						) : (
							<table className="min-w-full divide-y divide-gray-800">
								<thead className="bg-gray-900">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-gray-950 divide-y divide-gray-800">
									{users.map(user => (
										<tr key={user._id} className="hover:bg-gray-900">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
														<i className="fas fa-user text-gray-300"></i>
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-100">{user.name}</div>
														<div className="text-sm text-gray-400">{user.email}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
													user.role === 'admin' 
														? 'bg-red-900/30 text-red-300'
													: user.role === 'instructor'
														? 'bg-blue-900/30 text-blue-300'
														: 'bg-green-900/30 text-green-300'
												}`}> {user.role} </span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-gray-800 text-gray-300' : 'bg-green-900/30 text-green-300'}`}>{user.isBlocked ? 'blocked' : 'active'}</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
						<div className="flex space-x-2">
							{user.role !== 'admin' && !user.isAdmin ? (
								<button onClick={() => toggleBlock(user._id)} className="text-blue-400 hover:text-blue-300" title="Block/Unblock">
									<i className="fas fa-user-slash"></i>
								</button>
							) : (
								<span className="text-gray-500 cursor-not-allowed" title="Cannot block admin users">
									<i className="fas fa-user-slash"></i>
								</span>
							)}
						</div>
											</td>
									</tr>
								))}
							</tbody>
						</table>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}