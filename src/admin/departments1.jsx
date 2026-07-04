import React, { useState, useEffect, useRef } from "react";

const API = "http://localhost:5001/api";

const DEPT_SUBJECTS = {
  Science: [
    { icon: "⚛️", name: "Physics",           color: "#1a3c8f", bg: "#e8efff" },
    { icon: "🧪", name: "Chemistry",         color: "#0e7c4a", bg: "#e6f7ef" },
    { icon: "🧬", name: "Biology",           color: "#7b2ff7", bg: "#f0e8ff" },
    { icon: "➗", name: "Mathematics",       color: "#c0392b", bg: "#fdecea" },
    { icon: "💻", name: "Computer Science",  color: "#0077b6", bg: "#e0f2fe" },
    { icon: "🌍", name: "Geography",         color: "#e67e22", bg: "#fef3e2" },
    { icon: "🔭", name: "Science Practicals",color: "#5c6bc0", bg: "#e8eaf6" },
  ],
  Commerce: [
    { icon: "📊", name: "Accountancy",          color: "#1a3c8f", bg: "#e8efff" },
    { icon: "💼", name: "Business Studies",     color: "#0e7c4a", bg: "#e6f7ef" },
    { icon: "📈", name: "Economics",            color: "#7b2ff7", bg: "#f0e8ff" },
    { icon: "📖", name: "English",              color: "#c0392b", bg: "#fdecea" },
    { icon: "🚀", name: "Entrepreneurship",     color: "#e67e22", bg: "#fef3e2" },
    { icon: "💻", name: "Computer Application", color: "#0077b6", bg: "#e0f2fe" },
  ],
  Arts: [
    { icon: "🏛️", name: "History",           color: "#1a3c8f", bg: "#e8efff" },
    { icon: "🌍", name: "Geography",         color: "#0e7c4a", bg: "#e6f7ef" },
    { icon: "⚖️", name: "Political Science", color: "#7b2ff7", bg: "#f0e8ff" },
    { icon: "👥", name: "Sociology",         color: "#c0392b", bg: "#fdecea" },
    { icon: "🧠", name: "Psychology",        color: "#e67e22", bg: "#fef3e2" },
    { icon: "📝", name: "Hindi",             color: "#0077b6", bg: "#e0f2fe" },
    { icon: "📖", name: "English",           color: "#5c6bc0", bg: "#e8eaf6" },
  ],
};

const CLASS_OPTIONS = ["Class 9", "Class 10", "Class 11", "Class 12"];

const DEPT_META = {
  Science:  { icon: "🔬", gradient: "linear-gradient(135deg,#1a3c8f,#2d6cdf)" },
  Commerce: { icon: "💼", gradient: "linear-gradient(135deg,#0e7c4a,#27ae60)" },
  Arts:     { icon: "🎨", gradient: "linear-gradient(135deg,#7b2ff7,#a855f7)" },
};

function SubjectPDFPanel({ token, showMsg }) {
  const [activeDept, setActiveDept]       = useState("Science");
  const [pdfs, setPdfs]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [modal, setModal]                 = useState(null);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [className, setClassName]         = useState(CLASS_OPTIONS[1]);
  const [pdfFile, setPdfFile]             = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [deleting, setDeleting]           = useState(null);
  const fileRef = useRef();

  const fetchPdfs = async (dept) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/pdfs?department=${encodeURIComponent(dept)}`);
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []);
    } catch {
      showMsg("Failed to load PDFs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPdfs(activeDept); }, [activeDept]);

  const getSubjectPdfs = (name) =>
    pdfs.filter((p) => p.subject === name);

  const openModal = (sub) => {
    setModal(sub);
    setUploadVisible(false);
    setClassName(CLASS_OPTIONS[1]);
    setPdfFile(null);
  };

  const closeModal = () => {
    setModal(null);
    setUploadVisible(false);
    setPdfFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) return showMsg("Please select a PDF file.", "error");

    setUploading(true);
    const form = new FormData();
    form.append("department", activeDept);
    form.append("subject",    modal.name);
    form.append("class_name", className);
    form.append("token",      token);
    form.append("pdf_file",   pdfFile);

    try {
      const res  = await fetch(`${API}/pdfs/add`, { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg(`PDF uploaded for ${modal.name} — ${className}!`);
        setPdfFile(null);
        setUploadVisible(false);
        if (fileRef.current) fileRef.current.value = "";
        fetchPdfs(activeDept);
      } else {
        showMsg(data.detail || "Upload failed.", "error");
      }
    } catch {
      showMsg("Server connection failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (pdfId, subjectName) => {
    if (!window.confirm(`Delete this PDF for "${subjectName}"?`)) return;
    setDeleting(pdfId);
    try {
      const res  = await fetch(`${API}/pdfs/delete/${pdfId}?token=${token}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("PDF deleted successfully.");
        fetchPdfs(activeDept);
      }
    } catch {
      showMsg("Failed to delete PDF.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const subjects   = DEPT_SUBJECTS[activeDept] || [];
  const deptMeta   = DEPT_META[activeDept];
  const modalPdfs  = modal ? getSubjectPdfs(modal.name) : [];

  return (
    <div>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity:0; transform:scale(0.94) translateY(-18px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes cardPop {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .subj-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 28px rgba(0,0,0,0.12) !important;
        }
        .dept-tab:hover { opacity:0.85; }
        .pdf-row:hover { filter: brightness(0.97); }
        .cls-btn:hover { transform: scale(1.05); }
        .drop-zone:hover { border-color: #1a3c8f !important; background: #f0f4ff !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "white", borderRadius: 16, padding: "24px 28px",
        boxShadow: "0 4px 20px rgba(26,60,143,0.08)", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: deptMeta.gradient,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>
          {deptMeta.icon}
        </div>
        <div>
          <h2 style={{ margin: 0, color: "#1a3c8f", fontSize: 20, fontWeight: 800 }}>
            Subject & PDF Management
          </h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
            Select a department, then click any subject to manage its study material PDFs.
          </p>
        </div>
      </div>

      {/* Department Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {Object.keys(DEPT_SUBJECTS).map((dept) => {
          const dm      = DEPT_META[dept];
          const isActive = activeDept === dept;
          const total   = pdfs.filter((p) => DEPT_SUBJECTS[dept]?.some((s) => s.name === p.subject)).length;
          return (
            <button
              key={dept}
              className="dept-tab"
              onClick={() => { setActiveDept(dept); closeModal(); }}
              style={{
                padding: "11px 26px",
                borderRadius: 30,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                background: isActive ? dm.gradient : "#f0f4ff",
                color: isActive ? "white" : "#555",
                boxShadow: isActive ? "0 4px 16px rgba(26,60,143,0.28)" : "none",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span>{dm.icon}</span>
              <span>{dept}</span>
              {isActive && (
                <span style={{
                  background: "rgba(255,255,255,0.28)", borderRadius: 10,
                  padding: "1px 8px", fontSize: 12,
                }}>
                  {subjects.length} subjects
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subject Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 14 }}>Loading PDFs...</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {subjects.map((sub, i) => {
            const count = getSubjectPdfs(sub.name).length;
            return (
              <div
                key={sub.name}
                className="subj-card"
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "20px",
                  border: `2px solid ${count > 0 ? sub.color + "44" : "#eef0f8"}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.22s",
                  animation: `cardPop 0.3s ease ${i * 0.05}s both`,
                  cursor: "default",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    background: sub.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {sub.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: sub.color }}>{sub.name}</div>
                    <div style={{
                      marginTop: 4, fontSize: 12, fontWeight: 600,
                      color: count > 0 ? sub.color : "#aaa",
                      background: count > 0 ? sub.bg : "#f5f5f5",
                      display: "inline-block", padding: "2px 10px", borderRadius: 20,
                    }}>
                      {count === 0 ? "No PDFs yet" : `${count} PDF${count > 1 ? "s" : ""} uploaded`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openModal(sub)}
                  style={{
                    width: "100%", padding: "10px",
                    background: sub.bg,
                    color: sub.color,
                    border: `1.5px solid ${sub.color}44`,
                    borderRadius: 10, cursor: "pointer",
                    fontWeight: 700, fontSize: 13,
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = sub.color;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = sub.bg;
                    e.currentTarget.style.color = sub.color;
                  }}
                >
                  📂 Manage {sub.name} PDFs
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL ─── */}
      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(10,20,50,0.55)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(5px)",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 22,
              width: "100%", maxWidth: 560,
              maxHeight: "90vh", overflowY: "auto",
              boxShadow: "0 32px 80px rgba(26,60,143,0.28)",
              animation: "fadeSlideIn 0.25s ease",
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px 28px 20px",
              borderBottom: `3px solid ${modal.bg}`,
              display: "flex", alignItems: "center", gap: 14,
              position: "sticky", top: 0, background: "white",
              borderRadius: "22px 22px 0 0", zIndex: 1,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: modal.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>
                {modal.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: modal.color, fontWeight: 800, fontSize: 19 }}>
                  {modal.name}
                </h3>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                  {activeDept} Department · {modalPdfs.length} PDF{modalPdfs.length !== 1 ? "s" : ""} uploaded
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "#f5f5f5", border: "none", width: 36, height: 36,
                  borderRadius: "50%", cursor: "pointer", fontSize: 18,
                  color: "#888", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >×</button>
            </div>

            <div style={{ padding: "24px 28px" }}>

              {/* Upload Toggle Button */}
              {!uploadVisible ? (
                <button
                  onClick={() => setUploadVisible(true)}
                  style={{
                    width: "100%", padding: "13px",
                    background: `linear-gradient(135deg, ${modal.color}, ${modal.color}cc)`,
                    color: "white", border: "none", borderRadius: 12,
                    cursor: "pointer", fontWeight: 700, fontSize: 15,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 22,
                  }}
                >
                  ⬆ Upload New PDF for {modal.name}
                </button>
              ) : (
                /* Upload Form */
                <div style={{
                  background: modal.bg, borderRadius: 14,
                  padding: "20px", marginBottom: 22,
                  border: `1.5px solid ${modal.color}33`,
                }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: 16,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: modal.color }}>
                      Upload PDF
                    </div>
                    <button
                      onClick={() => { setUploadVisible(false); setPdfFile(null); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: modal.color, fontSize: 13, fontWeight: 600,
                      }}
                    >
                      Cancel ✕
                    </button>
                  </div>

                  <form onSubmit={handleUpload}>
                    {/* Class Selector */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Select Class
                      </label>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {CLASS_OPTIONS.map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            className="cls-btn"
                            onClick={() => setClassName(cls)}
                            style={{
                              padding: "8px 18px", borderRadius: 20,
                              border: `2px solid ${className === cls ? modal.color : modal.color + "44"}`,
                              background: className === cls ? modal.color : "white",
                              color: className === cls ? "white" : modal.color,
                              cursor: "pointer", fontWeight: 700, fontSize: 13,
                              transition: "all 0.15s",
                            }}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PDF Drop Zone */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        PDF File
                      </label>
                      <div
                        className="drop-zone"
                        onClick={() => fileRef.current?.click()}
                        style={{
                          border: `2px dashed ${pdfFile ? modal.color : modal.color + "66"}`,
                          borderRadius: 12, padding: "22px 16px",
                          textAlign: "center", cursor: "pointer",
                          background: pdfFile ? "white" : "transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontSize: 30, marginBottom: 6 }}>
                          {pdfFile ? "📄" : "📁"}
                        </div>
                        <div style={{ fontSize: 13, color: modal.color, fontWeight: 600 }}>
                          {pdfFile ? pdfFile.name : "Click to select a PDF file"}
                        </div>
                        {pdfFile && (
                          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                        {!pdfFile && (
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                            Max file size: 20 MB
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileRef} type="file"
                        accept=".pdf,application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) => setPdfFile(e.target.files[0] || null)}
                      />
                    </div>

                    <button
                      type="submit" disabled={uploading}
                      style={{
                        width: "100%", padding: "12px",
                        background: uploading ? "#aaa" : modal.color,
                        color: "white", border: "none", borderRadius: 10,
                        fontSize: 14, fontWeight: 700,
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                    >
                      {uploading ? "Uploading..." : `⬆ Upload for ${className}`}
                    </button>
                  </form>
                </div>
              )}

              {/* PDF List */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Uploaded PDFs ({modalPdfs.length})
                </div>

                {modalPdfs.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "36px 0",
                    color: "#bbb", fontSize: 14,
                    background: "#fafbff", borderRadius: 12,
                    border: "1.5px dashed #e0e4f0",
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                    No PDFs uploaded yet for this subject.<br />
                    <span style={{ fontSize: 12 }}>Use the button above to add one.</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {modalPdfs.map((pdf) => (
                      <div
                        key={pdf._id}
                        className="pdf-row"
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 14px", background: modal.bg,
                          borderRadius: 12, border: `1px solid ${modal.color}22`,
                          transition: "filter 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 22 }}>📄</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: modal.color }}>
                            {pdf.class_name}
                          </div>
                          <div style={{
                            fontSize: 11, color: "#888", marginTop: 2,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {pdf.original_name}
                          </div>
                        </div>
                        <a
                          href={`http://localhost:5001${pdf.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "5px 12px", borderRadius: 8,
                            background: modal.color + "18", color: modal.color,
                            textDecoration: "none", fontWeight: 700, fontSize: 12,
                            border: `1px solid ${modal.color}44`,
                          }}
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(pdf._id, modal.name)}
                          disabled={deleting === pdf._id}
                          style={{
                            padding: "5px 12px", background: "#fdecea",
                            color: "#c62828", border: "1px solid #f5c6c6",
                            borderRadius: 8, cursor: deleting === pdf._id ? "not-allowed" : "pointer",
                            fontSize: 12, fontWeight: 700,
                          }}
                        >
                          {deleting === pdf._id ? "..." : "Delete"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectPDFPanel;
