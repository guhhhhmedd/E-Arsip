Sistem Informasi E-Arsip Digital
Sistem manajemen arsip berbasis web yang dirancang untuk mempermudah pendataan, penyimpanan, dan verifikasi dokumen secara digital. Sistem ini mendukung manajemen berbasis peran (RBAC) untuk memastikan keamanan data sesuai dengan kewenangan pengguna.

Fitur Utama
Autentikasi & Otorisasi: Login berbasis JWT dengan pembagian peran (Admin, Kepala Dinas, Sekretaris, Staff TU, Verifikator, Arsiparis, dan Viewer).

Manajemen User: Pengelolaan data pengguna aplikasi khusus untuk peran Admin.

Unggah Arsip: Fitur unggah dokumen dengan validasi peran tertentu.

Verifikasi Dokumen: Alur kerja verifikasi arsip sebelum dianggap sah di dalam sistem.

Pencarian & Detail: Memudahkan pencarian dokumen dan melihat detail metadata arsip secara lengkap.

Teknologi yang Digunakan
Frontend
React.js: Library utama untuk pembangunan antarmuka.

Vite: Build tool untuk performa pengembangan yang cepat.

Tailwind CSS: Framework CSS untuk styling yang responsif.

React Router Dom: Manajemen navigasi dan routing aplikasi.

Backend
Node.js & Express.js: Perangkat lunak sisi server.

MySQL: Sistem manajemen basis data relasional.

Multer: Middleware untuk penanganan unggahan file.

Struktur Folder
Plaintext
E-ARSIP/
├── backend/            # API Server (Express.js)
│   ├── connection/     # Konfigurasi database
│   ├── controllers/    # Logika bisnis
│   ├── middleware/     # Auth, Role, dan Upload middleware
│   └── routes/         # Definisi endpoint API
└── frontend/           # Interface (React.js)
    ├── src/
    │   ├── api/        # Konfigurasi Fetch API (diabaikan oleh git)
    │   ├── components/ # Komponen reusable (Navbar, Sidebar, UI)
    │   ├── context/    # State management (AuthContext)
    │   └── pages/      # Halaman utama dan Admin sub-folder
Persiapan Instalasi
1. Prasyarat
Node.js terinstal di komputer.

MySQL terinstal dan sedang berjalan.

2. Konfigurasi Backend
Masuk ke folder backend: cd backend

Instal dependensi: npm install

Buat file .env dan sesuaikan konfigurasi database:

Cuplikan kode
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=e_arsip
JWT_SECRET=rahasia_negara
Jalankan server: npm run dev

3. Konfigurasi Frontend
Masuk ke folder frontend: cd frontend

Instal dependensi: npm install

Buat file src/api/fetch.js berdasarkan template yang tersedia.

Jalankan aplikasi: npm run dev

Keamanan Data
Folder src/api/ pada bagian frontend dan file .env pada bagian backend telah didaftarkan ke dalam .gitignore untuk mencegah kebocoran kredensial atau konfigurasi server ke repositori publik.
Dibuat oleh Teguh Mediansyah dan kawankawn