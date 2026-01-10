import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const role = localStorage.getItem('role');

  if (!role || role !== 'customer') return <Navigate to="/login" />;

  return children;
}
