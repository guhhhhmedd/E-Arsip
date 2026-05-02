
#  E-Arsip Digital System

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000f?style=for-the-badge&logo=mysql&logoColor=white)

Sistem Informasi Manajemen Arsip berbasis web yang mengimplementasikan **Role-Based Access Control (RBAC)** untuk otomatisasi birokrasi dan pengelolaan dokumen digital secara aman.

---

##  Tech Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | UI & Client Logic |
| **Styling** | Tailwind CSS | Responsive Design |
| **Backend** | Express.js | REST API Server |
| **Database** | MySQL | Relational Storage |
| **Security** | JWT | Authentication |
| **Files** | Multer | File Handling |

---

##  Project Structure
```bash
E-ARSIP/
├── backend/                # API Server Engine
│   ├── controllers/        # Logic handlers
│   ├── middleware/         # Auth & Role validation
│   └── routes/             # API Endpoints
└── frontend/               # Client Application
    ├── src/
    │   ├── api/            # API Service Layer (Ignored)
    │   ├── context/        # Auth State Provider
    │   ├── components/     # UI Library (Badge, Navbar, Sidebar)
    │   └── pages/          # View Layers & Admin Panels
```

---

##  Quick Start

### 1. Database Setup
Impor skema basis data `e_arsip.sql` ke MySQL server lokal Anda.

### 2. Backend Configuration
Masuk ke direktori backend dan instalasi modul:
```bash
cd backend
npm install
```
Buat file `.env` di folder `backend/` dan sesuaikan kredensialnya:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=e_arsip
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Configuration
Masuk ke direktori frontend dan instalasi modul:
```bash
cd frontend
npm install
```
Pastikan file `src/api/fetch.js` sudah dikonfigurasi, lalu jalankan aplikasi:
```bash
npm run dev
```

---

##  Security Policy

| Resource | Protection Level | Description |
| :--- | :--- | :--- |
| `src/api/` | **High** | Hidden via `.gitignore`. Contains endpoint logic. |
| `.env` | **Critical** | Hidden via `.gitignore`. Contains DB Credentials. |
| `node_modules/` | **Standard** | Ignored. Dependency-only. |

---

## Contributors

*   **Teguh Mediansyah** - *Lead Developer*
```