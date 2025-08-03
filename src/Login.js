import React, { useState } from "react";

function Login({ onLogin }) {
  const [code, setCode] = useState("");
  const correctCode = "1234"; // Demo login code

  const handleLogin = () => {
    if (code === correctCode) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Enter Login Code</h2>
      <p style={{ fontSize: "14px", color: "gray" }}>
        Demo login code: <b>{correctCode}</b>
      </p>
      <input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleLogin} style={{ marginTop: 10 }}>
        Login
      </button>
    </div>
  );
}

export default Login;
