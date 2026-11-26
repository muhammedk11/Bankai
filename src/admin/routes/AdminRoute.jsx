import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { admin, isAuthenticated } = useSelector((state) => state.adminAuth);
   
if (!isAuthenticated || !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
