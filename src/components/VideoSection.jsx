import React, { useState, useEffect } from 'react';
import { Play, Grid, Film, Sparkles, Eye, Heart, Crown } from 'lucide-react';
import { videoApi } from '../services/api';
import { INITIAL_VIDEOS, ASTRO_CATEGORIES } from '../data/astroData';
import ReelPlayer from './ReelPlayer';

export default function VideoSection({ onOpenPricing }) {
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('reel'); // 'reel' or 'grid'
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  // Fetch published videos from API or initial data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await videoApi.getPublishedVideos();
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setVideos(res.data);
        }
      } catch (e) {
        console.warn('Using local curated videos');
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <section className="reels-section">
      <div className="section-header">
        <span className="section-kicker">Divine Visual Insights</span>
        <h2 className="section-title">Vedic Astrology Short Videos & Reels</h2>
        <p className="section-subtitle">
          Watch bite-sized wisdom on planetary movements, Kundli remedies, and daily guidance.
        </p>

        {/* View Mode Toggle */}
        <div style={{ display: 'inline-flex', gap: '8px', marginTop: '16px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn btn-sm ${viewMode === 'reel' ? 'btn-primary-gold' : 'btn-secondary'}`}
            onClick={() => setViewMode('reel')}
          >
            <Film size={14} />
            Reels View
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary-gold' : 'btn-secondary'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={14} />
            Grid View
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="reels-category-tabs">
        {ASTRO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedVideoIndex(0);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Render selected view */}
      {viewMode === 'reel' ? (
        <ReelPlayer
          videos={filteredVideos.length > 0 ? filteredVideos : videos}
          initialIndex={selectedVideoIndex}
          onOpenPricing={onOpenPricing}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '20px'
          }}
        >
          {filteredVideos.map((vid, idx) => (
            <div
              key={vid._id}
              className="feature-card"
              style={{ cursor: 'pointer', padding: '0', overflow: 'hidden' }}
              onClick={() => {
                setSelectedVideoIndex(idx);
                setViewMode('reel');
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '360px' }}>
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="reel-category-pill">{vid.category}</span>
                    {vid.isPremium && (
                      <span className="premium-badge-tag">VIP</span>
                    )}
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                      {vid.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={13} /> {vid.views}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={13} /> {vid.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
