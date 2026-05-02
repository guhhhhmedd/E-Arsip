import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/Layout";
// import { StatCard, Card, CardHeader, Table, Badge, Button, Spinner } from "../../components/ui";
// import api from "../../api/";
import { apiFetch } from "../../api/fetch";

const formatTanggal = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const AdminDashboard = () => {
  const navigate  = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [usersRes, arsipRes, logsRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/arsip?limit=1"),
          api.get("/admin/logs?limit=10"),
        ]);
        setStats({
          totalUser:  usersRes.data.total,
          totalArsip: arsipRes.data.total,
          userAktif:  usersRes.data.data.filter((u) => u.is_active).length,
        });
        setLogs(logsRes.data.data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const logColumns = [
    { key: "nama",       label: "User" },
    { key: "aksi",       label: "Aksi", render: (v) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{v}</span> },
    { key: "keterangan", label: "Keterangan" },
    { key: "created_at", label: "Waktu", render: (v) => formatTanggal(v) },
  ];

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola sistem E-Arsip</p>
        </div>
        <Button icon="➕" onClick={() => navigate("/admin/users/create")}>
          Buat Akun Staff
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total User"   value={stats?.totalUser}  icon="👥" color="blue" />
        <StatCard label="User Aktif"   value={stats?.userAktif}  icon="✅" color="emerald" />
        <StatCard label="Total Arsip"  value={stats?.totalArsip} icon="📁" color="amber" />
      </div>

      {/* Aksi cepat */}
      <Card className="mb-6">
        <CardHeader title="Kelola" />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" icon="👥" onClick={() => navigate("/admin/users")}>
            Daftar User
          </Button>
          <Button variant="outline" icon="📁" onClick={() => navigate("/arsip")}>
            Lihat Arsip
          </Button>
        </div>
      </Card>

      {/* Log aktivitas */}
      <Card>
        <CardHeader title="Aktivitas Terbaru" subtitle="10 aktivitas terakhir di sistem" />
        <Table columns={logColumns} data={logs} emptyText="Belum ada aktivitas." />
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
