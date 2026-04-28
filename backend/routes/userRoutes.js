// Mengatur jalur URL atau endpoint lalu meneruskannya ke Controller sesuai alamatnya
// Isinya cuma daftar alamat atau endpoint (misal: /login larinya ke mana, /register larinya ke mana).
// anjay baru tau kalo manggil endpointnya itu lewat variabel awalnya

const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.getAllUsers);

// Alamat: POST /api/v1/users/register
// Alamat: POST /api/v1/users/login
router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);

module.exports = router;