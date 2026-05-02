// roleMiddleware
// Membatasi akses endpoint berdasarkan role user.
// Penggunaan:
// router.post("/users", authMiddleware, roleMiddleware("admin"), handler)
// router.put("/arsip/:id/verifikasi", authMiddleware, roleMiddleware("admin", "verifikator"), handler)
 
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Autentikasi diperlukan.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses resource ini.",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
