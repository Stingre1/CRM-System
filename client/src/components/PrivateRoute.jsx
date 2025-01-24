import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasPermission } from '../utils/auth';

const PrivateRoute = ({ children, requiredRole }) => {
  // console.log(`Private Route:\nchildren: ${children}\nrequiredRole: ${requiredRole}`);
  const authenticated = isAuthenticated();
  const hasAccess = requiredRole ? hasPermission(requiredRole) : true;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;