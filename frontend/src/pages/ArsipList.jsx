import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/Layout";
import { Card, Input, Select, Button, Badge, Table, Pagination, Spinner, EmptyState } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";

const formatTanggal = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ArsipList = () => {
  const { can } = useAuth();
  const navigate = useNavigate();

  const [arsip,      setArsip]      = useState([]);
  const [kategori,   setKategori]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filter, setFilter] = useState({
    search: "", kategori_id: "", status: "", tanggal_dari: "", tanggal_sampai: "",
  });

  const fetchArsip = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 15 });
      Object.entries(filter).forEach(([k, v]) => { if (v) params.append(k, v); });

      const res = await api.get(`/arsip?${params}`);
      setArsip(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch {
      setArsip([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { api.get("/arsip/kategori").then((r) => setKategori(r.data.data)); }, []);
  useEffect(() => { fetchArsip(page); }, [page]);                // eslint-disable-line

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchArsip(1); };
  const handleReset  = () => {
    setFilter({ search: "", kategori_id: "", status: "", tanggal_dari: "", tanggal_sampai: "" });
    setPage(1);
    setTimeout(() => fetchArsip(1), 0);
  };

  const columns = [
    { key: "nomor_arsip", label: "No. Arsip", width: "130px" },
    {
      key: "judul", label: "Judul",
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{val}</p>
          <p className="text-xs text-gray-400">{row.nama_kategori}</p>
        </div>
      ),
    },
    { key: "tanggal_arsip", label: "Tanggal", render: (v) => formatTanggal(v) },
    { key: "dibuat_oleh",   label: "Dibuat Oleh" },
    { key: "file_size",     label: "Ukuran", render: (v) => formatBytes(v) },
    {
      key: "status", label: "Status",
      render: (v) => <Badge type={v} label={v} />,
    },
    {
      key: "id", label: "Aksi",
      render: (id) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/arsip/${id}`)}>
          Lihat →
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Daftar Arsip</h1>
        {can("upload") && (
          <Button icon="⬆️" onClick={() => navigate("/arsip/upload")}>
            Upload Arsip
          </Button>
        )}
      </div>

      {/* Filter */}
      <Card className="mb-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            name="search"
            placeholder="Cari judul / nomor arsip..."
            value={filter.search}
            onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
            icon="🔍"
          />
          <Select
            name="kategori_id"
            value={filter.kategori_id}
            onChange={(e) => setFilter((p) => ({ ...p, kategori_id: e.target.value }))}
            placeholder="Semua Kategori"
            options={kategori.map((k) => ({ value: k.id, label: `${k.kode} — ${k.nama_kategori}` }))}
          />
          <Select
            name="status"
            value={filter.status}
            onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}
            placeholder="Semua Status"
            options={[
              { value: "draft",   label: "Draft" },
              { value: "aktif",   label: "Aktif" },
              { value: "inaktif", label: "Inaktif" },
            ]}
          />
          <Input
            name="tanggal_dari"
            type="date"
            label="Dari Tanggal"
            value={filter.tanggal_dari}
            onChange={(e) => setFilter((p) => ({ ...p, tanggal_dari: e.target.value }))}
          />
          <Input
            name="tanggal_sampai"
            type="date"
            label="Sampai Tanggal"
            value={filter.tanggal_sampai}
            onChange={(e) => setFilter((p) => ({ ...p, tanggal_sampai: e.target.value }))}
          />
          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1">Cari</Button>
            <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
          </div>
        </form>
      </Card>

      {/* Tabel */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : arsip.length === 0 ? (
        <EmptyState
          title="Arsip tidak ditemukan"
          subtitle="Coba ubah filter pencarian"
          action={can("upload") && (
            <Button onClick={() => navigate("/arsip/upload")}>Upload Arsip Baru</Button>
          )}
        />
      ) : (
        <>
          <Table columns={columns} data={arsip} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </AppLayout>
  );
};

export default ArsipList;
