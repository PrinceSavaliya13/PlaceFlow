import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import { Login, Register } from "./pages/AuthPages";
import { StudentDashboard, Profile } from "./pages/StudentPages";
import { Jobs, JobDetail, Applications } from "./pages/JobPages";
import { CompanyDashboard, ManageJobs, JobApplicants } from "./pages/CompanyPages";
import {
  AdminDashboard,
  AdminCompanies,
  AdminUsers,
  Announcements,
} from "./pages/AdminPages";
const Guard = ({ roles }) => (
  <ProtectedRoute roles={roles}>
    <AppLayout />
  </ProtectedRoute>
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Guard roles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<Guard roles={["company"]} />}>
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<ManageJobs />} />
            <Route path="/company/jobs/:jobId/applicants" element={<JobApplicants />} />
            <Route path="/company/profile" element={<Profile />} />
          </Route>
          <Route element={<Guard roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/announcements" element={<Announcements />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    <Toaster position="top-right" />
  </StrictMode>,
);
