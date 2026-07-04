import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

const API = "http://localhost:5001/api";

const SUBJECT_META = {
  "Physics":            { icon: "⚛️", color: "#1a3c8f", bg: "#e8efff", dept: "Science" },
  "Chemistry":          { icon: "🧪", color: "#0e7c4a", bg: "#e6f7ef", dept: "Science" },
  "Biology":            { icon: "🧬", color: "#7b2ff7", bg: "#f0e8ff", dept: "Science" },
  "Mathematics":        { icon: "➗", color: "#c0392b", bg: "#fdecea", dept: "Science" },
  "Computer Science":   { icon: "💻", color: "#0077b6", bg: "#e0f2fe", dept: "Science" },
  "Geography":          { icon: "🌍", color: "#e67e22", bg: "#fef3e2", dept: "Science" },
  "Science Practicals": { icon: "🔭", color: "#5c6bc0", bg: "#e8eaf6", dept: "Science" },
  "Accountancy":        { icon: "📊", color: "#1a3c8f", bg: "#e8efff", dept: "Commerce" },
  "Business Studies":   { icon: "💼", color: "#0e7c4a", bg: "#e6f7ef", dept: "Commerce" },
  "Economics":          { icon: "📈", color: "#7b2ff7", bg: "#f0e8ff", dept: "Commerce" },
  "Entrepreneurship":   { icon: "🚀", color: "#e67e22", bg: "#fef3e2", dept: "Commerce" },
  "Computer Application": { icon: "💻", color: "#0077b6", bg: "#e0f2fe", dept: "Commerce" },
  "History":            { icon: "🏛️", color: "#1a3c8f", bg: "#e8efff", dept: "Arts" },
  "Political Science":  { icon: "⚖️", color: "#7b2ff7", bg: "#f0e8ff", dept: "Arts" },
  "Sociology":          { icon: "👥", color: "#c0392b", bg: "#fdecea", dept: "Arts" },
  "Psychology":         { icon: "🧠", color: "#e67e22", bg: "#fef3e2", dept: "Arts" },
  "Hindi":              { icon: "📝", color: "#0077b6", bg: "#e0f2fe", dept: "Arts" },
  "English":            { icon: "📖", color: "#5c6bc0", bg: "#e8eaf6", dept: "Arts" },
};

const CLASS_COLORS = [
  { color: "#1a3c8f", bg: "#e8efff", icon: "📘" },
  { color: "#0e7c4a", bg: "#e6f7ef", icon: "📗" },
  { color: "#c0392b", bg: "#fdecea", icon: "📕" },
  { color: "#7b2ff7", bg: "#f0e8ff", icon: "📓" },
];

function SubjectDetail() {
  const { subject }  = useParams();
  const location     = useLocation();
  const subjectName  = decodeURIComponent(subject);
  const meta         = SUBJECT_META[subjectName] || { icon: "📚", color: "#1a3c8f", bg: "#e8efff", dept: "Science" };
  const department   = location.state?.department || meta.dept || "Science";

  const [pdfs, setPdfs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      try {
        const url = `${API}/pdfs?department=${encodeURIComponent(department)}&subject=${encodeURIComponent(subjectName)}`;
        const res  = await fetch(url);
        const data = await res.json();
        setPdfs(Array.isArray(data) ? data : []);
      } catch {
        setPdfs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, [subjectName, department]);

  const backPath = department === "Science" ? "/science"
    : department === "Commerce" ? "/commerce"
    : "/arts";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f8ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Back bar */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #eef0f8",
        padding: "14px 24px",
      }}>
        <Link
          to={backPath}
          style={{
            color: meta.color, textDecoration: "none",
            fontWeight: 700, fontSize: 14,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back to {department}
        </Link>
      </div>

      {/* Hero Header */}
      <div style={{
        background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}bb 100%)`,
        color: "white",
        padding: "22px 24px 18px",
        textAlign: "center",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, margin: "0 auto 10px",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>
          {meta.icon}
        </div>
        <div style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 20,
          background: "rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase",
        }}>
          {department} Stream
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>
          {subjectName}
        </h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 13, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Select your class below to view and download the study material PDF.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <p style={{ color: "#aaa" }}>Loading study materials...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <div style={{
            background: "white", borderRadius: 18, padding: "60px 32px",
            textAlign: "center", boxShadow: "0 4px 24px rgba(26,60,143,0.08)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📂</div>
            <h3 style={{ color: "#1a3c8f", fontWeight: 800, margin: "0 0 10px" }}>
              No PDFs Available Yet
            </h3>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              Study material for <strong>{subjectName}</strong> has not been uploaded yet.<br />
              Please check back later or contact the college office.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: "0 0 8px", color: "#888", fontSize: 13 }}>
              {pdfs.length} study material{pdfs.length > 1 ? "s" : ""} available
            </p>
            {pdfs.map((pdf, i) => {
              const c = CLASS_COLORS[i % CLASS_COLORS.length];
              return (
                <a
                  key={pdf._id}
                  href={`http://localhost:5001${pdf.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "20px 24px",
                    background: "white",
                    borderRadius: 14,
                    borderLeft: `5px solid ${c.color}`,
                    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
                    textDecoration: "none",
                    transition: "transform 0.18s, box-shadow 0.18s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.07)";
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: c.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                  }}>
                    {c.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: c.color }}>
                      {pdf.class_name}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                      {subjectName} — Study Material PDF
                    </div>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 30,
                    background: c.bg, color: c.color,
                    fontWeight: 700, fontSize: 13,
                  }}>
                    ⬇ Download
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectDetail;
