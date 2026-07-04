import React from "react";
import { Link } from "react-router-dom";
import "./Science.css";

const classes = [
  {
    label: "Class 10",
    pdf: "/pdfs/physics/class10_physics.pdf",
    color: "#1a3c8f",
    bg: "#e8efff",
    icon: "📘",
  },
  {
    label: "Class 11",
    pdf: "/pdfs/physics/class11_physics.pdf",
    color: "#0e7c4a",
    bg: "#e6f7ef",
    icon: "📗",
  },
  {
    label: "Class 12",
    pdf: "/pdfs/physics/class12_physics.pdf",
    color: "#c0392b",
    bg: "#fdecea",
    icon: "📕",
  },
    {
    label: "Class 13",
    pdf: "/pdfs/physics/class13_physics.pdf",
    color: "#c0392b",
    bg: "#aaaa",
    icon: "📕",
  },
];

function Physics() {
  return (
    <div className="science-page">
      {/* Back Button */}
      <div className="science-back-bar">
        <Link to="/science" className="science-back-btn">← Back to Science</Link>
      </div>

      {/* College Name Header */}
      <div className="science-header">
        <span className="science-badge">PHYSICS SUBJECT</span>
        <h1 className="science-title">K.D Public Inter College</h1>
        <div className="science-divider" />
        <p className="science-subtitle">
          Select your class below to view and download the Physics syllabus PDF.
        </p>
      </div>

      {/* Class Links */}
      <div className="physics-class-list">
        {classes.map((cls, i) => (
          <a
            key={i}
            href={cls.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="physics-class-card"
            style={{ background: cls.bg, borderLeft: `5px solid ${cls.color}` }}
          >
            <span className="physics-class-icon">{cls.icon}</span>
            <span className="physics-class-label" style={{ color: cls.color }}>
              {cls.label} — Physics Syllabus PDF
            </span>
            <span className="physics-class-arrow" style={{ color: cls.color }}>⬇ Download / View</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Physics;
