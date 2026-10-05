import React from 'react';
import { MessageSquare, UserCheck, Film, Crown, ArrowRight } from 'lucide-react';

export default function FeaturesSection({ onStartChat, onOpenReels, onOpenPricing }) {
  const features = [
    {
      title: 'AI Astrology Chat',
      desc: 'Ask direct questions in Hindi, English, or Hinglish about your career, marriage timing, and financial prospects with instant astrological synthesis.',
      icon: MessageSquare,
      action: onStartChat,
      btnLabel: 'Consult AI'
    },
    {
      title: 'Personalized Guidance',
      desc: 'Deep Kundli birth chart analysis based on your exact Date, Time, and City of Birth, with transit calculations and planetary gemstone recommendations.',
      icon: UserCheck,
      action: onStartChat,
      btnLabel: 'View Birth Chart'
    },
    {
      title: 'Short Astrology Videos',
      desc: 'Curated vertical reels on Shani Sade Sati, Kundli Milan secrets, Vastu remedies, and daily zodiac planetary transits uploaded by Vedic experts.',
      icon: Film,
      action: onOpenReels,
      btnLabel: 'Watch Shorts'
    },
    {
      title: 'Premium VIP Access (₹299)',
      desc: 'Unlock unlimited in-depth consultations, detailed D9 & D10 divisional charts, personalized Vedic remedies, and ad-free experience.',
      icon: Crown,
      action: onOpenPricing,
      btnLabel: 'Join for ₹299'
    }
  ];

  return (
    <section style={{ margin: '60px 0' }}>
      <div className="section-header">
        <span className="section-kicker">Divine Capabilities</span>
        <h2 className="section-title">Sacred Wisdom Powered by Artificial Intelligence</h2>
        <p className="section-subtitle">
          Everything you need to navigate life\'s crucial decisions with the clarity of planetary science.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="feature-card">
              <div className="feature-icon-box">
                <Icon size={22} />
              </div>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.desc}</p>
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                  onClick={f.action}
                >
                  <span>{f.btnLabel}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
