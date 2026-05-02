// upload middleware ini untuk menyeleksi apa yang diupload oleh staff
// jadi ada validasi untuk tahu apa yang boleh dan gak boleh diupload sama staff
// yang diperbolehkan cuma [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"]
// juga ada batasan maksimal ukuran file

const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// Pastikan folder uploads tersedia
const uploadDir = path.join(__dirname, "..", process.env.UPLOAD_PATH || "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ekstensi file yang diizinkan
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext       = path.extname(file.originalname).toLowerCase();
    const basename  = path.basename(file.originalname, ext)
                         .replace(/[^a-zA-Z0-9_-]/g, "_")
                         .slice(0, 50);
    cb(null, `${timestamp}_${basename}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Format file tidak didukung. Ekstensi yang diizinkan: ${ALLOWED_EXTENSIONS.join(", ")}`),
      false
    );
  }
};

const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || "10");

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
});

module.exports = upload;
