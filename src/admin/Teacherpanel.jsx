import React, { useState, useEffect } from "react";

const API_BASE = "https://kdcollege-site-production.up.railway.app";
const API = `${API_BASE}/api`;

const DEPARTMENTS = [
  "Science",
  "Commerce",
  "Arts",
  "Mathematics",
  "Biology",
  "Physics",
  "Chemistry",
  "Hindi",
  "English",
  "Social Science",
];

function TeacherPanel({ token, showMsg }) {
  const [teachers, setTeachers] = useState([]);
  const [name, setName]         = useState("");
  const [dept, setDept]         = useState(DEPARTMENTS[0]);
  const [photo, setPhoto]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API}/teachers`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      showMsg("Failed to load teachers.", "error");
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    setPhoto(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showMsg("Please enter the teacher's name.", "error");
    if (!photo) return showMsg("Please select the teacher's photo.", "error");

    setUploading(true);
    const form = new FormData();
    form.append("name", name.trim());
    form.append("department", dept);
    form.append("photo", photo);
    form.append("token", token);

    try {
      const res = await fetch(`${API}/teachers/add`, { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("Teacher added successfully!");
        setName("");
        setDept(DEPARTMENTS[0]);
        setPhoto(null);
        setPreview(null);
        e.target.reset();
        fetchTeachers();
      } else {
        showMsg(data.detail || "Failed to add teacher.", "error");
      }
    } catch {
      showMsg("Server connection failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`${API}/teachers/delete/${id}?token=${token}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Teacher deleted successfully."); fetchTeachers(); }
    } catch {
      showMsg("Failed to delete teacher.", "error");
    }
  };

  return (
    <div>
      {/* ─── Responsive styles ─── */}
      <style>{`
        .tp-panel {
          background: white;
          border-radius: 16px;
          padding: 28px 32px;
          box-shadow: 0 4px 20px rgba(26,60,143,0.08);
        }
        .tp-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .tp-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .tp-panel { padding: 20px 18px; }
          .tp-form-grid { grid-template-columns: 1fr; gap: 18px; }
          .tp-list-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
        }

        @media (max-width: 400px) {
          .tp-panel { padding: 16px 14px; }
          .tp-panel h2 { font-size: 17px !important; }
          .tp-list-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }
      `}</style>

      {/* Add Teacher Form */}
      <div className="tp-panel" style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 24px", color: "#1a3c8f", fontSize: 20, fontWeight: 800 }}>
          👨‍🏫 Add New Teacher
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="tp-form-grid">

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
                Teacher's Photo
              </label>
              <input
                type="file" accept="image/*" onChange={handlePhotoChange}
                style={{ width: "100%", padding: "10px", border: "1.5px dashed #1a3c8f", borderRadius: 10, cursor: "pointer", background: "#f5f8ff", boxSizing: "border-box", fontSize: 13 }}
              />
              {preview && (
                <img src={preview} alt="preview" style={{ marginTop: 12, width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, border: "1px solid #dde3f0" }} />
              )}
            </div>

            {/* Name + Department + Submit */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
                  Teacher's Name
                </label>
                <input
                  type="text" placeholder="Enter full name..." value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde3f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
                  Department
                </label>
                <select
                  value={dept} onChange={(e) => setDept(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde3f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "white", cursor: "pointer" }}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit" disabled={uploading}
                style={{ padding: "13px", background: uploading ? "#aaa" : "linear-gradient(135deg,#1a3c8f,#2d6cdf)", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", marginTop: "auto" }}
              >
                {uploading ? "Adding..." : "Add Teacher"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Teachers List */}
      <div className="tp-panel">
        <h2 style={{ margin: "0 0 20px", color: "#1a3c8f", fontSize: 20, fontWeight: 800 }}>
          📋 All Teachers ({teachers.length})
        </h2>
        {teachers.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "40px 0" }}>No teachers added yet.</p>
        ) : (
          <div className="tp-list-grid">
            {teachers.map((t) => (
              <div key={t._id || t.id} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #eef0f8", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", background: "#fafbff" }}>
                <img
                  src={t.photo ? `${API_BASE}${t.photo}` : "https://via.placeholder.com/200x160?text=No+Photo"}
                  alt={t.name}
                  style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3c8f", marginBottom: 4, wordBreak: "break-word" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#666", background: "#e8efff", display: "inline-block", padding: "3px 10px", borderRadius: 20, fontWeight: 600, marginBottom: 10 }}>
                    {t.department}
                  </div>
                  <button
                    onClick={() => handleDelete(t._id || t.id)}
                    style={{ width: "100%", padding: "7px", background: "#fdecea", color: "#c62828", border: "1px solid #f5c6c6", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherPanel;
