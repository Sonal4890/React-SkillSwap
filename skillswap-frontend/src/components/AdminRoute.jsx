import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector(s => s.auth);

  // Wait for auth check to finish on page load (new tab)
  if (loading) {
    return null;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
}
