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

      {/* ─── Responsive styles ─── */}
      <style>{`
        .ap-topbar {
          background: linear-gradient(135deg,#1a3c8f,#2d6cdf);
          color: white;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 12px rgba(26,60,143,0.3);
          min-height: 64px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ap-tabs {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .ap-tabs::-webkit-scrollbar { display: none; }
        .ap-tab-btn { white-space: nowrap; flex-shrink: 0; }
        .ap-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        /* Tablet & below: tabs move to their own full-width row */
        @media (max-width: 860px) {
          .ap-topbar {
            padding: 10px 16px;
          }
          .ap-tabs {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            padding-bottom: 6px;
          }
        }

        /* Mobile: tighter spacing */
        @media (max-width: 520px) {
          .ap-content { padding: 20px 12px; }
          .ap-brand-title { font-size: 16px !important; }
          .ap-brand-sub { display: none; }
          .ap-logout-btn { padding: 7px 14px !important; font-size: 13px !important; }
          .ap-tab-btn { padding: 8px 14px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="ap-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🎓</span>
          <div>
            <div className="ap-brand-title" style={{ fontWeight: 800, fontSize: 18 }}>Admin Panel</div>
            <div className="ap-brand-sub" style={{ fontSize: 12, opacity: 0.8 }}>K.D Public Inter College</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="ap-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className="ap-tab-btn"
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
          className="ap-logout-btn"
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

      <div className="ap-content">

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
