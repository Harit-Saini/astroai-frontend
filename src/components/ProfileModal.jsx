import React, { useState } from 'react';
import { X, User, Calendar, Clock, MapPin, Globe, Phone, Mail, Shield, Crown, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose, onOpenSubscription }) {
  const { user, isSubscribed, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '1998-07-14',
    birthTime: user?.birthTime || '09:45 AM',
    birthPlace: user?.birthPlace || 'Varanasi, Uttar Pradesh',
    gender: user?.gender || 'Male',
    preferredLanguage: user?.preferredLanguage || 'Hinglish (Hindi + English)',
    rashi: user?.rashi || 'Karka (Cancer)'
  });

  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} style={{ color: 'var(--gold-primary)' }} />
            <span className="modal-title">My Astro Profile & Kundli</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Subscription Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '10px',
            background: isSubscribed ? 'rgba(223, 168, 86, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isSubscribed ? 'var(--border-gold)' : 'var(--border-subtle)'}`,
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Crown size={16} style={{ color: isSubscribed ? 'var(--gold-primary)' : 'var(--text-muted)' }} />
              <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
                Status: {isSubscribed ? 'VIP Active (₹299)' : 'Free Tier'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isSubscribed && user.subscriptionExpiry
                ? `Expires on ${new Date(user.subscriptionExpiry).toLocaleDateString()}`
                : 'Limited to 5 free daily questions'}
            </div>
          </div>
          {!isSubscribed && (
            <button
              className="btn btn-primary-gold btn-sm"
              onClick={() => {
                onClose();
                onOpenSubscription();
              }}
            >
              Upgrade ₹299
            </button>
          )}
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="admin-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="admin-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="admin-form-group">
              <label>Date of Birth (DOB)</label>
              <input
                type="date"
                name="dob"
                className="admin-input"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Time of Birth</label>
              <input
                type="text"
                name="birthTime"
                className="admin-input"
                value={formData.birthTime}
                onChange={handleChange}
                placeholder="e.g. 09:45 AM"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Place of Birth (City & State)</label>
            <input
              type="text"
              name="birthPlace"
              className="admin-input"
              value={formData.birthPlace}
              onChange={handleChange}
              placeholder="e.g. Varanasi, Uttar Pradesh"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="admin-form-group">
              <label>Gender</label>
              <select name="gender" className="admin-select" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Preferred Language</label>
              <select
                name="preferredLanguage"
                className="admin-select"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="Hinglish (Hindi + English)">Hinglish</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Moon Sign / Rashi (Zodiac)</label>
            <select name="rashi" className="admin-select" value={formData.rashi} onChange={handleChange}>
              <option value="Mesh (Aries)">Mesh (Aries)</option>
              <option value="Vrishabha (Taurus)">Vrishabha (Taurus)</option>
              <option value="Mithuna (Gemini)">Mithuna (Gemini)</option>
              <option value="Karka (Cancer)">Karka (Cancer)</option>
              <option value="Simha (Leo)">Simha (Leo)</option>
              <option value="Kanya (Virgo)">Kanya (Virgo)</option>
              <option value="Tula (Libra)">Tula (Libra)</option>
              <option value="Vrishchika (Scorpio)">Vrishchika (Scorpio)</option>
              <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
              <option value="Makara (Capricorn)">Makara (Capricorn)</option>
              <option value="Kumbha (Aquarius)">Kumbha (Aquarius)</option>
              <option value="Meena (Pisces)">Meena (Pisces)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary-gold" style={{ flex: 1 }}>
              {isSaved ? (
                <>
                  <Check size={16} /> Saved Successfully
                </>
              ) : (
                'Save Kundli Details'
              )}
            </button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
