import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ConfirmResetPasswordPage from "./pages/ConfirmResetPasswordPage"
import Layout from "./pages/Layout"
import TimeTracker from "./pages/TimeTrackerPage"
import UsersPage from "./pages/UsersPage"
import ProjectsPage from "./pages/ProjectsPage"
import ProfilePage from "./pages/ProfilePage"

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<LoginPage/>}/>  
           <Route path="/forgot-password" element={<ResetPasswordPage/>}/>
           <Route path="/reset-password" element={<ConfirmResetPasswordPage/>}/>
           <Route path="/quanta" element={<Layout />}>
            {/* <Route path="/" elements={<Home />}/> */}
              <Route path="timetracker" element={<TimeTracker />}/>
              <Route path="users" element={<UsersPage />}/>
              <Route path="projects" element={<ProjectsPage />}/>
              <Route path="profile" element={<ProfilePage/>}/>
           </Route>
        </Routes>
      </BrowserRouter>
      )
    }
    
    export default App


 