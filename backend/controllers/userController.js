//  Tempat menulis logika segala proses bukan untuk membuat endpoint disini (proses data, enkripsi, dll)
// Tempat untuk menaruh cara kerja fiturnya (misal: gimana cara ngecek password pas login).
// ini logika pemrosesannya
// ada update data user juga
// status(500).json itu artinya server error
// status(200).json itu artinya jalan dan ok
// status(400).json itu artinya sebuah peringatab bahwa ada yang salah


const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../connection/db");

// untuk nyimpen log aktivitas 
const logAktivitas = async (userId, aksi, keterangan = null, ipAddress = null) => {
  await db.execute(
    "INSERT INTO log_aktivitas (user_id, aksi, keterangan, ip_address) VALUES (?, ?, ?, ?)",
    [userId, aksi, keterangan, ipAddress]
  );
};

// fungsi untuk login dengan method POST /api/v1/users/login 
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, username, email, password, role, is_active FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Akun tidak aktif. Hubungi admin." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

    await logAktivitas(user.id, "login", `Login berhasil`, req.ip);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// fungsi untuk menampilkan data user dengan method GET /api/v1/users/profile 
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("[getProfile]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// fungsi untuk mengedit data user dengan method PUT /api/v1/users/profile 
const updateProfile = async (req, res) => {
  const { username, password_lama, password_baru } = req.body;

  try {
    // Update nama
    if (username) {
      await db.execute("UPDATE users SET username = ? WHERE id = ?", [username, req.user.id]);
    }

    // Update password (opsional)
    if (password_lama && password_baru) {
      const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [req.user.id]);
      const valid  = await bcrypt.compare(password_lama, rows[0].password);

      if (!valid) {
        return res.status(400).json({ success: false, message: "Password lama tidak sesuai." });
      }

      if (password_baru.length < 8) {
        return res.status(400).json({ success: false, message: "Password baru minimal 8 karakter." });
      }

      const hash = await bcrypt.hash(password_baru, 10);
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id]);
    }

    await logAktivitas(req.user.id, "update_profil", "Profil diperbarui", req.ip);

    return res.status(200).json({ success: true, message: "Profil berhasil diperbarui." });
  } catch (err) {
    console.error("[updateProfile]", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

module.exports = { login, getProfile, updateProfile };
