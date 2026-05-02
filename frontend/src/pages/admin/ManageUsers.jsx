import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/Layout";
// import { Card, Table, Badge, Button, Modal, Select, Input, Alert, Spinner } from "../../components/ui";
// import api from "../../api/";
import { apiFetch } from "../../api/fetch";

const ROLES = [
  { value: "kepala_dinas", label: "Kepala Dinas" },
  { value: "sekretaris",   label: "Sekretaris" },
  { value: "staff_tu",     label: "Staff TU" },
  { value: "verifikator",  label: "Verifikator" },
  { value: "arsiparis",    label: "Arsiparis" },
  { value: "viewer",       label: "Viewer" },
];

const ManageUsers = () => {
  const navigate = useNavigate();

  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ type: "", message: "" });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm,  setEditForm]  = useState({ nama: "", role: "", is_active: "1" });
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${search}` : "";
      const res    = await api.get(`/admin/users${params}`);
      setUsers(res.data.data);
    } catch {
      setAlert({ type: "error", message: "Gagal memuat data user." });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openEdit = (user) => {
    setEditForm({ nama: user.nama, role: user.role, is_active: user.is_active ? "1" : "0" });
    setEditModal({ open: true, user });
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/users/${editModal.user.id}`, {
        nama:      editForm.nama,
        role:      editForm.role,
        is_active: editForm.is_active === "1",
      });
      setAlert({ type: "success", message: "Data user berhasil diperbarui." });
      setEditModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  const handleNonaktif = async (user) => {
    if (!window.confirm(`Nonaktifkan akun ${user.nama}?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setAlert({ type: "success", message: `Akun ${user.nama} berhasil dinonaktifkan.` });
      fetchUsers();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Gagal menonaktifkan." });
    }
  };

  const columns = [
    { key: "nama",       label: "Nama" },
    { key: "email",      label: "Email" },
    {
      key: "role", label: "Role",
      render: (v) => <Badge type={v} label={v.replace("_", " ")} />,
    },
    {
      key: "is_active", label: "Status",
      render: (v) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {v ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "id", label: "Aksi",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
          {row.is_active && (
            <Button size="sm" variant="danger" onClick={() => handleNonaktif(row)}>Nonaktifkan</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola User</h1>
        <Button icon="➕" onClick={() => navigate("/admin/users/create")}>
          Buat Akun Staff
        </Button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <Card className="mt-4">
        <div className="mb-4 flex gap-3">
          <Input
            name="search"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="🔍"
            className="max-w-xs"
          />
          <Button variant="outline" onClick={fetchUsers}>Cari</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : (
          <Table columns={columns} data={users} emptyText="Tidak ada user ditemukan." />
        )}
      </Card>

      {/* Modal edit */}
      <Modal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title={`Edit User: ${editModal.user?.nama}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModal({ open: false, user: null })}>Batal</Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama"
            name="nama"
            value={editForm.nama}
            onChange={(e) => setEditForm((p) => ({ ...p, nama: e.target.value }))}
          />
          <Select
            label="Role"
            name="role"
            value={editForm.role}
            onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
            options={ROLES}
          />
          <Select
            label="Status Akun"
            name="is_active"
            value={editForm.is_active}
            onChange={(e) => setEditForm((p) => ({ ...p, is_active: e.target.value }))}
            options={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Nonaktif" },
            ]}
          />
        </div>
      </Modal>
    </AppLayout>
  );
};

export default ManageUsers;
