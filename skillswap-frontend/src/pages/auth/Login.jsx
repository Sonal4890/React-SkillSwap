import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../store/slices/authSlice';
import './auth.css';

export default function AuthPortal() {
	const [active, setActive] = useState(false); // false = Login, true = Register
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [blockedError, setBlockedError] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector(s => s.auth);

	// Check for blocked error from sessionStorage
	useEffect(() => {
		const blockedMsg = sessionStorage.getItem('blockedError');
		if (blockedMsg) {
			setBlockedError(blockedMsg);
			sessionStorage.removeItem('blockedError');
		}
	}, []);

	const onLogin = async (e) => {
		e.preventDefault();
		const res = await dispatch(loginUser({ email: loginEmail, password: loginPassword }));
		if (res.meta.requestStatus === 'fulfilled') {
			const isAdmin = res.payload?.user?.isAdmin;
			navigate(isAdmin ? '/admin' : '/');
		}
	};

	const onRegister = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) return;
		const res = await dispatch(registerUser({ name, email, password }));
		if (res.meta.requestStatus === 'fulfilled') {
			setActive(false);
		}
	};

	return (
		<div className="auth-portal min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
			<div className={`container ${active ? 'active' : ''}`}>
				{/* Login */}
				<div className="form-box login">
					<form onSubmit={onLogin}>
						<h1>Login</h1>
						{!active && (error || blockedError) && <div className="error mt-4">{error || blockedError}</div>}
						<div className="input-box">
							<input type="email" placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} required />
							<i className="bx bxs-user"></i>
						</div>
						<div className="input-box">
							<input type="password" placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} required />
							<i className="bx bxs-lock-alt"></i>
						</div>
						<button type="submit" className="btn" disabled={loading}>{loading ? 'Logging in…' : 'Log In'}</button>
					</form>
				</div>

				{/* Register */}
				<div className="form-box register">
					<form onSubmit={onRegister}>
						<h1>Registration</h1>
						{active && error && <div className="error">{error}</div>}
						<div className="input-box">
							<input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
							<i className="bx bxs-user"></i>
						</div>
						<div className="input-box">
							<input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
							<i className="bx bxs-envelope"></i>
						</div>
						<div className="input-box">
							<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
							<i className="bx bxs-lock-alt"></i>
						</div>
						<div className="input-box">
							<input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
							<i className="bx bxs-lock-alt"></i>
						</div>
						<button type="submit" className="btn" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
					</form>
				</div>

				{/* Toggle panels */}
				<div className="toggle-box">
					<div className="toggle-panel toggle-left">
						<h1>Hello, Welcome!</h1>
						<p className="toggle-subtitle">Don't have an account?</p>
						<button className="btn" onClick={() => setActive(true)}>Register</button>
						<div className="social-row">
							<a href="#" aria-label="Login with Google"><i className="bx bxl-google"></i></a>
							<a href="#" aria-label="Login with GitHub"><i className="bx bxl-github"></i></a>
							<a href="#" aria-label="Login with LinkedIn"><i className="bx bxl-linkedin"></i></a>
						</div>
					</div>
					<div className="toggle-panel toggle-right">
						<h1>Welcome Back</h1>
						<p className="toggle-subtitle">Already have an account?</p>
						<button className="btn" onClick={() => setActive(false)}>Login</button>
						<div className="social-row">
							<a href="#" aria-label="Login with Google"><i className="bx bxl-google"></i></a>
							<a href="#" aria-label="Login with GitHub"><i className="bx bxl-github"></i></a>
							<a href="#" aria-label="Login with LinkedIn"><i className="bx bxl-linkedin"></i></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
