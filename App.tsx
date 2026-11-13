import { Link, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { RequireAdmin, RequireAuth } from "./components/Guards";
import AdminLayout from "./pages/admin/AdminLayout";
import Curriculum from "./pages/admin/Curriculum";
import Materials from "./pages/admin/Materials";
import Overview from "./pages/admin/Overview";
import Students from "./pages/admin/Students";
import { Login, Register } from "./pages/AuthPages";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import LessonPage from "./pages/LessonPage";
import Library from "./pages/Library";
import MaterialPage from "./pages/MaterialPage";

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-display text-8xl font-black text-lime">404</p>
        <p className="mt-4 text-mute">This page doesn’t exist.</p>
        <Link to="/" className="btn-primary mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/material/:id" element={<MaterialPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Overview />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="materials" element={<Materials />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
