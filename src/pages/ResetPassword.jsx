import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("carbon-tracker-d2d8.onrender.com/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password reset successfully! You can now login.");
                navigate("/login");
            } else {
                alert(data.message || "Password reset failed");
            }
        } catch (error) {
            console.error("Reset error:", error);
            alert("Something went wrong. Is your backend running?");
        }
    };

    return (
        <div className="login-bg">
            <div className="signup-container">
                <form onSubmit={handleReset}>
                    <h2>Reset Password</h2>

                    <p style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-color, #475569)" }}>
                        Enter your email and a new password below.
                    </p>

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ marginBottom: "20px" }}
                    />

                    <button type="submit">
                        Update Password
                    </button>

                    <p style={{ marginTop: "15px", textAlign: "center" }}>
                        Remembered your password? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}