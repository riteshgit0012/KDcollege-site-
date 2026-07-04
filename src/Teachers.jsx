import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://kdcollege-site-production.up.railway.app";
const API = `${API_BASE}/api`;

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    fetch(`${API}/teachers`)
      .then((r) => r.json())
      .then((data) => { setTeachers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Not uploaded any Teacher. Plz check server .   if any issue facing then contact Ritesh (6386606277).."); setLoading(false); });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        background: "linear-gradient(90deg,rgba(15,35,110,0.97),rgba(8,22,72,0.97))",
        padding: "0 36px", height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#fff,#c8d8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#1a3c8f" }}>KD</div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>K.D Public Inter College</div>
        </div>
        <Link to="/" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 600, fontSize: 14, padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)" }}>
          ← Home
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ background: "#e8efff", color: "#1a3c8f", fontWeight: 700, fontSize: 13, padding: "5px 16px", borderRadius: 20, letterSpacing: 1 }}>
            OUR FACULTY
          </span>
          <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 900, color: "#0d1f5c", margin: "14px 0 10px" }}>
            Our Teachers
          </h1>
          <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#1a3c8f,#2d6cdf)", borderRadius: 2, margin: "0 auto" }} />
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#888", fontSize: 16, padding: "60px 0" }}>Loading teachers...</p>
        )}

        {error && (
          <div style={{ textAlign: "center", background: "#fdecea", color: "#c62828", padding: "20px", borderRadius: 12, maxWidth: 500, margin: "0 auto" }}>
            {error}
          </div>
        )}

        {!loading && !error && teachers.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 16, padding: "60px 0" }}>
            No teacher added in the list .
          </p>
        )}

        {!loading && teachers.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28 }}>
            {teachers.map((t) => (
              <div
                key={t._id || t.id}
                style={{
                  background: "white", borderRadius: 18, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(26,60,143,0.10)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(26,60,143,0.18)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,60,143,0.10)"; }}
              >
                <div style={{ position: "relative", height: 200, background: "#e8efff" }}>
                  <img
                    src={t.photo ? `${API_BASE}${t.photo}` : "https://via.placeholder.com/220x200?text=No+Photo"}
                    alt={t.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#0d1f5c", marginBottom: 8 }}>{t.name}</div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#1a3c8f",
                    background: "#e8efff", padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5,
                  }}>
                    {t.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer end */}
      <footer style={{ background: "#080f2e", padding: "24px 40px", textAlign: "center", marginTop: 60 }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          © 2026 K.D Public Inter College. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default Teachers;