import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../store/slices/authSlice';

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector(s => s.auth);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) return;
		const res = await dispatch(registerUser({ name, email, password }));
		if (res.meta.requestStatus === 'fulfilled') {
			navigate('/login');
		}
	};

	return (
		<div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
			<div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
				{/* Left: Form */}
				<div className="p-8 sm:p-12 flex items-center">
					<form onSubmit={onSubmit} className="w-full space-y-6">
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create your account</h1>
							<p className="mt-2 text-gray-600">Join SkillSwap to start learning today.</p>
						</div>
						{error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
						<div>
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input type="text" value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" placeholder="Your name" required />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" placeholder="you@example.com" required />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" placeholder="••••••••" required />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Confirm Password</label>
							<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" placeholder="••••••••" required />
						</div>

						<button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
							{loading ? 'Creating…' : 'Create account'}
						</button>

						<p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 underline hover:text-blue-700">Login</Link></p>

						<div className="pt-2">
							<p className="text-xs text-gray-500 mb-3">Or sign up with</p>
							<div className="flex items-center gap-3">
								<button type="button" className="flex-1 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50">
									<i className="fab fa-google text-red-500"></i>
									<span className="ml-2 text-sm font-medium">Google</span>
								</button>
								<button type="button" className="flex-1 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50">
									<i className="fab fa-github"></i>
									<span className="ml-2 text-sm font-medium">GitHub</span>
								</button>
							</div>
						</div>
					</form>
				</div>

				{/* Right: Toggle/Welcome visuals */}
				<div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 to-purple-700 text-white items-center justify-center">
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
					<div className="relative p-12 text-center">
						<h2 className="text-4xl font-extrabold mb-3">Join SkillSwap</h2>
						<p className="text-blue-100">Learn from experts, build projects, and grow your career.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
