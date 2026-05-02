// Mengatur jalur URL atau endpoint lalu meneruskannya ke Controller sesuai alamatnya
// Isinya cuma daftar alamat atau endpoint (misal: /login larinya ke mana, /register larinya ke mana).

const router = require("express").Router();
const { getAllUsers, createUser, updateUser, deleteUser, getLogs } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
 
router.use(authMiddleware, roleMiddleware("admin"));
 
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/logs", getLogs);
 
module.exports = router;
