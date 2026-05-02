import { useState } from "react";
import { AppLayout } from "../components/Layout";
import { Card, CardHeader, Input, Button, Alert, Badge } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";

const Profile = () => {
  const { user } = useAuth();

  const [nama,    setNama]    = useState(user?.nama || "");
  const [passForm, setPassForm] = useState({ password_lama: "", password_baru: "", konfirmasi: "" });
  const [alert,   setAlert]   = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdateNama = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/users/profile", { nama });
      setAlert({ type: "success", message: "Nama berhasil diperbarui." });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Gagal memperbarui." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePass = async (e) => {
    e.preventDefault();
    if (passForm.password_baru !== passForm.konfirmasi) {
      setAlert({ type: "error", message: "Konfirmasi password tidak cocok." });
      return;
    }
    if (passForm.password_baru.length < 8) {
      setAlert({ type: "error", message: "Password baru minimal 8 karakter." });
      return;
    }
    setLoading(true);
    try {
      await api.put("/users/profile", {
        password_lama: passForm.password_lama,
        password_baru: passForm.password_baru,
      });
      setAlert({ type: "success", message: "Password berhasil diubah." });
      setPassForm({ password_lama: "", password_baru: "", konfirmasi: "" });
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Gagal mengubah password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profil Saya</h1>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div className="max-w-xl space-y-5 mt-4">
        {/* Info akun */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
              {user?.nama?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.nama}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-1">
                <Badge type={user?.role} label={user?.role?.replace("_", " ")} />
              </div>
            </div>
          </div>
        </Card>

        {/* Edit nama */}
        <Card>
          <CardHeader title="Ubah Nama" />
          <form onSubmit={handleUpdateNama} className="space-y-4">
            <Input
              label="Nama Lengkap" name="nama"
              value={nama} onChange={(e) => setNama(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>Simpan Nama</Button>
          </form>
        </Card>

        {/* Ganti password */}
        <Card>
          <CardHeader title="Ganti Password" />
          <form onSubmit={handleUpdatePass} className="space-y-4">
            <Input
              label="Password Lama" name="password_lama" type="password"
              value={passForm.password_lama}
              onChange={(e) => setPassForm((p) => ({ ...p, password_lama: e.target.value }))}
              required
            />
            <Input
              label="Password Baru" name="password_baru" type="password"
              value={passForm.password_baru}
              onChange={(e) => setPassForm((p) => ({ ...p, password_baru: e.target.value }))}
              placeholder="Minimal 8 karakter"
              required
            />
            <Input
              label="Konfirmasi Password Baru" name="konfirmasi" type="password"
              value={passForm.konfirmasi}
              onChange={(e) => setPassForm((p) => ({ ...p, konfirmasi: e.target.value }))}
              required
            />
            <Button type="submit" disabled={loading}>Ubah Password</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
