import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Science.css";

const subjects = [
  {
    icon: "⚛️",
    name: "Physics",
    desc: "Mechanics, Optics, Electricity, Magnetism, Modern Physics",
    color: "#1a3c8f",
    bg: "#e8efff",
  },
  {
    icon: "🧪",
    name: "Chemistry",
    desc: "Organic, Inorganic & Physical Chemistry with Lab Practicals",
    color: "#0e7c4a",
    bg: "#e6f7ef",
  },
  {
    icon: "🧬",
    name: "Biology",
    desc: "Botany, Zoology, Cell Biology, Genetics & Ecology",
    color: "#7b2ff7",
    bg: "#f0e8ff",
  },
  {
    icon: "➗",
    name: "Mathematics",
    desc: "Algebra, Calculus, Coordinate Geometry, Trigonometry & Statistics",
    color: "#c0392b",
    bg: "#fdecea",
  },
  {
    icon: "🌍",
    name: "Geography",
    desc: "Physical Geography, Map Work, Climate & Environmental Studies",
    color: "#e67e22",
    bg: "#fef3e2",
  },
  {
    icon: "💻",
    name: "Computer Science",
    desc: "Programming Basics, MS Office, Internet & Digital Literacy",
    color: "#0077b6",
    bg: "#e0f2fe",
  },
  {
    icon: "🔭",
    name: "Science Practicals",
    desc: "Hands-on Lab Experiments in Physics, Chemistry & Biology",
    color: "#5c6bc0",
    bg: "#e8eaf6",
  },
];

function Science() {
  const navigate = useNavigate();

  const handleSubjectClick = (sub) => {
    navigate(`/science/${encodeURIComponent(sub.name)}`, {
      state: { department: "Science" },
    });
  };

  return (
    <div className="science-page">
      {/* Back Button */}
      <div className="science-back-bar">
        <Link to="/" className="science-back-btn">← Back to Home</Link>
      </div>

      {/* Header */}
      <div className="science-header">
        <span className="science-badge">SCIENCE STREAM</span>
        <h1 className="science-title">Science Department</h1>
        <div className="science-divider" />
        <p className="science-subtitle">
          Explore all subjects offered in the Science stream at K.D Public Inter College.
          Click on a subject to view and download study material PDFs.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="science-grid">
        {subjects.map((sub, i) => (
          <div
            key={i}
            className="science-card"
            style={{ animationDelay: `${i * 0.08}s`, cursor: "pointer" }}
            onClick={() => handleSubjectClick(sub)}
          >
            <div className="science-card-icon" style={{ background: sub.bg, color: sub.color }}>
              {sub.icon}
            </div>
            <div className="science-card-body">
              <h3 className="science-card-name" style={{ color: sub.color }}>{sub.name}</h3>
              <p className="science-card-desc">{sub.desc}</p>
            </div>
            <div className="science-card-arrow" style={{ color: sub.color }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Science;
