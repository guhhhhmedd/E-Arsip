import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/Layout";
// import { Card, CardHeader, Input, Select, Textarea, Button, Alert } from "../components/ui";
// import api from "../api/";
import { apiFetch } from "../api/fetch";

const MAX_MB = 10;

const UploadArsip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomor_arsip: "", judul: "", deskripsi: "",
    kategori_id: "", tanggal_arsip: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    api.get("/arsip/kategori").then((r) => setKategori(r.data.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, file: `Ukuran file maksimal ${MAX_MB}MB.` }));
      return;
    }
    setFile(f);
    setErrors((p) => ({ ...p, file: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nomor_arsip)  errs.nomor_arsip  = "Nomor arsip wajib diisi.";
    if (!form.judul)         errs.judul         = "Judul wajib diisi.";
    if (!form.kategori_id)   errs.kategori_id   = "Kategori wajib dipilih.";
    if (!form.tanggal_arsip) errs.tanggal_arsip = "Tanggal wajib diisi.";
    if (!file)               errs.file          = "File arsip wajib dilampirkan.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("file", file);

    try {
      await api.post("/arsip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlert({ type: "success", message: "Arsip berhasil diunggah! Menunggu verifikasi." });
      setTimeout(() => navigate("/arsip"), 1500);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Upload gagal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Kembali</Button>
        <h1 className="text-xl font-bold text-gray-900">Upload Arsip Baru</h1>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form utama */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader title="Informasi Arsip" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nomor Arsip" name="nomor_arsip"
                    value={form.nomor_arsip} onChange={handleChange}
                    placeholder="mis. 001/SM/2024"
                    error={errors.nomor_arsip} required
                  />
                  <Input
                    label="Tanggal Arsip" name="tanggal_arsip"
                    type="date" value={form.tanggal_arsip} onChange={handleChange}
                    error={errors.tanggal_arsip} required
                  />
                </div>

                <Input
                  label="Judul Arsip" name="judul"
                  value={form.judul} onChange={handleChange}
                  placeholder="mis. Surat Masuk dari Kementerian..."
                  error={errors.judul} required
                />

                <Select
                  label="Kategori" name="kategori_id"
                  value={form.kategori_id} onChange={handleChange}
                  options={kategori.map((k) => ({ value: k.id, label: `${k.kode} — ${k.nama_kategori}` }))}
                  error={errors.kategori_id} required
                />

                <Textarea
                  label="Deskripsi" name="deskripsi"
                  value={form.deskripsi} onChange={handleChange}
                  placeholder="Keterangan tambahan mengenai arsip ini..."
                  rows={3}
                />
              </div>
            </Card>
          </div>

          {/* Upload file */}
          <div className="space-y-5">
            <Card>
              <CardHeader title="File Arsip" subtitle="PDF, DOC, DOCX, XLS, JPG, PNG · Maks 10MB" />
              <label className="block cursor-pointer">
                <div className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition
                  ${errors.file ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
                `}>
                  {file ? (
                    <>
                      <p className="text-2xl mb-2">📄</p>
                      <p className="text-sm font-medium text-gray-700 break-all">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">☁️</p>
                      <p className="text-sm text-gray-500">Klik untuk pilih file</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFile}
                />
              </label>
              {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500 hover:underline mt-2"
                >
                  Hapus file
                </button>
              )}
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              icon={loading ? null : "⬆️"}
            >
              {loading ? "Mengupload..." : "Upload Arsip"}
            </Button>
          </div>
        </div>
      </form>
    </AppLayout>
  );
};

export default UploadArsip;
