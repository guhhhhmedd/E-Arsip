import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui";

// Definisi menu per role
const MENU_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: "🏠",
    roles: ["kepala_dinas", "sekretaris", "staff_tu", "verifikator", "arsiparis", "viewer"],
  },
  {
    label: "Semua Arsip",
    to: "/arsip",
    icon: "📁",
    roles: ["kepala_dinas", "sekretaris", "staff_tu", "verifikator", "arsiparis", "viewer"],
  },
  {
    label: "Upload Arsip",
    to: "/arsip/upload",
    icon: "⬆️",
    roles: ["sekretaris", "staff_tu", "arsiparis"],
  },
  {
    label: "Profil Saya",
    to: "/profile",
    icon: "👤",
    roles: ["kepala_dinas", "sekretaris", "staff_tu", "verifikator", "arsiparis", "viewer"],
  },
];

const ADMIN_MENU = [
  { label: "Dashboard Admin", to: "/admin",              icon: "📊" },
  { label: "Kelola User",     to: "/admin/users",        icon: "👥" },
  { label: "Buat Akun Staff", to: "/admin/users/create", icon: "➕" },
];

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
       ${isActive
         ? "bg-blue-600 text-white shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
       }`
    }
  >
    <span className="text-base leading-none">{icon}</span>
    {label}
  </NavLink>
);

const Sidebar = ({ onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenu = MENU_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            EA
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">E-Arsip</p>
            <p className="text-xs text-gray-400">Dinas Pemerintahan</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900 truncate">{user?.nama}</p>
        <div className="mt-1">
          <Badge type={user?.role} label={user?.role?.replace("_", " ")} />
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isAdmin ? (
          <>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin Panel
            </p>
            {ADMIN_MENU.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </>
        ) : (
          <>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </p>
            {userMenu.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
