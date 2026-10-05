import React from 'react';
import { Sparkles, Compass, Play, Crown, User, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenProfile,
  onOpenSubscription
}) {
  const { user, isSubscribed, isAdmin, isBackendOnline } = useAuth();

  return (
    <header className="top-bar">
      <div className="top-bar-inner">
        {/* Zone 1: Brand Wordmark (Single text element with logo emblem) */}
        <div
          className="brand-zone"
          onClick={() => setActiveTab('home')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-symbol">
            <Compass size={20} strokeWidth={2.2} />
          </div>
          <span className="brand-logo-text">
            Astro<span>Ai</span>
          </span>
        </div>

        {/* Zone 2: Clean text navigation links (Single line, 4-6 links) */}
        <nav className="nav-zone">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <Sparkles size={14} />
            AI Astro Chat
          </button>
          <button
            className={`nav-link ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            <Play size={14} />
            Short Videos
          </button>
          <button
            className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => onOpenSubscription()}
          >
            <Crown size={14} />
            Premium <span className="badge-pricing">₹299</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="actions-zone">
          {/* Live backend status marker */}
          <div
            className="backend-indicator"
            title={isBackendOnline ? 'Connected to live Render backend' : 'Running in offline / local fallback mode'}
          >
            <span className={`backend-dot ${!isBackendOnline ? 'offline' : ''}`}></span>
            <span>{isBackendOnline ? 'Live API' : 'Local Mode'}</span>
          </div>

          {user ? (
            <div
              className="user-pill"
              onClick={onOpenProfile}
              role="button"
              tabIndex={0}
            >
              <img
                src={user.profileImage || '/src/assets/images/astro_ai_avatar_1791176888518.jpg'}
                alt={user.name}
                className="user-avatar-img"
                referrerPolicy="no-referrer"
              />
              <span className="user-pill-name">{user.name.split(' ')[0]}</span>
              {isSubscribed ? (
                <span className="premium-badge-tag">VIP</span>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Free</span>
              )}
            </div>
          ) : (
            <button className="btn btn-primary-gold btn-sm" onClick={onOpenAuth}>
              <LogIn size={14} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
