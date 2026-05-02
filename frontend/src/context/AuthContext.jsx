import { createContext, useContext, useState, useCallback } from "react";
import { apiFetch } from "../api/fetch";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Gunakan apiFetch dengan method POST
      const res = await apiFetch("/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Sesuaikan dengan struktur JSON dari backend
      const { token, user: userData } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (err) {
      const msg = err.message || "Login gagal.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  const can = useCallback((action) => {
    const permissions = {
      upload: ["admin", "sekretaris", "staff_tu", "arsiparis"],
      edit: ["admin", "sekretaris", "staff_tu", "arsiparis"],
      verifikasi: ["admin", "verifikator"],
      hapus: ["admin"],
      kelola_user: ["admin"],
    };
    return permissions[action]?.includes(user?.role) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);