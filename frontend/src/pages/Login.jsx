import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // "user" | "admin"
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.username, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-3.5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SA</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900">Sistem Arsip Digital</p>
            <p className="text-xs text-gray-500">Dinas Pendidikan</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Tentang</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Layanan</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Informasi</a>
        </div>
        <button className="px-4 py-1.5 border-2 border-gray-900 rounded-md text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
          Login
        </button>
      </nav>

      {/* Main */}
      <div className="flex flex-1">

        {/* Kiri — Form */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 flex items-center justify-center px-8 py-12">
          <div className="w-full bg-gray-100 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 text-center">Masuk Ke Sistem</h2>
            <p className="text-xs text-gray-500 text-center mt-1 mb-5">
              Silahkan Masuk Untuk Melanjutkan Ke Sistem
            </p>

            {/* Role Toggle */}
            <div className="flex justify-center gap-2 mb-5">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-5 py-1.5 text-xs font-medium rounded-md border-2 border-gray-900 transition-colors capitalize
                    ${role === r ? "bg-gray-900 text-white" : "bg-white text-gray-900 hover:bg-gray-50"}`}
                >
                  {r === "user" ? "User" : "Admin"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <Alert type="error" message={error} onClose={() => setError("")} />}

              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username anda"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password anda"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                value={role}
                readOnly
                placeholder="login sebagai"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-400 focus:outline-none cursor-default"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* Kanan — Hero */}
        <div className="flex-1 flex flex-col justify-center px-14 py-12">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
            Sistem Terintegrasi
          </p>
          <h1 className="text-4xl font-medium text-gray-900 leading-snug mb-4">
            Kelola Arsip Digital Lebih<br />Mudah &amp; Cepat
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mb-8">
            Sistem terintegrasi untuk penyimpanan, pencarian, dan manajemen
            dokumen Dinas Pendidikan yang aman, efisien, dan terpercaya
          </p>
          <ul className="space-y-2.5 mb-10">
            {["Penyimpanan Arsip Terpusat", "Pencarian Cepat & Akurat", "Keamanan Data Terjamin", "Akses Mudah Kapan Saja"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">KEM</div>
          <div className="w-9 h-9 rounded-md bg-orange-100 flex items-center justify-center text-xs font-medium text-orange-700">DIN</div>
        </div>
        <p className="text-xs text-gray-400">
          Sistem Ini Digunakan oleh Dinas Pendidikan untuk pengelolaan digital secara terintegrasi
        </p>
      </footer>
    </div>
  );
};

export default Login;