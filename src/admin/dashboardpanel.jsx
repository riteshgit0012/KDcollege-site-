import React, { useState, useEffect } from "react";

const API = "http://localhost:5001/api";

function DashboardPanel({ token, showMsg }) {
  const [images, setImages]     = useState([]);
  const [file, setFile]         = useState(null);
  const [label, setLabel]       = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]   = useState(null);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API}/gallery/images`);
      const data = await res.json();
      setImages(data);
    } catch {
      showMsg("Images not loaded , please try again .....", "error");
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showMsg("Please Select photo .     If facing any issue plz contact 6386606277    ", "error");
    if (!label.trim()) return showMsg("Write label of photo .", "error");

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("label", label.trim());
    form.append("token", token);

    try {
      const res = await fetch(`${API}/gallery/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("Photo successfully uploaded !");
        setFile(null);
        setLabel("");
        setPreview(null);
        e.target.reset();
        fetchImages();
      } else {
        showMsg(data.detail || "Upload failed.", "error");
      }
    } catch {
      showMsg("it's not connected to the server, plz try again .", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure ? Photo deleted.")) return;
    try {
      const res = await fetch(`${API}/gallery/delete/${filename}?token=${token}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Photo deleted."); fetchImages(); }
    } catch {
      showMsg("Not deleted .", "error");
    }
  };

  return (
    <div>
      {/* Upload Section */}
      <div style={{
        background: "white", borderRadius: 16, padding: "28px 32px",
        boxShadow: "0 4px 20px rgba(26,60,143,0.08)", marginBottom: 32,
      }}>
        <h2 style={{ margin: "0 0 20px", color: "#1a3c8f", fontSize: 20, fontWeight: 800 }}>
          📸 please upload the photo in galary. 
        </h2>
        <form onSubmit={handleUpload}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
                please select photo
              </label>
              <input
                type="file" accept="image/*" onChange={handleFileChange}
                style={{ width: "100%", padding: "10px", border: "1.5px dashed #1a3c8f", borderRadius: 10, cursor: "pointer", background: "#f5f8ff", boxSizing: "border-box", fontSize: 13 }}
              />
              {preview && (
                <img src={preview} alt="preview" style={{ marginTop: 12, width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: "1px solid #dde3f0" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>
                Label of photo (As "Annual Function")
              </label>
              <input
                type="text" placeholder="Label ..." value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #dde3f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
              <button
                type="submit" disabled={uploading}
                style={{ marginTop: 16, padding: "12px", background: uploading ? "#aaa" : "linear-gradient(135deg,#1a3c8f,#2d6cdf)", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer" }}
              >
                {uploading ? "Uploaded ..." : "plz upload "}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div style={{ background: "white", borderRadius: 16, padding: "28px 32px", boxShadow: "0 4px 20px rgba(26,60,143,0.08)" }}>
        <h2 style={{ margin: "0 0 20px", color: "#1a3c8f", fontSize: 20, fontWeight: 800 }}>
          🖼️ Manage gallary  ({images.length} photos)
        </h2>
        {images.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "40px 0" }}>Not uploaded photo this time .     <br />  If any issue facing plz contact 6386606277.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {images.map((img) => (
              <div key={img.filename} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #eef0f8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <img src={`http://localhost:5001${img.url}`} alt={img.label} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px 12px", background: "white" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>{img.label}</div>
                  <button
                    onClick={() => handleDelete(img.filename)}
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

export default DashboardPanel;
