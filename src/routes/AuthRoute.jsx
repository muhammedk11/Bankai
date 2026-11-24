
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import api from "../services/api";
import { logout } from "../store/slices/authSlice";

function AuthRoute({
  children,
  guestOnly = false,
  monitorOnly = false,
}) {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Fetch the latest customer information
  const { data: latestUser } = useQuery({
    queryKey: ["sessionUser", user?.id],

    queryFn: async () => {
      const response = await api.get(`/users/${user.id}`);
      return response.data;
    },

    enabled: isAuthenticated && Boolean(user?.id),

    // Check account status every 5 seconds
    refetchInterval: 5000,

    refetchOnWindowFocus: true,
  });

  // Logout if the customer is blocked
  useEffect(() => {
    if (latestUser?.isBlocked) {
      dispatch(logout());
    }
  }, [latestUser, dispatch]);

  // Redirect blocked customers
  if (latestUser?.isBlocked) {
    return <Navigate to="/login" replace />;
  }

  // Monitor session without requiring authentication
  if (monitorOnly) {
    return children;
  }

  // Guest-only routes
  if (guestOnly && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  // Protected routes
  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthRoute;
