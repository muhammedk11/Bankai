import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthRoute({ children, guestOnly = false }) {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthRoute;