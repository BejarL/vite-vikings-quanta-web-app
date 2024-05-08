import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ConfirmResetPasswordPage from "./pages/ConfirmResetPasswordPage";
import Layout from "./pages/Layout";
import TimeTrackerPage from "./pages/TimeTrackerPage";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProjectDetails from "./components/ProjectDetails";
import AuditPage from "./pages/AuditPage";
// import AuditLog from "./pages/AuditLog"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password/:jwt"
          element={<ConfirmResetPasswordPage />}
        />
        <Route path="/quanta" element={<Layout />}>
          <Route path="" element={<HomePage />} />
          <Route path="timetracker" element={<TimeTrackerPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="/quanta/projects/:projectId"
            element={<ProjectDetails />}
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="audit-log" element={<AuditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
