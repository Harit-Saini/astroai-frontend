import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Eye,
  Crown,
  Lock,
  Sparkles
} from 'lucide-react';
import { videoApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReelPlayer({ videos, initialIndex = 0, onOpenPricing }) {
  const { isSubscribed } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [likesCountMap, setLikesCountMap] = useState({});
  const [showShareToast, setShowShareToast] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = videos[currentIndex] || videos[0];

  // Initialize likes count from video list
  useEffect(() => {
    const initialLikes = {};
    videos.forEach((v) => {
      initialLikes[v._id] = v.likes || 1200;
    });
    setLikesCountMap(initialLikes);
  }, [videos]);

  // When current video changes, reset play state and record view
  useEffect(() => {
    if (currentVideo?._id) {
      videoApi.recordView(currentVideo._id).catch(() => {});
    }
    setIsPlaying(true);
  }, [currentIndex, currentVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(videos.length - 1);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const vidId = currentVideo._id;
    const isLiked = !!likedMap[vidId];

    setLikedMap((prev) => ({ ...prev, [vidId]: !isLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [vidId]: (prev[vidId] || 0) + (isLiked ? -1 : 1)
    }));
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2200);
  };

  // Keyboard navigation (Arrow keys up/down)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex]);

  const isLocked = currentVideo?.isPremium && !isSubscribed;

  return (
    <div className="reels-player-wrapper">
      {/* Navigation Buttons for desktop */}
      <button className="reel-nav-btn" onClick={handlePrev} title="Previous Video">
        <ChevronUp size={24} />
      </button>

      {/* Main 9:16 Vertical Reel Player */}
      <div className="reel-card" onClick={togglePlay}>
        {/* Actual Video or Fallback Thumbnail */}
        {isLocked ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#0a0d1a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(223, 168, 86, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-primary)'
              }}
            >
              <Lock size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Exclusive VIP Astrology Video</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              This deep Kundli video requires an active AstroAi Premium Subscription (₹299/mo).
            </p>
            <button
              className="btn btn-primary-gold btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPricing();
              }}
            >
              <Crown size={14} />
              Unlock Premium ₹299
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            poster={currentVideo.thumbnail}
            className="reel-video-element"
            loop
            autoPlay
            muted={isMuted}
            playsInline
          />
        )}

        {/* Overlay Play Indicator when paused */}
        {!isPlaying && !isLocked && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              pointerEvents: 'none'
            }}
          >
            <Play size={28} fill="#fff" />
          </div>
        )}

        {/* Video Overlay UI */}
        <div className="reel-overlay">
          {/* Top Bar inside reel */}
          <div className="reel-top-bar">
            <span className="reel-category-pill">{currentVideo.category || 'Astrology'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentVideo.isPremium && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'var(--gold-gradient)',
                    color: '#1a1205',
                    fontWeight: 700
                  }}
                >
                  VIP
                </span>
              )}
              <button
                className="reel-action-btn"
                style={{ width: '34px', height: '34px' }}
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          {/* Right Floating Actions */}
          <div className="reel-side-actions">
            <button
              className={`reel-action-btn ${likedMap[currentVideo._id] ? 'liked' : ''}`}
              onClick={handleLike}
              title="Like"
            >
              <Heart size={20} fill={likedMap[currentVideo._id] ? 'currentColor' : 'none'} />
              <span className="reel-action-count tabular-nums">
                {likesCountMap[currentVideo._id] || currentVideo.likes}
              </span>
            </button>

            <button className="reel-action-btn" onClick={handleShare} title="Share">
              <Share2 size={19} />
              <span className="reel-action-count">Share</span>
            </button>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '11px'
              }}
            >
              <Eye size={17} />
              <span className="tabular-nums" style={{ marginTop: '2px', fontWeight: 600 }}>
                {currentVideo.views > 999
                  ? (currentVideo.views / 1000).toFixed(1) + 'k'
                  : currentVideo.views}
              </span>
            </div>
          </div>

          {/* Bottom Video Metadata */}
          <div className="reel-bottom-info">
            <h4 className="reel-title">{currentVideo.title}</h4>
            <p className="reel-desc">{currentVideo.description}</p>
            {currentVideo.tags && (
              <div className="reel-tags">
                {currentVideo.tags.map((t, idx) => (
                  <span key={idx}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Feedback Toast */}
        {showShareToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              zIndex: 30
            }}
          >
            Video link copied!
          </div>
        )}
      </div>

      {/* Down Navigation Button */}
      <button className="reel-nav-btn" onClick={handleNext} title="Next Video">
        <ChevronDown size={24} />
      </button>
    </div>
  );
}
