import React, { useState } from "react";

function Login({ onLogin }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("Invalid login code");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Login Code</h2>
      <input value={code} onChange={(e) => setCode(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
