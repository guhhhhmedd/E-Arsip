// Mengatur jalur URL atau endpoint lalu meneruskannya ke Controller sesuai alamatnya
// Isinya cuma daftar alamat atau endpoint (misal: /login larinya ke mana, /register larinya ke mana).
// anjay baru tau kalo manggil endpointnya itu lewat variabel awalnya

const router = require("express").Router();
const { login, getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;