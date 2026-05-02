require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const arsipRoutes = require("./routes/arsipRoutes");
const port = process.env.PORT || 3000;


app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/view-uploads", express.static(path.join(__dirname, process.env.UPLOAD_PATH || "uploads")));

// Routes 
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/arsip", arsipRoutes);

// cek status projek, biar tau jalan gak ni backendnya
app.get("/", (_req, res) => {
  res.json({ success: true, message: "E-Arsip API jalan boi.", version: "1.0.0" });
});

// 404 Handler 
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
});

// Error Handler kalau data yang dikirim gak sesuai sama role sataff
app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: `Ukuran file melebihi batas maksimal ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
    });
  }
  
  if (err.message?.startsWith("Format file tidak didukung")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("[GlobalError]", err);
  return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
});

  app.listen(3000, () => {
    console.log("server jalan di localhost http://localhost:3000");
  });