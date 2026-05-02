import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Hamburger (mobile) */}
      <button
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        onClick={onMenuToggle}
      >
        ☰
      </button>

      {/* Judul halaman diambil dari document title — bisa dikembangkan */}
      <div className="hidden md:block" />

      {/* Kanan: info user */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.nama}</span>
          <span className="text-gray-400 text-xs">▾</span>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Login sebagai</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
              </div>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                👤 Profil Saya
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
