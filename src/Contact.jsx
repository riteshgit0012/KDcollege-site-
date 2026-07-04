import React, { useState } from "react";

const API_URL = "http://localhost:5001/api/contact";

function Contact() {
  const [form, setForm]     = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res  = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f8ff", minHeight: "100vh", paddingTop: 80 }}>
      <style>{`
        .c-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #dde3f0;
          border-radius: 9px; font-size: 14px; outline: none;
          transition: border 0.2s; font-family: inherit; box-sizing: border-box;
        }
        .c-input:focus { border-color: #1a3c8f; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 36px" }}>
        <span style={{ background: "#e8efff", color: "#1a3c8f", fontWeight: 700, fontSize: 13, padding: "5px 16px", borderRadius: 20, letterSpacing: 1 }}>
          GET IN TOUCH
        </span>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0d1f5c", margin: "14px 0 10px" }}>
          Contact Us
        </h1>
        <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#1a3c8f,#2d6cdf)", borderRadius: 2, margin: "0 auto 14px" }} />
        <p style={{ color: "#666", fontSize: 15 }}>Have a question? We'd love to hear from you.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* MAP */}
        <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(26,60,143,0.14)", marginBottom: 32 }}>
          <iframe
            title="College Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dYOUR_EMBED_LINK_HERE"
            width="100%" height="400"
            style={{ border: 0, display: "block" }}
            allowFullScreen="" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: "📍", label: "Address",  val: "Your College Address, City, UP" },
            { icon: "📞", label: "Phone",    val: "+91 XXXXX XXXXX" },
            { icon: "✉️", label: "Email",    val: "kdcollege@example.com" },
            { icon: "🕐", label: "Timings",  val: "Mon–Sat: 8:00 AM – 4:00 PM" },
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

        {/* Contact form */}
        <div style={{ background: "white", borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(26,60,143,0.10)", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0d1f5c", marginBottom: 28 }}>Send a Message</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Your Name *</label>
                <input
                  type="text" name="name" placeholder="Full name"
                  className="c-input" value={form.name} onChange={handleChange} required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Phone Number *</label>
                <input
                  type="tel" name="phone" placeholder="10-digit mobile number"
                  className="c-input" value={form.phone} onChange={handleChange} required
                />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Email Address *</label>
              <input
                type="email" name="email" placeholder="your@email.com"
                className="c-input" value={form.email} onChange={handleChange} required
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Message *</label>
              <textarea
                rows={4} name="message" placeholder="Write your message here..."
                className="c-input" style={{ resize: "vertical" }}
                value={form.message} onChange={handleChange} required
              />
            </div>

            {status === "success" && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#e8f5e9", color: "#2e7d32", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#ffebee", color: "#c62828", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{ marginTop: 24, width: "100%", padding: "13px", background: status === "sending" ? "#a0b4d8" : "linear-gradient(135deg,#1a3c8f,#2d6cdf)", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: status === "sending" ? "not-allowed" : "pointer", transition: "opacity 0.2s, transform 0.2s" }}
              onMouseOver={e => { if (status !== "sending") { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
