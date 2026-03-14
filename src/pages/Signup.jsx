import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSignup = async (e) => {
  e.preventDefault();

  try {

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    alert(data.message);

    navigate("/login");

  } catch (err) {
    console.log(err);
    alert("Signup failed");
  }

};

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>

        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required
        />

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        />

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
        />

        <button type="submit">Signup</button>

        <p>
          Already have an account? <Link to="/login"><b>Login</b></Link>
        </p>

      </form>
    </div>
  );
}