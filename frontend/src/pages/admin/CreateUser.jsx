import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/Layout";
// import { Card, CardHeader, Input, Select, Button, Alert } from "../../components/ui";
// import api from "../../api/";
import { apiFetch } from "../../api/fetch";

const ROLES = [
  { value: "kepala_dinas", label: "Kepala Dinas" },
  { value: "sekretaris", label: "Sekretaris" },
  { value: "staff_tu", label: "Staff TU" },
  { value: "verifikator", label: "Verifikator" },
  { value: "arsiparis", label: "Arsiparis" },
  { value: "viewer", label: "Viewer" },
];

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nama) errs.nama = "Nama wajib diisi.";
    if (!form.email) errs.email = "Email wajib diisi.";
    if (!form.password) errs.password = "Password wajib diisi.";
    else if (form.password.length < 8) errs.password = "Password minimal 8 karakter.";
    if (!form.role) errs.role = "Role wajib dipilih.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/admin/users", form);
      setAlert({ type: "success", message: "Akun staff berhasil dibuat!" });
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Gagal membuat akun." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Kembali</Button>
        <h1 className="text-xl font-bold text-gray-900">Buat Akun Staff</h1>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div className="max-w-lg mt-4">
        <Card>
          <CardHeader title="Data Akun Baru" subtitle="Akun akan langsung aktif setelah dibuat." />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap" name="nama"
              value={form.nama} onChange={handleChange}
              placeholder="mis. Budi Santoso"
              error={errors.nama} required
            />
            <Input
              label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="budi@dinas.go.id"
              error={errors.email} required
            />
            <Input
              label="Password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="Minimal 8 karakter"
              error={errors.password} required
            />
            <Select
              label="Role" name="role"
              value={form.role} onChange={handleChange}
              options={ROLES}
              error={errors.role} required
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Menyimpan..." : "Buat Akun"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateUser;
