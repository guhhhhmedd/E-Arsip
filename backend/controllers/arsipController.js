const path = require("path");
const fs   = require("fs");
const db   = require("../connection/db");

// Role yang boleh membuat / mengedit arsip
const CAN_WRITE = ["admin", "sekretaris", "staff_tu", "arsiparis"];

// ─── Helper ───────────────────────────────────────────────────────────────────
const logAktivitas = async (userId, aksi, keterangan = null, targetId = null) => {
  await db.execute(
    "INSERT INTO log_aktivitas (user_id, aksi, target_id, target_tipe, keterangan) VALUES (?, ?, ?, 'arsip', ?)",
    [userId, aksi, targetId, keterangan]
  );
};

// ─── GET /api/v1/arsip ────────────────────────────────────────────────────────
const getAllArsip = async (req, res) => {
  try {
    const { kategori_id, status, search, tanggal_dari, tanggal_sampai, limit = 20, page = 1 } = req.query;

    let query = `
      SELECT a.id, a.nomor_arsip, a.judul, a.tanggal_arsip, a.status,
             a.file_nama_asli, a.file_size, a.created_at,
             k.nama_kategori, k.kode AS kode_kategori,
             u.username AS dibuat_oleh
      FROM arsip a
      JOIN kategori_arsip k ON k.id  = a.kategori_id
      JOIN users          u ON u.id  = a.dibuat_oleh
      WHERE 1=1
    `;
    const params = [];

    if (kategori_id) { query += " AND a.kategori_id = ?";       params.push(kategori_id); }
    if (status)      { query += " AND a.status = ?";            params.push(status); }
    if (tanggal_dari){ query += " AND a.tanggal_arsip >= ?";    params.push(tanggal_dari); }
    if (tanggal_sampai){ query += " AND a.tanggal_arsip <= ?";  params.push(tanggal_sampai); }

    if (search) {
      query += " AND MATCH(a.judul, a.deskripsi, a.nomor_arsip) AGAINST (? IN BOOLEAN MODE)";
      params.push(`${search}*`);
    }

    // Role viewer & kepala_dinas hanya lihat arsip aktif
    if (["viewer", "kepala_dinas"].includes(req.user.role)) {
      query += " AND a.status = 'aktif'";
    }

    const parsedLimit  = parseInt(limit);
    const parsedOffset = (parseInt(page) - 1) * parsedLimit;

    // Hitung total untuk pagination
    const countQuery   = query.replace(
      /SELECT[\s\S]+?FROM/,
      "SELECT COUNT(*) AS total FROM"
    ).split("ORDER BY")[0];

    const [countRows] = await db.execute(countQuery, params);
    const total        = countRows[0]?.total ?? 0;

    query += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    params.push(parsedLimit, parsedOffset);

    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      success: true,
      total,
      page:        parseInt(page),
      total_pages: Math.ceil(total / parsedLimit),
      data:        rows,
    });
  } catch (err) {
    console.error("[getAllArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── GET /api/v1/arsip/:id ────────────────────────────────────────────────────
const getArsipById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*,
              k.nama_kategori, k.kode AS kode_kategori,
              u1.username AS dibuat_oleh,
              u2.username AS diverifikasi_oleh
       FROM arsip a
       JOIN kategori_arsip k ON k.id = a.kategori_id
       JOIN users          u1 ON u1.id = a.dibuat_oleh
       LEFT JOIN users     u2 ON u2.id = a.diverifikasi_oleh
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Arsip tidak ditemukan." });
    }

    const arsip = rows[0];

    // Viewer & kepala_dinas hanya boleh lihat arsip aktif
    if (["viewer", "kepala_dinas"].includes(req.user.role) && arsip.status !== "aktif") {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke arsip ini." });
    }

    return res.status(200).json({ success: true, data: arsip });
  } catch (err) {
    console.error("[getArsipById]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── POST /api/v1/arsip ───────────────────────────────────────────────────────
const createArsip = async (req, res) => {
  if (!CAN_WRITE.includes(req.user.role)) {
    // Hapus file yang sudah terupload jika role tidak boleh
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(403).json({ success: false, message: "Anda tidak memiliki izin upload arsip." });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "File arsip wajib disertakan." });
  }

  const { nomor_arsip, judul, deskripsi, kategori_id, tanggal_arsip } = req.body;

  if (!nomor_arsip || !judul || !kategori_id || !tanggal_arsip) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: "Field nomor_arsip, judul, kategori_id, dan tanggal_arsip wajib diisi." });
  }

  try {
    // Cek nomor arsip duplikat
    const [existing] = await db.execute("SELECT id FROM arsip WHERE nomor_arsip = ?", [nomor_arsip]);
    if (existing.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ success: false, message: "Nomor arsip sudah digunakan." });
    }

    const filePath = req.file.filename; // simpan hanya nama file, bukan full path

    const [result] = await db.execute(
      `INSERT INTO arsip
         (nomor_arsip, judul, deskripsi, kategori_id, tanggal_arsip,
          file_path, file_nama_asli, file_size, file_mime, dibuat_oleh)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor_arsip, judul, deskripsi || null, kategori_id, tanggal_arsip,
        filePath,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        req.user.id,
      ]
    );

    await logAktivitas(req.user.id, "upload_arsip", `Upload arsip: ${nomor_arsip} - ${judul}`, result.insertId);

    return res.status(201).json({
      success: true,
      message: "Arsip berhasil diunggah.",
      data: { id: result.insertId, nomor_arsip, judul, status: "draft" },
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("[createArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── PUT /api/v1/arsip/:id ────────────────────────────────────────────────────
const updateArsip = async (req, res) => {
  const { id }                                          = req.params;
  const { judul, deskripsi, kategori_id, tanggal_arsip } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT id, dibuat_oleh, status FROM arsip WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Arsip tidak ditemukan." });
    }

    const arsip = rows[0];

    // Hanya admin atau pembuat arsip yang boleh edit
    if (req.user.role !== "admin" && arsip.dibuat_oleh !== req.user.id) {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki izin mengedit arsip ini." });
    }

    // Arsip aktif tidak bisa diedit langsung (perlu diset inaktif dulu oleh admin)
    if (arsip.status === "aktif" && req.user.role !== "admin") {
      return res.status(400).json({ success: false, message: "Arsip aktif tidak dapat diubah. Hubungi admin." });
    }

    const fields = [];
    const params = [];

    if (judul)        { fields.push("judul = ?");        params.push(judul); }
    if (deskripsi)    { fields.push("deskripsi = ?");    params.push(deskripsi); }
    if (kategori_id)  { fields.push("kategori_id = ?");  params.push(kategori_id); }
    if (tanggal_arsip){ fields.push("tanggal_arsip = ?");params.push(tanggal_arsip); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada data yang diperbarui." });
    }

    params.push(id);
    await db.execute(`UPDATE arsip SET ${fields.join(", ")} WHERE id = ?`, params);

    await logAktivitas(req.user.id, "edit_arsip", `Mengedit arsip ID: ${id}`, parseInt(id));

    return res.status(200).json({ success: true, message: "Arsip berhasil diperbarui." });
  } catch (err) {
    console.error("[updateArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── PUT /api/v1/arsip/:id/verifikasi ────────────────────────────────────────
const verifikasiArsip = async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body; // 'aktif' atau 'inaktif'

  if (!["aktif", "inaktif"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status harus 'aktif' atau 'inaktif'." });
  }

  try {
    const [rows] = await db.execute("SELECT id, status FROM arsip WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Arsip tidak ditemukan." });
    }

    await db.execute(
      "UPDATE arsip SET status = ?, diverifikasi_oleh = ?, tanggal_verifikasi = NOW() WHERE id = ?",
      [status, req.user.id, id]
    );

    await logAktivitas(
      req.user.id,
      "verifikasi_arsip",
      `Mengubah status arsip ID: ${id} menjadi ${status}`,
      parseInt(id)
    );

    return res.status(200).json({ success: true, message: `Arsip berhasil diubah menjadi ${status}.` });
  } catch (err) {
    console.error("[verifikasiArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── GET /api/v1/arsip/download/:id ──────────────────────────────────────────
const downloadArsip = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT file_path, file_nama_asli, status FROM arsip WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Arsip tidak ditemukan." });
    }

    const arsip = rows[0];

    if (["viewer", "kepala_dinas"].includes(req.user.role) && arsip.status !== "aktif") {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki akses mengunduh arsip ini." });
    }

    const filePath = path.join(__dirname, "..", process.env.UPLOAD_PATH || "uploads", arsip.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File tidak ditemukan di server." });
    }

    await logAktivitas(req.user.id, "download_arsip", `Download arsip ID: ${req.params.id}`, parseInt(req.params.id));

    return res.download(filePath, arsip.file_nama_asli);
  } catch (err) {
    console.error("[downloadArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── DELETE /api/v1/arsip/:id ─────────────────────────────────────────────────
const deleteArsip = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, file_path, nomor_arsip FROM arsip WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Arsip tidak ditemukan." });
    }

    const arsip    = rows[0];
    const filePath = path.join(__dirname, "..", process.env.UPLOAD_PATH || "uploads", arsip.file_path);

    // Hapus dari database
    await db.execute("DELETE FROM arsip WHERE id = ?", [req.params.id]);

    // Hapus file fisik
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await logAktivitas(req.user.id, "hapus_arsip", `Menghapus arsip: ${arsip.nomor_arsip}`, parseInt(req.params.id));

    return res.status(200).json({ success: true, message: "Arsip berhasil dihapus." });
  } catch (err) {
    console.error("[deleteArsip]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// ─── GET /api/v1/arsip/kategori ───────────────────────────────────────────────
const getAllKategori = async (_req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM kategori_arsip ORDER BY kode ASC");
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("[getAllKategori]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

module.exports = {
  getAllArsip,
  getArsipById,
  createArsip,
  updateArsip,
  verifikasiArsip,
  downloadArsip,
  deleteArsip,
  getAllKategori,
};
