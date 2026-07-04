import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import Science from "./Science";
import SubjectDetail from "./SubjectDetail";
import Gallery from "./Gallery";
import AdminPanel from "./admin/AdminPanel";
import Teachers from "./Teachers";

const ComingSoon = ({ title }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", background: "#f5f8ff" }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <h1 style={{ color: "#1a3c8f", fontSize: 28, fontWeight: 800 }}>{title}</h1>
    <p style={{ color: "#888", marginTop: 8 }}>Page coming soon...</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/"               element={<Home />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/facility"       element={<ComingSoon title="Facility" />} />
      <Route path="/gallery"        element={<Gallery />} />
      <Route path="/teachers"       element={<Teachers />} />
      <Route path="/science"        element={<Science />} />
      <Route path="/science/:subject" element={<SubjectDetail />} />
      <Route path="/physics"        element={<Navigate to="/science/Physics" replace />} />
      <Route path="/biology"        element={<Navigate to="/science/Biology" replace />} />
      <Route path="/arts-commerce"  element={<ComingSoon title="Art & Commerce" />} />
      <Route path="/courses"        element={<ComingSoon title="Courses Offered" />} />
      <Route path="/syllabus"       element={<ComingSoon title="Syllabus" />} />
      <Route path="/admin"          element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
