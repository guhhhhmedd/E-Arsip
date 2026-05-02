// Mengatur jalur URL atau endpoint lalu meneruskannya ke Controller sesuai alamatnya
// Isinya cuma daftar alamat atau endpoint (misal: /login larinya ke mana, /register larinya ke mana).


const router = require("express").Router();
const {
  getAllArsip, getArsipById, createArsip, updateArsip,
  verifikasiArsip, downloadArsip, deleteArsip, getAllKategori,
} = require("../controllers/arsipController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


router.use(authMiddleware);

router.get("/kategori", getAllKategori);
router.get("/", getAllArsip);
router.get("/:id", getArsipById);
router.get("/download/:id", downloadArsip);

// Upload — role yang boleh menulis
router.post("/", upload.single("file"), createArsip);
router.put("/:id", updateArsip);
router.put("/:id/verifikasi", roleMiddleware("admin", "verifikator"), verifikasiArsip);
router.delete("/:id", roleMiddleware("admin"), deleteArsip);

module.exports = router;
