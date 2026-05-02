import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

// ── ProtectedRoute ────────────────────────────────────────────────────────────
// Jika belum login → redirect ke /login
// Jika allowedRoles diberikan & role tidak cocok → redirect ke /dashboard atau /admin
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

// ── AppLayout ─────────────────────────────────────────────────────────────────
// Wrapper utama untuk semua halaman yang membutuhkan login
export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar mobile (overlay) */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 md:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Konten utama */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};
