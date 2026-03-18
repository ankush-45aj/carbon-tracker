import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Calculator from "./pages/Calculator";
import History from "./pages/History";
import Tips from "./pages/Tips";
import Dashboard from "./components/Dashboard";
import Records from "./pages/Records";
import ResetPassword from "./pages/ResetPassword";
import Challenges from "./pages/Challenges";
import EcoChatbot from "./components/EcoChatbot";

// 🔹 Navbar control component
function Layout({ children }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <EcoChatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* AUTH PAGES */}
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* MAIN APP */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/history" element={<History />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/records" element={<Records />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;