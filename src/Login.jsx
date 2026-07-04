import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("adminToken", data.token);
        onClose();
        navigate("/admin");
      } else {
        setError(data.detail || "Invalid credentials.");
      }
    } catch {
      setError("server not connected. Backend is not started ....");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,20,50,0.6)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 30px 80px rgba(26,60,143,0.35)",
          position: "relative",
          animation: "loginIn 0.3s ease",
        }}
      >
        <style>{`
          @keyframes loginIn {
            from { opacity: 0; transform: scale(0.92) translateY(-20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          .li { width: 100%; padding: 11px 14px; border: 1.5px solid #dde3f0;
                border-radius: 9px; font-size: 14px; outline: none;
                transition: border 0.2s; box-sizing: border-box; margin-top: 6px; }
          .li:focus { border-color: #1a3c8f; }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 18,
            background: "none", border: "none", fontSize: 24,
            cursor: "pointer", color: "#999", lineHeight: 1,
          }}
        >×</button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg,#1a3c8f,#2d6cdf)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: 26,
          }}>🎓</div>
          <h2 style={{ margin: 0, color: "#1a3c8f", fontSize: 22, fontWeight: 800 }}>
            Welcome Back
          </h2>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: 13 }}>
            K.D Public Inter College Portal
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
              Username
            </label>
            <input
              className="li"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
              Password
            </label>
            <input
              className="li"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#d32f2f", fontSize: 13, marginTop: 10, marginBottom: 0 }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px",
              background: loading ? "#aaa" : "linear-gradient(135deg,#1a3c8f,#2d6cdf)",
              color: "white", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              marginTop: 20, transition: "opacity 0.2s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#bbb" }}>
          Admin access only · Contact office for credentials
        </p>
      </div>
    </div>
  );
}

export default Login;
