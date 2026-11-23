
import { NavLink } from "react-router-dom";

function AdminSidebar() {
 const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Products", path: "/admin/products" },
  { name: "Users", path: "/admin/users" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Trash", path: "/admin/trash" },
];

  return (
    <aside className="w-64 min-h-screen bg-[#15151f] border-r border-white/10 p-6">
      <h1 className="text-2xl font-bold text-white mb-10">
        BANKAI
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
