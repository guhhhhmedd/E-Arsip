// Mengecek izin akses (misal: cek token login) sebelum masuk ke sistem
// Ini cuma buat pembatas. Biar orang yang gak login gak bisa asal masuk ke halaman data.
// authMiddleware ini untuk verifikasi JWT token dari header Authorization.
// Jika valid, data user disimpan ke req.user dan dilanjutkan ke next().

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email, role }
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Sesi telah berakhir. Silakan login kembali."
        : "Token tidak valid.";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = authMiddleware;
