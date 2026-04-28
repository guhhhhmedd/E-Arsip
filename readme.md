#  E-Arsip Project

Aplikasi pengelolaan arsip digital berbasis web menggunakan stack **PERN/M** (MySQL, Express, React, Node.js). Project ini dirancang untuk memudahkan penyimpanan dan manajemen dokumen secara digital.

##  Fitur Saat Ini
- Autentikasi User: Register & Login dengan enkripsi password (Bcrypt).
- Validasi Input: Pengecekan karakter minimal dan keamanan data.
- RESTful API: Struktur folder yang rapi dengan pola MVC (Model-View-Controller).
- Database Relasional: Menggunakan MySQL untuk penyimpanan data user dan dokumen.

##  Tech Stack
- Frontend: React.js, Vite, Tailwind CSS.
- Backend: Node.js, Express.js.
- Database: MySQL.
- Tools: Nodemon, Axios, Bcrypt, Dotenv, Cors.

---

## ⚙️ Persiapan Instalasi

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) dan [MySQL](https://www.mysql.com/).

### 1. Clone Repository
```bash
git clone [https://github.com/username/e-arsip.git](https://github.com/username/e-arsip.git)
cd e-arsip
2. Setup BackendMasuk ke folder backend dan instal semua library yang dibutuhkan:Bashcd backend
npm install
3. Konfigurasi Database (.env)Buat file bernama .env di dalam folder backend dan isi dengan konfigurasi database kamu:Cuplikan kodeDB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=e_arsip
PORT=3000
4. Jalankan Server (Development)Gunakan nodemon agar server otomatis restart saat ada perubahan kode:Bashnpm run dev
Server akan berjalan di: http://localhost:3000📂 Struktur FolderPlaintextE-ARSIP/
├── backend/
│   ├── connection/      # Konfigurasi database (db.js)
│   ├── controllers/     # Logika bisnis (userController.js)
│   ├── routes/          # Alur URL API (userRoutes.js)
│   ├── middleware/      # Keamanan & validasi (authMiddleware.js)
│   ├── uploads/         # Folder penyimpanan file arsip
│   └── app.js           # Entry point utama server
├── frontend/            # Folder aplikasi React (Vite)
└── README.md

📡 API Endpoints (V1)AuthMethodEndpointFungsiPOST/api/v1/users/registerMendaftarkan pengguna baruPOST/api/v1/users/loginMasuk ke aplikasiGET/api/v1/users/Melihat semua daftar pengguna🤝 KontribusiJika ingin berkontribusi, silakan lakukan fork pada repository ini dan gunakan pull request. Segala bentuk saran dan perbaikan sangat dihargai!Dibuat oleh Teguh Mediansyah