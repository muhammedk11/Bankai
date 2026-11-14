
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { cart } = useCart(user?.id);
  const { data: products = [] } = useProducts();

  // Number of unique products in the cart
  const cartCount = (cart?.items || []).length;

  // Filter products for live search suggestions
  const searchResults = products
    .filter((product) => {
      const search = searchTerm.trim().toLowerCase();

      if (!search) return false;

      return [
        product.name,
        product.anime,
        product.type,
        product.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(search)
      );
    })
    .slice(0, 5);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const search = searchTerm.trim();

    if (!search) return;

    navigate(`/products?search=${encodeURIComponent(search)}`);
    setSearchTerm("");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">

        {/* Logo */}

         <Link to="/" className="flex items-center">
             <img
               src="/images/logo/bankai-logo.png"
               alt="BANKAI VAULT"
               className="h-12 w-auto object-contain"
                  />
         </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-80 shrink-0"
        >
          <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900 px-4 focus-within:border-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search anime merchandise..."
              className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Live Suggestions */}
          {searchTerm.trim() && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-3 border-b border-white/5 p-3 transition last:border-0 hover:bg-purple-600/10"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg bg-zinc-800 object-contain p-1"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {product.anime}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-purple-400">
                      {product.price != null
                        ? `$${Number(product.price).toFixed(2)}`
                        : ""}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-gray-400">
                  No products found
                </p>
              )}

              <button
                type="submit"
                className="w-full border-t border-white/10 px-4 py-3 text-sm font-semibold text-purple-400 transition hover:bg-purple-600/10"
              >
                View all results for "{searchTerm}"
              </button>
            </div>
          )}
        </form>

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
