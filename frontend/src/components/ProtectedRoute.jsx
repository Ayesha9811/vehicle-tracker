import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('currentUser');
  
  if (token && !currentUser) {
    // Clear out legacy logged-in state so they can use new auth
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;