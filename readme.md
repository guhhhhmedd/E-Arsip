E-Arsip Digital SystemSistem Informasi Manajemen Arsip berbasis web yang mengimplementasikan Role-Based Access Control (RBAC) untuk otomatisasi birokrasi dan pengelolaan dokumen digital secara aman. Tech StackLayerTechnologyUsageFrontendReact + ViteUI & Client LogicStylingTailwind CSSResponsive DesignBackendExpress.jsREST API ServerDatabaseMySQLRelational StorageSecurityJWTAuthenticationFilesMulterFile Handling Project StructureBashE-ARSIP/
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
 Quick Start1. Database SetupImpor skema basis data e_arsip.sql ke MySQL server kamu.2. Backend ConfigurationMasuk ke direktori backend dan instalasi modul:Bashcd backend
npm install
Konfigurasi .env (Jangan di-push ke GitHub!):Cuplikan kodeDB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=e_arsip
JWT_SECRET=supersecretkey
3. Frontend ConfigurationMasuk ke direktori frontend dan instalasi modul:Bashcd frontend
npm install
Jalankan aplikasi:Bashnpm run dev
 Security PolicyResourceProtection LevelDescriptionsrc/api/HighHidden via .gitignore. Contains endpoint logic..envCriticalHidden via .gitignore. Contains DB Credentials.node_modules/StandardIgnored. Dependency-only.ContributorsTeguh Mediansyah - Lead Developer