import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPanel from "./dashboardpanel";
import TeacherPanel from "./Teacherpanel";
import SubjectPDFPanel from "./departments1";

function AdminPanel() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken");
  const [activeTab, setActiveTab] = useState("gallery");
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/");
  };

  const tabs = [
    { key: "gallery", label: "🖼️ Gallery" },
    { key: "teacher", label: "👨‍🏫 Teacher" },
    { key: "subjects", label: "📚 Subjects" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Top bar */}
      <div style={{
        background: "linear-gradient(135deg,#1a3c8f,#2d6cdf)",
        color: "white", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(26,60,143,0.3)",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🎓</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Admin Panel</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>K.D Public Inter College</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "transparent",
                color: "white",
                borderBottom: activeTab === tab.key ? "2px solid white" : "2px solid transparent",
                transition: "background 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.4)",
            color: "white", padding: "8px 20px", borderRadius: 8,
            cursor: "pointer", fontWeight: 600, fontSize: 14,
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>

        {/* Toast message */}
        {msg.text && (
          <div style={{
            padding: "12px 20px", borderRadius: 10, marginBottom: 24,
            background: msg.type === "error" ? "#fdecea" : "#e8f5e9",
            color: msg.type === "error" ? "#c62828" : "#2e7d32",
            border: `1px solid ${msg.type === "error" ? "#f5c6c6" : "#a5d6a7"}`,
            fontWeight: 500,
          }}>
            {msg.text}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "gallery" && (
          <DashboardPanel token={token} showMsg={showMsg} />
        )}

        {activeTab === "teacher" && (
          <TeacherPanel token={token} showMsg={showMsg} />
        )}

        {activeTab === "subjects" && (
          <SubjectPDFPanel token={token} showMsg={showMsg} />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
