import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import ChatModule from './components/ChatModule';
import VideoSection from './components/VideoSection';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SubscriptionModal from './components/SubscriptionModal';
import LegalModal from './components/LegalModal';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const { isSubscribed, user } = useAuth();

  // Active view tab: 'home', 'chat', 'reels', 'admin'
  const [activeTab, setActiveTab] = useState('home');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy', 'terms', 'refund', 'disclaimer', 'contact'

  const handleOpenLegal = (type) => {
    setLegalModalType(type);
  };

  return (
    <div className="app-container">
      {/* Top Bar Navigation (Zone 1: Logo AstroAi, Zone 2: Links, Zone 3: Actions) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />

      <main className="main-content">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onStartChat={() => setActiveTab('chat')}
              onOpenReels={() => setActiveTab('reels')}
              onOpenPricing={() => setIsSubscriptionOpen(true)}
            />

            {/* Features Bento Grid */}
            <FeaturesSection
              onStartChat={() => setActiveTab('chat')}
              onOpenReels={() => setActiveTab('reels')}
              onOpenPricing={() => setIsSubscriptionOpen(true)}
            />

            {/* Short Videos Section on Homepage */}
            <div style={{ margin: '40px 0' }}>
              <VideoSection onOpenPricing={() => setIsSubscriptionOpen(true)} />
            </div>

            {/* Premium CTA Section (SOP Page 12: AI Astro Premium – ₹299) */}
            <section className="pricing-section">
              <div className="pricing-card">
                <div className="pricing-badge">BEST VALUE</div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gold-light)' }}>
                  AstroAi Premium VIP
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Unlimited personalized Vedic guidance, full Kundli charts, and exclusive video wisdom.
                </p>

                <div className="pricing-price-box">
                  <span className="price-currency">₹</span>
                  <span className="price-amount tabular-nums">299</span>
                  <span className="price-period"> / Month</span>
                </div>

                <div className="benefits-list">
                  <div className="benefit-item">
                    <Sparkles size={16} className="benefit-check" />
                    <span>Unlimited AI Astro Chat with Kundli Context</span>
                  </div>
                  <div className="benefit-item">
                    <Sparkles size={16} className="benefit-check" />
                    <span>In-depth Career, Marriage & Wealth Mahadasha Timelines</span>
                  </div>
                  <div className="benefit-item">
                    <Sparkles size={16} className="benefit-check" />
                    <span>Full Access to VIP Astrology Shorts & Exclusive Reels</span>
                  </div>
                  <div className="benefit-item">
                    <Sparkles size={16} className="benefit-check" />
                    <span>Personalized Gemstone, Yantra & Mantra Recommendations</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary-gold btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => setIsSubscriptionOpen(true)}
                >
                  <Crown size={18} />
                  <span>{isSubscribed ? 'Manage VIP Membership' : 'Subscribe Now – ₹299'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: AI ASTRO CHAT */}
        {activeTab === 'chat' && (
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>AI Astro Consultation</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Ask astrology questions with instant chart calculations & Vedic remedies.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('home')}>
                Back to Home
              </button>
            </div>
            <ChatModule
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: SHORT VIDEOS / REELS */}
        {activeTab === 'reels' && (
          <div style={{ padding: '24px 0' }}>
            <VideoSection onOpenPricing={() => setIsSubscriptionOpen(true)} />
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard onBackToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLegal={handleOpenLegal}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <LegalModal
        type={legalModalType}
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
