import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

function Gallery() {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/gallery/images")
      .then((r) => r.json())
      .then((uploaded) => {
        setImages(
          uploaded.map((img) => ({
            src: `http://localhost:5001${img.url}`,
            label: img.label,
          }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openLightbox = (i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i - 1 + images.length) % images.length);
  const next = () => setLightbox((i) => (i + 1) % images.length);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  };

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div className="gallery-page">

      <div className="gallery-back-bar">
        <Link to="/" className="gallery-back-btn">← Back to Home</Link>
      </div>

      <div className="gallery-header">
        <span className="gallery-badge">PHOTO GALLERY</span>
        <h1 className="gallery-title">Our Memories</h1>
        <div className="gallery-divider" />
        <p className="gallery-subtitle">
          Glimpses of life at K.D Public Inter College — events, achievements and everyday moments.
        </p>
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#888", padding: "60px 0", fontSize: 16 }}>
          Loading gallery...
        </p>
      )}

      {!loading && images.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa", padding: "60px 0", fontSize: 16 }}>
          Not uploaded any memories , plz upload photo first .
        </p>
      )}

      <div className="gallery-grid">
        {images.map((img, i) => (
          <div
            key={i}
            className="gallery-item"
            style={{ animationDelay: `${i * 0.07}s` }}
            onClick={() => openLightbox(i)}
          >
            <img src={img.src} alt={img.label} loading="lazy" />
            <div className="gallery-item-overlay">
              <span className="gallery-item-label">{img.label}</span>
              <span className="gallery-item-zoom">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox-backdrop" onClick={handleBackdrop}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-arrow lightbox-prev" onClick={prev}>‹</button>
          <div className="lightbox-img-wrap">
            <img src={images[lightbox].src} alt={images[lightbox].label} />
            <div className="lightbox-caption">{images[lightbox].label}</div>
            <div className="lightbox-counter">{lightbox + 1} / {images.length}</div>
          </div>
          <button className="lightbox-arrow lightbox-next" onClick={next}>›</button>
        </div>
      )}

    </div>
  );
}

export default Gallery;
