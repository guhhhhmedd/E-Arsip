//  Tempat menulis logika segala proses bukan untuk membuat endpoint disini (proses data, enkripsi, dll)
// Tempat untuk menaruh cara kerja fiturnya (misal: gimana cara ngecek password pas login).
// ini logika pemrosesannya
// status(500).json itu artinya server error
// status(200).json itu artinya jalan dan ok
// status(400).json itu artinya sebuah peringatab bahwa ada yang salah


const bcrypt = require("bcrypt");
const db     = require("../connection/db");

const VALID_ROLES = ["admin", "kepala_dinas", "sekretaris", "staff_tu", "verifikator", "arsiparis", "viewer"];

// Helper: log aktivitas 
const logAktivitas = async (userId, aksi, keterangan = null, targetId = null, targetTipe = null) => {
  await db.execute(
    "INSERT INTO log_aktivitas (user_id, aksi, target_id, target_tipe, keterangan) VALUES (?, ?, ?, ?, ?)",
    [userId, aksi, targetId, targetTipe, keterangan]
  );
};

// GET /api/v1/admin/users 
const getAllUsers = async (req, res) => {
  try {
    const { role, is_active, search } = req.query;

    let query  = "SELECT id, username, email, role, is_active, created_at FROM users WHERE 1=1";
    const params = [];

    if (role && VALID_ROLES.includes(role)) {
      query += " AND role = ?";
      params.push(role);
    }

    if (is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(is_active === "1" ? 1 : 0);
    }

    if (search) {
      query += " AND (username LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.execute(query, params);

    return res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    console.error("[getAllUsers]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// POST /api/v1/admin/users 
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validasi input
  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Semua field wajib diisi." });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ success: false, message: "Role tidak valid." });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password minimal 8 karakter." });
  }

  try {
    // Cek email duplikat
    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email sudah digunakan." });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (username, email, password, role, created_by) VALUES (?, ?, ?, ?, ?)",
      [username, email, hash, role, req.user.id]
    );

    await logAktivitas(
      req.user.id,
      "buat_user",
      `Membuat akun baru: ${email} (role: ${role})`,
      result.insertId,
      "user"
    );

    return res.status(201).json({
      success: true,
      message: "Akun staff berhasil dibuat.",
      data: { id: result.insertId, username, email, role },
    });
  } catch (err) {
    console.error("[createUser]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// PUT /api/v1/admin/users/:id 
const updateUser = async (req, res) => {
  const { id }                       = req.params;
  const { username, role, is_active, password } = req.body;

  try {
    // Pastikan user ada
    const [rows] = await db.execute("SELECT id, email FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    // Cegah admin mengubah akun diri sendiri lewat endpoint ini
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: "Gunakan endpoint /profile untuk mengubah data diri sendiri." });
    }

    const fields = [];
    const params = [];

    if (username) { fields.push("username = ?");       params.push(username); }
    if (role && VALID_ROLES.includes(role)) { fields.push("role = ?"); params.push(role); }
    if (is_active !== undefined) { fields.push("is_active = ?"); params.push(is_active ? 1 : 0); }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password minimal 8 karakter." });
      }
      const hash = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      params.push(hash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada data yang diperbarui." });
    }

    params.push(id);
    await db.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, params);

    await logAktivitas(req.user.id, "edit_user", `Mengubah data user ID: ${id}`, parseInt(id), "user");

    return res.status(200).json({ success: true, message: "Data user berhasil diperbarui." });
  } catch (err) {
    console.error("[updateUser]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// DELETE /api/v1/admin/users/:id (soft delete = nonaktifkan) 
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ success: false, message: "Tidak dapat menonaktifkan akun sendiri." });
  }

  try {
    const [rows] = await db.execute("SELECT id, email FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    await db.execute("UPDATE users SET is_active = 0 WHERE id = ?", [id]);

    await logAktivitas(req.user.id, "nonaktif_user", `Menonaktifkan akun: ${rows[0].email}`, parseInt(id), "user");

    return res.status(200).json({ success: true, message: "Akun berhasil dinonaktifkan." });
  } catch (err) {
    console.error("[deleteUser]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// GET /api/v1/admin/logs 
const getLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const [rows] = await db.execute(
      `SELECT l.id, u.username, u.email, l.aksi, l.keterangan, l.target_id,
              l.target_tipe, l.ip_address, l.created_at
       FROM log_aktivitas l
       LEFT JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("[getLogs]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getLogs };
