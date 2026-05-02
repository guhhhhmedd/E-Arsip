import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/Layout";

// Halaman publik
import Login from "./pages/Login";

// Halaman staff (Sekarang ada di folder pages langsung)
import Dashboard   from "./pages/Dashboard";
import ArsipList   from "./pages/ArsipList";
import ArsipDetail from "./pages/ArsipDetail";
import UploadArsip from "./pages/UploadArsip";
import Profile     from "./pages/Profile";

// Halaman admin (Ada di dalam sub-folder admin)
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers    from "./pages/admin/ManageUsers";
import CreateUser     from "./pages/admin/CreateUser";

// ... sisa kode STAFF_ROLES dan App component tetap sama

// Role yang boleh masuk ke halaman staff (semua kecuali admin)
const STAFF_ROLES = ["kepala_dinas", "sekretaris", "staff_tu", "verifikator", "arsiparis", "viewer"];
const CAN_UPLOAD  = ["sekretaris", "staff_tu", "arsiparis"];

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/"      element={<Navigate to="/login" replace />} />

        {/* Staff */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={STAFF_ROLES}><Dashboard /></ProtectedRoute>
        } />
        <Route path="/arsip" element={
          <ProtectedRoute allowedRoles={STAFF_ROLES}><ArsipList /></ProtectedRoute>
        } />
        <Route path="/arsip/:id" element={
          <ProtectedRoute allowedRoles={STAFF_ROLES}><ArsipDetail /></ProtectedRoute>
        } />
        <Route path="/arsip/upload" element={
          <ProtectedRoute allowedRoles={CAN_UPLOAD}><UploadArsip /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={STAFF_ROLES}><Profile /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>
        } />
        <Route path="/admin/users/create" element={
          <ProtectedRoute allowedRoles={["admin"]}><CreateUser /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
