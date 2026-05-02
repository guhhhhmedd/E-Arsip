import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/Layout";
import { StatCard, Card, CardHeader, Badge, Button, Spinner } from "../components/ui";
import { apiFetch } from "../api/fetch";

// Format tanggal Indonesia
const formatTanggal = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const Dashboard = () => {
  const { user, can } = useAuth();
  const navigate = useNavigate();

  const [stats,   setStats]   = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, aktifRes, draftRes] = await Promise.all([
          api.get("/arsip?limit=5&page=1"),
          api.get("/arsip?status=aktif&limit=1"),
          api.get("/arsip?status=draft&limit=1"),
        ]);

        setStats({
          total:  allRes.data.total,
          aktif:  aktifRes.data.total,
          draft:  draftRes.data.total,
        });
        setRecent(allRes.data.data);
      } catch {
        // gagal ambil data — tampilkan kosong
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppLayout>
      {/* Salam */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Selamat datang, {user?.nama} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Anda login sebagai <span className="font-medium capitalize">{user?.role?.replace("_", " ")}</span>
        </p>
      </div>

      {/* Statistik */}
      {loading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Arsip"   value={stats?.total}  icon="📁" color="blue" />
            <StatCard label="Arsip Aktif"   value={stats?.aktif}  icon="✅" color="emerald" />
            <StatCard label="Menunggu Verifikasi" value={stats?.draft} icon="⏳" color="amber" />
          </div>

          {/* Aksi cepat */}
          {can("upload") && (
            <Card className="mb-6">
              <CardHeader title="Aksi Cepat" />
              <div className="flex flex-wrap gap-3">
                <Button icon="⬆️" onClick={() => navigate("/arsip/upload")}>
                  Upload Arsip Baru
                </Button>
                <Button variant="outline" icon="📋" onClick={() => navigate("/arsip")}>
                  Lihat Semua Arsip
                </Button>
              </div>
            </Card>
          )}

          {/* Arsip terbaru */}
          <Card>
            <CardHeader
              title="Arsip Terbaru"
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate("/arsip")}>
                  Lihat semua →
                </Button>
              }
            />
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Belum ada arsip.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recent.map((arsip) => (
                  <li
                    key={arsip.id}
                    className="flex items-center justify-between py-3 gap-4 cursor-pointer hover:bg-gray-50 -mx-5 px-5 rounded-lg transition"
                    onClick={() => navigate(`/arsip/${arsip.id}`)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{arsip.judul}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {arsip.nomor_arsip} · {formatTanggal(arsip.tanggal_arsip)}
                      </p>
                    </div>
                    <Badge type={arsip.status} label={arsip.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
