import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useCart } from "../../hooks/useCart";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { cart } = useCart(user?.id);

  // Calculate total quantity of all cart items
const cartCount = (cart?.items || []).length;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  const productTypes = [
    { name: "Action Figures", value: "figures" },
    { name: "Anime Weapons", value: "weapons" },
    { name: "Clothing", value: "clothing" },
    { name: "Accessories", value: "accessories" },
    { name: "Posters & Wall Art", value: "posters" },
  ];

  const linkStyle = ({ isActive }) =>
    `transition hover:text-purple-400 ${
      isActive ? "text-purple-400" : "text-gray-300"
    }`;

  const getTypePath = (type) => `/products?type=${type}`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider text-purple-500"
        >
          BANKAI
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkStyle}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Cart with quantity */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative transition hover:text-purple-400 ${
                isActive ? "text-purple-400" : "text-gray-300"
              }`
            }
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </NavLink>

          {/* Shop by Anime */}
          <NavLink
            to="/shop-by-anime"
            className={linkStyle}
          >
            Shop by Anime
          </NavLink>

          {/* Shop by Type */}
          <div className="group relative">
            <button className="flex items-center gap-2 text-gray-300 transition hover:text-purple-400">
              Shop by Type
              <span className="text-xs transition group-hover:rotate-180">
                ▼
              </span>
            </button>

            <div className="invisible absolute left-0 top-full z-50 mt-3 w-56 translate-y-2 rounded-xl border border-white/10 bg-zinc-900 p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {productTypes.map((type) => (
                <Link
                  key={type.value}
                  to={getTypePath(type.value)}
                  className="block rounded-lg px-4 py-2.5 text-sm text-gray-300 transition hover:bg-purple-600/20 hover:text-purple-400"
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="group relative">
            <button
              type="button"
              aria-label="Account menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 transition hover:bg-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-52 translate-y-2 rounded-xl border border-white/10 bg-zinc-900 p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">

              {isAuthenticated ? (
                <>
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="font-semibold text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/account"
                    className="block rounded-lg px-4 py-2.5 text-sm text-gray-300 transition hover:bg-purple-600/20 hover:text-purple-400"
                  >
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-lg px-4 py-2.5 text-sm text-gray-300 transition hover:bg-purple-600/20 hover:text-purple-400"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block rounded-lg px-4 py-2.5 text-sm text-gray-300 transition hover:bg-purple-600/20 hover:text-purple-400"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;