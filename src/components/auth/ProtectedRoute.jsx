import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Role check
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect employees to employee dashboard
    if (currentUser.role === 'employee') {
      return <Navigate to="/employee" />;
    }
    
    // Redirect admin to admin dashboard
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    
    // Fallback to login page
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;