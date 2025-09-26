import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function StudentRoute({ children }) {
  const { user, loading } = useSelector(s => s.auth);
  
  // Wait for authentication check to complete
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/admin" replace />;
  return children;
}


