import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // ✅ Better logout (clears user session)
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); // if you use JWT
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          🌱 Carbon Tracker
        </Link>
      </h2>

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/calculator">Calculator</Link></li>
        <li><Link to="/history">History</Link></li>
        <li><Link to="/graph">Graph</Link></li>
        <li><Link to="/challenges">Challenges</Link></li>
        <li><Link to="/tips">Tips</Link></li>
        <li><Link to="/records">Records</Link></li>

        {/* 🌙 Theme Toggle */}
        <li>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Dark Mode"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </li>

        {/* 🔐 Logout */}
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}