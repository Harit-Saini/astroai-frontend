import React from 'react';
import { Sparkles, Play, ShieldCheck, Heart, Moon, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero({ onStartChat, onOpenReels, onOpenPricing }) {
  const { user } = useAuth();

  return (
    <section className="hero-section">
      {/* Left Column: Proposition and Core Action */}
      <div className="hero-left">
        <span className="hero-kicker">Divine Vedic Astrology Reimagined</span>
        <h1 className="hero-title">
          Talk to Your <span className="gold-gradient-text">AI Astro</span> Guide
        </h1>
        <p className="hero-description">
          Receive precise Vedic birth chart readings, Graha Dasha timelines, marriage compatibility (Kundli Milan), career forecasting, and sacred gemstone remedies tailored to your exact planetary positions.
        </p>

        <div className="hero-ctas">
          <button className="btn btn-primary-gold btn-lg" onClick={onStartChat}>
            <Sparkles size={18} />
            Start AI Chat
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onOpenReels}>
            <Play size={18} />
            Watch Short Videos
          </button>
          <button className="btn btn-outline-gold btn-lg" onClick={onOpenPricing}>
            Premium ₹299
          </button>
        </div>

        {/* Quantitative Proof Adjacency */}
        <div className="hero-proof-strip">
          <div className="hero-stat-item">
            <span className="hero-stat-val tabular-nums">120K+</span>
            <span className="hero-stat-label">Kundlis Analyzed</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-val tabular-nums">99.4%</span>
            <span className="hero-stat-label">Vedic Accuracy</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-val tabular-nums">₹299</span>
            <span className="hero-stat-label">Per Month VIP</span>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Focal Anchor */}
      <div className="hero-right">
        <div className="hero-visual-card">
          <img
            src="/src/assets/images/hero_celestial_zodiac_1791176875369.jpg"
            alt="Celestial Zodiac Wheel and Cosmic Constellations"
            className="hero-visual-img"
            referrerPolicy="no-referrer"
          />
          <div className="hero-visual-overlay">
            <div className="hero-card-meta">
              <img
                src="/src/assets/images/astro_ai_avatar_1791176888518.jpg"
                alt="AI Astrologer Avatar"
                className="hero-card-avatar"
                referrerPolicy="no-referrer"
              />
              <div className="hero-card-text">
                <div className="hero-card-name">AstroAi Panditji</div>
                <div className="hero-card-sub">Active Vedic Astrologer & Kundli Analyst</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
