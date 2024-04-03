import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ConfirmResetPasswordPage from "./pages/ConfirmResetPasswordPage"


const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/forgot-password" element={<ResetPasswordPage/>}/>
          <Route path="/reset-password" element={<ConfirmResetPasswordPage/>}/>
        </Routes>
      </BrowserRouter>
      )
    }
    
    export default App