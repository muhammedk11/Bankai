
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Cart", path: "/cart" },
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

          {/* Account */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="rounded-lg bg-purple-600 px-5 py-2 font-medium transition hover:bg-purple-700"
          >
            Account
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
