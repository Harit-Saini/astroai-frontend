import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate, onOpenLegal, onOpenSubscription }) {
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        {/* Col 1: Brand & Wordmark */}
        <div className="footer-col">
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
            onClick={() => onNavigate('home')}
          >
            <div className="brand-symbol">
              <Compass size={18} />
            </div>
            <span className="brand-logo-text" style={{ fontSize: '20px' }}>
              Astro<span>Ai</span>
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '320px', color: 'var(--text-secondary)' }}>
            India\'s modern AI-powered Vedic astrology platform. Combining centuries of sacred Parashari knowledge with intelligent real-time conversational clarity.
          </p>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>Encrypted Kundli Privacy & SSL Secured</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer-col">
          <h4>Exploration</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('home')}>Home</button></li>
            <li><button onClick={() => onNavigate('chat')}>AI Astro Chat</button></li>
            <li><button onClick={() => onNavigate('reels')}>Short Videos & Reels</button></li>
            <li><button onClick={onOpenSubscription}>Premium VIP (₹299)</button></li>
            <li><button onClick={() => onNavigate('admin')}>Admin Portal</button></li>
          </ul>
        </div>

        {/* Col 3: Legal & Compliance (SOP Page 13 & 19) */}
        <div className="footer-col">
          <h4>Legal & Trust</h4>
          <ul className="footer-links">
            <li><button onClick={() => onOpenLegal('disclaimer')}>AI & Astrology Disclaimer</button></li>
            <li><button onClick={() => onOpenLegal('privacy')}>Privacy Policy</button></li>
            <li><button onClick={() => onOpenLegal('terms')}>Terms & Conditions</button></li>
            <li><button onClick={() => onOpenLegal('refund')}>Refund & Cancellation Policy</button></li>
            <li><button onClick={() => onOpenLegal('contact')}>Contact Us</button></li>
          </ul>
        </div>

        {/* Col 4: Kundli Topics */}
        <div className="footer-col">
          <h4>Vedic Astrological Domains</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('chat')}>Career & Wealth Dasha</button></li>
            <li><button onClick={() => onNavigate('chat')}>Kundli Milan for Vivah</button></li>
            <li><button onClick={() => onNavigate('chat')}>Shani Sade Sati Remedies</button></li>
            <li><button onClick={() => onNavigate('chat')}>Gemstones & Yantras</button></li>
            <li><button onClick={() => onNavigate('chat')}>Navamsha (D9) Chart</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} AstroAi Technologies. All rights reserved.
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Astrology predictions are for personal guidance and spiritual insight only.
        </div>
      </div>
    </footer>
  );
}
