//  Tempat menulis logika segala proses bukan untuk membuat endpoint disini (proses data, enkripsi, dll)
// Tempat untuk menaruh cara kerja fiturnya (misal: gimana cara ngecek password pas login).
// ini logika pemrosesannya
// status(500).json itu artinya server error
// status(200).json itu artinya jalan dan ok
// status(400).json itu artinya sebuah peringatab bahwa ada yang salah


const db = require("../connection/db");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nama, email FROM users");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Gagal ambil data" });
  }
};

// Fungsi untuk Register 
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Wajib mengisi semua data!" });
  }

  if(username.length < 5 || password.length < 5) {
    return res.status(400).json({ success: false, message: "password dan usernmae harus lebih dari 6 karakter"})
  }

  try {
    const [rows] = await db.query("SELECT * FROM users where username = ?", [username]);
    if(rows.length > 0) return res.status(401).json({ success: false, message: "username sudah digunakan"})
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
    res.status(201).json({ success: true, message: "User berhasil dibuat!" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Email sudah dipakai" });
  }
};

// Fungsi untuklogin
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: "Nama/Password salah" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Nama/Password salah" });

    res.json({ success: true, message: "Selamat datang!", data: { id: user.id, nama: user.nama } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllUsers, registerUser, loginUser };