
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

function Account() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-2 text-3xl font-bold text-purple-500">
          My Account
        </h1>

        <p className="mb-8 text-gray-400">
          Manage yourBANKAI VAULT account.
        </p>

        {/* Personal Information */}
        <div className="rounded-xl bg-gray-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Personal Information
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="mt-1 font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Options */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">

          <Link
            to="/orders"
            className="rounded-xl bg-gray-900 p-6 transition hover:bg-gray-800"
          >
            <h2 className="text-lg font-semibold">My Orders</h2>
            <p className="mt-2 text-sm text-gray-400">
              View your orders and purchase history.
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="rounded-xl bg-gray-900 p-6 transition hover:bg-gray-800"
          >
            <h2 className="text-lg font-semibold">My Wishlist</h2>
            <p className="mt-2 text-sm text-gray-400">
              View your saved anime merchandise.
            </p>
          </Link>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Account;
