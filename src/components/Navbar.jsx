import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
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
        <li><Link to="/graph">Graph</Link></li>
        <li><Link to="/tips">Tips</Link></li>
        <li><Link to="/records">Records</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
}
