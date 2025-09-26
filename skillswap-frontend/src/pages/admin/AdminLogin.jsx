import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';

export default function AdminLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector(s => s.auth);

	const onSubmit = async (e) => {
		e.preventDefault();
		const res = await dispatch(loginUser({ email, password }));
		if (res.meta.requestStatus === 'fulfilled') {
			const isAdmin = res.payload?.user?.isAdmin;
			navigate(isAdmin ? '/admin' : '/');
		}
	};

	return (
		<div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
			<div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
				<div className="p-8 sm:p-12 flex items-center">
					<form onSubmit={onSubmit} className="w-full space-y-6">
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Login</h1>
							<p className="mt-2 text-gray-600">Sign in to manage courses, users, and orders.</p>
						</div>
						{error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-gray-50" placeholder="admin@skillswap.com" required />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-gray-50" placeholder="••••••••" required />
						</div>
						<button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">{loading ? 'Signing in…' : 'Sign In'}</button>
						<div className="text-sm text-gray-600 flex items-center justify-between">
							<Link to="/" className="text-blue-600 hover:text-blue-700 underline">Back to site</Link>
							<Link to="/login" className="text-gray-600 hover:text-gray-700 underline">Student login</Link>
						</div>
					</form>
				</div>
				<div className="hidden lg:flex relative bg-gradient-to-br from-purple-600 to-blue-700 text-white items-center justify-center">
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
					<div className="relative p-12 text-center">
						<h2 className="text-4xl font-extrabold mb-3">Admin Panel</h2>
						<p className="text-blue-100">Securely manage platform data and keep courses fresh.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
