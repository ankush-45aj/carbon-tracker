import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Calculator from "./pages/Calculator";
import Graph from "./pages/Graph";
import Tips from "./pages/Tips";
import Dashboard from "./components/Dashboard";
import Records from "./pages/Records";

// 🔹 Navbar control component
function Layout({ children }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
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
          <Route path="/graph" element={<Graph />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
