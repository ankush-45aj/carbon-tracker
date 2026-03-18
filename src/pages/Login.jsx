import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ LOGIN (Render API)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://carbon-tracker-d2d8.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: data.name, email })
        );
        localStorage.setItem("isAuth", true);

        navigate("/home");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Try again later.");
    }
  };

  // ✅ GOOGLE LOGIN (Render API)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        "https://carbon-tracker-d2d8.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: data.name })
        );
        localStorage.setItem("isAuth", true);

        navigate("/home");
      } else {
        alert(data.message || "Google Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google authentication error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c6f6d5, #b2f5ea)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "420px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {/* ✅ Forgot Password (added back) */}
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <Link
            to="/reset-password"
            style={{ fontSize: "14px", color: "#059669" }}
          >
            Forgot Password?
          </Link>
        </div>

        <button type="submit" style={buttonStyle}>
          Login
        </button>

        {/* GOOGLE LOGIN */}
        <div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        <p style={{ textAlign: "center" }}>
          New user? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

// --- STYLES ---
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(90deg, #2f855a, #48bb78)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "6px",
};