import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import collegeBg from "./assets/college.jpg";
import "./Home.css";
import Ritesh from "./assets/Ritesh.jpg"
import kunal from "./assets/kunal.jpg"
import Rohit from "./assets/Rohit.jpg"

const API_URL = "https://kdcollege-site-production.up.railway.app/api/contact";
// Splits text into spans so each letter animates in one-by-one
function TypeWriter({ text, className, style }) {
  const words = text.split(" ");
  let charIndex = 0;
  return (
    <span className={className} style={style}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", marginRight: wi < words.length - 1 ? "0.28em" : 0 }}>
          {word.split("").map((ch) => {
            const delay = `${charIndex++ * 0.055}s`;
            return (
              <span key={ch + charIndex} style={{ display: "inline-block", animation: `letterPop 0.4s ease both`, animationDelay: delay }}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function Home() {
  const [loginOpen, setLoginOpen]       = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);
  const [deptHover, setDeptHover] = useState(false);

  // Contact form state
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({ loading: false, success: "", error: "" });

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: "", error: "" });
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus({ loading: false, success: data.message, error: "" });
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setFormStatus({ loading: false, success: "", error: data.error || "Something went wrong." });
      }
    } catch {
      setFormStatus({ loading: false, success: "", error: "Cannot connect to server. Please try again later." });
    }
  };
  const aboutRef       = useRef(null);
  const contactRef     = useRef(null);
  const topRef         = useRef(null);
  const academicRef    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (academicRef.current && !academicRef.current.contains(e.target)) {
        setAcademicOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const scrollTo = (ref) => {
    setMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} style={{ fontFamily: "'Segoe UI', sans-serif", margin: 0, padding: 0, overflowX: "hidden" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav
        className="navbar"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: scrolled ? "rgba(15,35,110,0.97)" : "linear-gradient(90deg,rgba(15,35,110,0.88),rgba(8,22,72,0.82))",
          backdropFilter: "blur(14px)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
          transition: "background 0.3s, box-shadow 0.3s",
          padding: "0 36px",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", maxWidth: 1500, margin: "0 auto", width: "100%" }}>

          {/* LEFT — College name / logo */}
<div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
  <div className="navbar-logo" style={{
    width: 40, height: 40, borderRadius: "50%",
    background: "linear-gradient(135deg,#fff,#c8d8ff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 900, fontSize: 15, color: "#1a3c8f",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    flexShrink: 0,
  }}>KD</div>
  <div>
    <div className="navbar-college-name" style={{ color: "white", fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>K.D Public Inter College</div>
    <div className="navbar-college-sub" style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>Excellence in Education</div>
  </div>
</div>

          {/* CENTER — nav links */}
          <div className="nav-links" style={{ display: "flex", gap: 2, margin: "0 auto" }}>
            <button onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })} className="nav-link">Home</button>
            <button onClick={() => scrollTo(aboutRef)} className="nav-link">About Us</button>
            <Link to="/gallery"  className="nav-link">Gallery</Link>
            <button onClick={() => scrollTo(contactRef)} className="nav-link">Contact</button>
            <Link to="/teachers" className="nav-link">Teachers</Link>
            <div
              className="nav-dropdown-wrap"
              ref={academicRef}
            >
              <button
                className="nav-link nav-dropdown-btn"
                onClick={() => setAcademicOpen(p => !p)}
              >
                Academics <span style={{ fontSize: 10, marginLeft: 4 }}>{academicOpen ? "▲" : "▼"}</span>
              </button>
              {academicOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/courses" className="nav-dropdown-item" onClick={() => setAcademicOpen(false)}>Courses Offered</Link>
                  <Link to="/syllabus" className="nav-dropdown-item" onClick={() => setAcademicOpen(false)}>Syllabus</Link>
                  {/* Departments with side submenu */}
                  <div
                    className="nav-dropdown-item nav-dept-wrap"
                    onMouseEnter={() => setDeptHover(true)}
                    onMouseLeave={() => setDeptHover(false)}
                  >
                    Departments <span style={{ float: "right", fontSize: 11 }}>▶</span>
                    {deptHover && (
                      <div className="nav-dept-submenu">
                        <Link to="/science" className="nav-dropdown-item" onClick={() => setAcademicOpen(false)}>Science</Link>
                        <Link to="/biology" className="nav-dropdown-item" onClick={() => setAcademicOpen(false)}>Biology</Link>
                        <Link to="/arts-commerce" className="nav-dropdown-item" onClick={() => setAcademicOpen(false)}>Art & Commerce</Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* <div class="dropdown">
                <option value="hjdbfd">jbvbjf</option>
</div> */}
          </div>

          {/* RIGHT — Login + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
            {/* Hamburger */}
            <div className="hamburger" onClick={() => setMenuOpen(p => !p)}>
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="mobile-nav-link" onClick={() => { setMenuOpen(false); topRef.current?.scrollIntoView({ behavior: "smooth" }); }}>Home</button>
          <button className="mobile-nav-link" onClick={() => scrollTo(aboutRef)}>About Us</button>
          <Link to="/gallery"  className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <button className="mobile-nav-link" onClick={() => scrollTo(contactRef)}>Contact</button>
          <Link to="/teachers" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Teachers</Link>
          <button className="mobile-nav-link mobile-dropdown-btn" onClick={() => setMobileAcademicOpen(p => !p)}>
            Academics <span style={{ fontSize: 10, marginLeft: 4 }}>{mobileAcademicOpen ? "▲" : "▼"}</span>
          </button>
          {mobileAcademicOpen && (
            <div className="mobile-dropdown-submenu">
              <Link to="/courses"      className="mobile-nav-link mobile-sub-link" onClick={() => { setMenuOpen(false); setMobileAcademicOpen(false); }}>Courses Offered</Link>
              <Link to="/syllabus"     className="mobile-nav-link mobile-sub-link" onClick={() => { setMenuOpen(false); setMobileAcademicOpen(false); }}>Syllabus</Link>
              <Link to="/science"      className="mobile-nav-link mobile-sub-link" onClick={() => { setMenuOpen(false); setMobileAcademicOpen(false); }}>Science</Link>
              <Link to="/biology"      className="mobile-nav-link mobile-sub-link" onClick={() => { setMenuOpen(false); setMobileAcademicOpen(false); }}>Biology</Link>
              <Link to="/arts-commerce" className="mobile-nav-link mobile-sub-link" onClick={() => { setMenuOpen(false); setMobileAcademicOpen(false); }}>Art & Commerce</Link>
            </div>
          )}
          <button className="login-btn" style={{ marginTop: 14, width: "100%" }} onClick={() => { setMenuOpen(false); setLoginOpen(true); }}>Login</button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="hero-section">
        <div className="hero-bg-layer active" style={{ backgroundImage: `url(${collegeBg})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.28)", borderRadius: 30,
            padding: "6px 22px", fontSize: 13, fontWeight: 600,
            letterSpacing: 1, marginBottom: 22, backdropFilter: "blur(8px)",
          }}>Established 2010 · Affiliated to UP Board</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 900, margin: "0 0 16px", textShadow: "0 4px 24px rgba(0,0,0,0.5)", lineHeight: 1.3 }}>
            <TypeWriter text="K.D Public Inter College" style={{ display: "block", color: "white" }} />
            <TypeWriter
              text=""
              style={{
                display: "block",
                background: "linear-gradient(90deg,#7eb8ff,#c4daff,#7eb8ff)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}
            />
          </h1>
          <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: "rgba(255,255,255,0.85)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Nurturing minds, building futures — a premier institution dedicated to academic excellence and holistic development.
          </p>
          <div className="hero-btns">
            <button onClick={() => setLoginOpen(true)} className="hero-btn-primary"
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>Student Login</button>
            <button onClick={() => scrollTo(contactRef)} className="hero-btn-outline"
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ background: "linear-gradient(135deg,#1a3c8f,#0e2860)", padding: "50px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24 }}>
          {[
            { num: "30000+", label: "Students Enrolled" },
            { num: "20+",   label: "Expert Teachers" },
            { num: "25+",   label: "Years of Excellence" },
            { num: "92%",   label: "Pass Rate" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 34, fontWeight: 900 }}>{s.num}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ ABOUT US ══════════ */}
      <section ref={aboutRef} className="about-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ background: "#e8efff", color: "#1a3c8f", fontWeight: 700, fontSize: 13, padding: "5px 16px", borderRadius: 20, letterSpacing: 1 }}>WHO WE ARE</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0d1f5c", margin: "14px 0 12px" }}>About K.D Public Inter College</h2>
            <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#1a3c8f,#2d6cdf)", borderRadius: 2, margin: "0 auto" }} />
          </div>

          {/* Content grid */}
          <div className="about-grid">
            {/* Left text */}
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a3c8f", marginBottom: 14 }}>Our Story</h3>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>
                K.D Public Inter College was established in the year 2000 with a vision to provide quality education to students from all walks of life. Affiliated to the Uttar Pradesh Madhyamik Shiksha Parishad (UP Board), we have grown into one of the most trusted educational institutions in the region.
              </p>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Over the past 25 years, we have produced thousands of successful alumni who have made their mark in government services, engineering, medicine, and business. Our dedicated faculty, modern infrastructure, and student-centric approach make us the first choice for parents and students alike.
              </p>
              <div className="about-badges" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["🏅","UP Board Affiliated"],["🏫","Modern Campus"],["📚","Rich Library"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f5ff", borderRadius: 30, padding: "8px 16px" }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span style={{ color: "#1a3c8f", fontWeight: 600, fontSize: 13 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mission / Vision / Values */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "🎯", title: "Our Mission", text: "To impart quality education that shapes character, builds knowledge, and prepares students for a competitive world." },
                { icon: "👁️", title: "Our Vision",  text: "To be the leading educational institution that creates responsible, knowledgeable and compassionate citizens." },
                { icon: "💡", title: "Our Values",  text: "Integrity, discipline, innovation, inclusivity and respect for every individual form the core of our institution." },
              ].map((item) => (
                <div key={item.title} className="value-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ fontSize: 28 }}>{item.icon}</div>
                    <h4 style={{ color: "#1a3c8f", fontWeight: 800, fontSize: 16 }}>{item.title}</h4>
                  </div>
                  <p style={{ color: "#666", fontSize: 14, lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Principal message */}
          <div className="about-principal">
            <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ fontSize: 48, color: "rgba(255,255,255,0.2)", fontFamily: "Georgia, serif", position: "absolute", top: 20, left: 36, lineHeight: 1 }}>"</div>
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "clamp(0.95rem,2vw,1.15rem)", lineHeight: 1.8, color: "rgba(255,255,255,0.92)", fontStyle: "italic", maxWidth: 760, marginBottom: 20, paddingLeft: 24 }}>
                Education is not the filling of a pail, but the lighting of a fire. At K.D Public Inter College, we strive every day to ignite that spark of curiosity, ambition and excellence in each of our students.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👨‍💼</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Principal, K.D Public Inter College</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Message from the principal desk . </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section style={{ background: "#f5f8ff", padding: "70px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ background: "#e8efff", color: "#1a3c8f", fontWeight: 700, fontSize: 13, padding: "5px 16px", borderRadius: 20, letterSpacing: 1 }}>WHAT WE OFFER</span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0d1f5c", margin: "14px 0 0" }}>Our Features</h2>
          <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#1a3c8f,#2d6cdf)", borderRadius: 2, margin: "12px auto 0" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 28 }}>
          {[
            { icon: "🎓", title: "Student Management",   desc: "Manage admissions, profiles & academic records effortlessly." },
            { icon: "👨‍🏫", title: "Teacher Portal",       desc: "Dedicated space for teachers to update grades & timetables." },
            { icon: "📅", title: "Attendance System",    desc: "Real-time daily attendance tracking for all classes." },
            { icon: "📊", title: "Result Management",    desc: "Publish and access exam results with full transparency." },
            { icon: "🏛️", title: "World-Class Facility", desc: "Labs, library, sports ground & modern smart classrooms." },
            { icon: "📸", title: "Photo Gallery",        desc: "Memories and events captured beautifully year-round." },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.4}s` }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a3c8f", margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>




      {/* ══════════  MAP ══════════ */}
      <section  style={{ background: "#f5f8ff", padding: "70px 40px", scrollMarginTop: 64 }}>
        <style>{`
          .c-input { width:100%; padding:11px 14px; border:1.5px solid #dde3f0; border-radius:9px; font-size:14px; outline:none; transition:border 0.2s; font-family:inherit; box-sizing:border-box; }
          .c-input:focus { border-color:#1a3c8f; }
        `}</style>

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── Map Heading ── */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>📍</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#0d1f5c", lineHeight: 1.2 }}>Our College Here</div>
            <br></br>
            <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>K.D Public Inter College — Find us on the map</div>
          </div>

          {/* MAP — paste your Google Maps embed src below */}
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(26,60,143,0.14)", marginBottom: 32 }}>
           <iframe
           title="College Location"
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.585647501777!2d82.24596626126227!3d26.650423075806096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3990a1f8c2bc614d%3A0x103399e155403ce5!2sK%20D%20Public%20Inter%20College!5e0!3m2!1sen!2sin!4v1780908739542!5m2!1sen!2sin"
           width="100%"
           height="400"
           style={{ border: 0, display: "block" }}
           allowFullScreen
           loading="lazy"
           referrerPolicy="no-referrer-when-downgrade"
           />
          </div>

          {/* Info cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { icon: "📍", label: "Address", val: "K.D Public Inter College,Pursayen Rasoolabad, Ayodhya, UP" },
              { icon: "📞", label: "Phone",   val: "+91 8052062692 , 6386606277" },
              { icon: "✉️", label: "Email",   val: "ritesh@gmail.com" },
              { icon: "🕐", label: "Timings", val: "Mon-Sat: 8:00 AM - 4:00 PM" },
            ].map(item => (
              <div key={item.label} style={{ background: "white", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 16px rgba(26,60,143,0.08)" }}>
                <div style={{ fontSize: 26 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: "#1a3c8f", fontWeight: 700, letterSpacing: 0.5 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#333", fontWeight: 600, marginTop: 2 }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>


          {/* ══════════ LEADERSHIP / PRINCIPAL PHOTOS ══════════ */}
      <section className="leadership-section">
        <div className="leadership-inner">

          <div className="leadership-heading">
            <span className="leadership-badge">OUR LEADERSHIP</span>
            <h2 className="leadership-title">Head of College </h2>
            <div className="leadership-divider" />
          </div>

          <div className="leadership-cards">
            {[
              { photo: Ritesh, initials: "RK", name: "Ritesh Sharma", dept: "Principal",      borderColor: "#1a3c8f" },
              { photo: Rohit,   initials: "SP", name: "Rohit Garg",  dept: "Vice Principal", borderColor: "#0e7c4a" },
              { photo: kunal,   initials: "AV", name: "Kunal Prajapati",    dept: "Head Teacher",   borderColor: "#7b2ff7" },
            ].map((person) => (
              <div key={person.dept} className="person-card">
                <div className="person-circle" style={{ borderColor: person.borderColor }}>
                  {person.photo
                    ? <img src={person.photo} alt={person.name} />
                    : <div className="person-placeholder" style={{ color: person.borderColor }}>{person.initials}</div>
                  }
                </div>
                <div className="person-info">
                  <div className="person-name">{person.name}</div>
                  <span className="person-dept">{person.dept}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


 {/* ── Contact Heading ── */}
          <div ref={contactRef} style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{
              background: "linear-gradient(135deg,#1a3c8f,#2d6cdf)",
              color: "white", fontWeight: 700, fontSize: 12,
              padding: "5px 18px", borderRadius: 20, letterSpacing: 1.5,
              textTransform: "uppercase",
            }}>Get In Touch</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0d1f5c", margin: "14px 0 10px" }}>  {/* clamp(minimum size , preferred size , maximum size ) */}
              Contact Us
            </h2>
            <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#1a3c8f,#2d6cdf)", borderRadius: 3, margin: "0 auto 14px" }} />
            <p style={{ color: "#666", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Have a question or need more information? We'd love to hear from you. Reach out and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact form */}
          <form onSubmit={handleFormSubmit} style={{ background: "white", borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(26,60,143,0.10)", maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0d1f5c", marginBottom: 28 }}>Send a Message</h2>
            <div className="contact-form-grid">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Your Name</label>
                <input type="text" name="name" placeholder="Full name" className="c-input" value={form.name} onChange={handleFormChange} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Phone Number</label>
                <input type="tel" name="phone" placeholder="10-digit mobile number" className="c-input" value={form.phone} onChange={handleFormChange} required />
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Email Address</label>
              <input type="email" name="email" placeholder="your@gmail.com" className="c-input" value={form.email} onChange={handleFormChange} required />
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Message</label>
              <textarea rows={4} name="message" placeholder="Write your message here..." className="c-input" style={{ resize: "vertical" }} value={form.message} onChange={handleFormChange} required />
            </div>

            {/* Success / Error messages */}
            {formStatus.success && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#e6f7ef", border: "1px solid #0e7c4a", borderRadius: 8, color: "#0e7c4a", fontWeight: 600, fontSize: 14 }}>
                ✅ {formStatus.success}
              </div>
            )}
            {formStatus.error && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, color: "#c0392b", fontWeight: 600, fontSize: 14 }}>
                ❌ {formStatus.error}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus.loading}
              style={{ marginTop: 24, width: "100%", padding: "13px", background: formStatus.loading ? "#aab" : "linear-gradient(135deg,#1a3c8f,#2d6cdf)", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: formStatus.loading ? "not-allowed" : "pointer", transition: "opacity 0.2s, transform 0.2s" }}
              onMouseOver={e => { if (!formStatus.loading) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
              onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >{formStatus.loading ? "Sending..." : "Send Message"}</button>
          </form>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: "#080f2e" }}>
        {/* Top grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#fff,#c8d8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#1a3c8f", flexShrink: 0 }}>KD</div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 15 }}>K.D Public Inter College</div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.8 }}>
              Shaping the future of students through quality education, strong values and academic excellence since 2010.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {["📘","📸","🐦","▶️"].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18, letterSpacing: 0.5 }}>Quick Links</div>
            <button onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })} className="flink" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>Home</button>
            <button onClick={() => scrollTo(aboutRef)} className="flink" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>About Us</button>
            <Link to="/gallery" className="flink">Gallery</Link>
            <button onClick={() => scrollTo(contactRef)} className="flink" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>Contact</button>
          </div>

          {/* Academics */}
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18, letterSpacing: 0.5 }}>Academics</div>
            {["Class 9th & 10th","Class 11th & 12th","Science Stream","Commerce Stream","Arts Stream"].map(l => (
              <div key={l} className="flink">{l}</div>
            ))}
          </div>

          {/* Contact Info */}
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18, letterSpacing: 0.5 }}>Contact Info</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 2 }}>
              <div>📍 K.D Public Inter College,</div>
              <div style={{ paddingLeft: 22 }}>Ayodhya, Uttar Pradesh</div>
              <div style={{ marginTop: 4 }}>📞 +91 6386606277</div>
              <div style={{ marginTop: 4 }}>✉️ ritesh224172@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 1100, margin: "0 auto" }} />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            © 2026 K.D Public Inter College. All Rights Reserved.
          </div>
          <div className="footer-links-row">
            {["© created by Ritesh Sharma ....."].map(l => (
              <span key={l} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer" }}
                onMouseOver={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* ══════════ LOGIN MODAL ══════════ */}
      {loginOpen && <Login onClose={() => setLoginOpen(false)} />}
    </div>
  );
}

export default Home;
