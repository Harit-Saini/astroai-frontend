import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Film,
  Crown,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Unlock,
  Upload,
  RefreshCw,
  LogOut,
  Save,
  Check,
  EyeOff,
  KeyRound,
  ArrowLeft,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApi, videoApi } from '../services/api';
import { INITIAL_VIDEOS, ASTRO_CATEGORIES, INITIAL_AI_SETTINGS } from '../data/astroData';

export default function AdminDashboard({ onBackToHome }) {
  const { isAdmin, adminLogin, setIsAdmin } = useAuth();

  // Login and recovery form state if not logged in as admin
  const [adminAuthMode, setAdminAuthMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminResetToken, setAdminResetToken] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);

  const [loginError, setLoginError] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'videos', 'subscriptions', 'ai-settings'

  // Admin data states
  const [stats, setStats] = useState({
    totalUsers: 1420,
    activeSubscribers: 382,
    expiredSubscribers: 89,
    totalPayments: 471,
    totalRevenue: 140829, // 471 * 299
    totalVideos: 5,
    videoViews: 108740
  });

  const [usersList, setUsersList] = useState([
    {
      _id: 'usr-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      regDate: '2026-02-14',
      status: 'active',
      expiry: '2026-04-30',
      isBlocked: false,
      lastLogin: 'Today, 10:20 AM'
    },
    {
      _id: 'usr-2',
      name: 'Pooja Verma',
      email: 'pooja.verma.astro@gmail.com',
      regDate: '2026-02-28',
      status: 'active',
      expiry: '2026-04-20',
      isBlocked: false,
      lastLogin: 'Yesterday, 04:15 PM'
    },
    {
      _id: 'usr-3',
      name: 'Rohan Gupta',
      email: 'rohan.gupta99@gmail.com',
      regDate: '2026-01-10',
      status: 'expired',
      expiry: '2026-02-10',
      isBlocked: false,
      lastLogin: '3 days ago'
    },
    {
      _id: 'usr-4',
      name: 'Sneha Patel',
      email: 'sneha.patel@outlook.com',
      regDate: '2026-03-01',
      status: 'free',
      expiry: 'N/A',
      isBlocked: false,
      lastLogin: 'Today, 08:45 AM'
    },
    {
      _id: 'usr-5',
      name: 'Karan Mehra',
      email: 'karan.mehra@gmail.com',
      regDate: '2026-01-15',
      status: 'free',
      expiry: 'N/A',
      isBlocked: true,
      lastLogin: '1 week ago'
    }
  ]);

  const [videosList, setVideosList] = useState(INITIAL_VIDEOS);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: 'Kundli & Dasha',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-milky-way-41617-large.mp4',
    thumbnail: '/src/assets/images/reels_astrology_cover_1791176913592.jpg',
    tags: 'Kundli, Vedic, Astrology',
    isPremium: false,
    status: 'published'
  });

  const [aiSettings, setAiSettings] = useState(INITIAL_AI_SETTINGS);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  // Fetch admin dashboard from backend if available
  useEffect(() => {
    if (isAdmin) {
      const loadAdminData = async () => {
        try {
          const res = await adminApi.getDashboard();
          if (res.success && res.data) {
            setStats((prev) => ({ ...prev, ...res.data }));
          }
        } catch (e) {
          console.warn('Admin offline fallback active');
        }
      };
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setAdminSuccessMsg('');
    setIsLoggingIn(true);

    try {
      if (adminAuthMode === 'login') {
        const res = await adminLogin(adminEmail, adminPassword);
        if (!res.success) {
          setLoginError(res.error || 'Invalid admin credentials');
        }
      } else if (adminAuthMode === 'forgot') {
        const res = await adminApi.adminForgotPassword(adminEmail);
        setAdminSuccessMsg('Admin recovery token sent! You can enter your reset token below.');
        if (!adminResetToken) {
          setAdminResetToken('adm_token_' + Math.random().toString(36).substring(4));
        }
      } else if (adminAuthMode === 'reset') {
        if (adminNewPassword !== adminConfirmPassword) {
          setLoginError('Passwords do not match');
          setIsLoggingIn(false);
          return;
        }
        if (adminNewPassword.length < 6) {
          setLoginError('Password must be at least 6 characters long');
          setIsLoggingIn(false);
          return;
        }
        const tokenToUse = adminResetToken.trim() || 'adm_demo_token';
        await adminApi.adminResetPassword(tokenToUse, adminNewPassword);
        setAdminSuccessMsg('Admin password updated successfully! Please sign in with your new password.');
        setTimeout(() => {
          setAdminAuthMode('login');
          setAdminPassword('');
        }, 1600);
      }
    } catch (err) {
      setLoginError(err.message || 'Operation failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleToggleBlock = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    const created = {
      _id: 'vid-' + Date.now(),
      title: newVideo.title,
      description: newVideo.description,
      category: newVideo.category,
      videoUrl: newVideo.videoUrl,
      thumbnail: newVideo.thumbnail,
      tags: newVideo.tags.split(',').map((t) => t.trim()),
      isPremium: newVideo.isPremium,
      status: newVideo.status,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    setVideosList([created, ...videosList]);
    setStats((prev) => ({ ...prev, totalVideos: prev.totalVideos + 1 }));
    setShowAddVideoModal(false);
    setNewVideo({
      title: '',
      description: '',
      category: 'Kundli & Dasha',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-milky-way-41617-large.mp4',
      thumbnail: '/src/assets/images/reels_astrology_cover_1791176913592.jpg',
      tags: 'Kundli, Vedic, Astrology',
      isPremium: false,
      status: 'published'
    });
  };

  const handleDeleteVideo = (vidId) => {
    setVideosList((prev) => prev.filter((v) => v._id !== vidId));
    setStats((prev) => ({ ...prev, totalVideos: prev.totalVideos - 1 }));
  };

  const handleTogglePublish = (vidId) => {
    setVideosList((prev) =>
      prev.map((v) =>
        v._id === vidId
          ? { ...v, status: v.status === 'published' ? 'unpublished' : 'published' }
          : v
      )
    );
  };

  const handleSaveAiSettings = (e) => {
    e.preventDefault();
    setIsSavedSettings(true);
    setTimeout(() => setIsSavedSettings(false), 2000);
  };

  // If not logged in as Admin, show Admin Login View
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
        <div className="modal-card" style={{ maxWidth: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(223, 168, 86, 0.15)',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                border: '1px solid var(--border-gold)'
              }}
            >
              <Shield size={26} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>
              {adminAuthMode === 'login' && 'AstroAi Admin Portal'}
              {adminAuthMode === 'forgot' && 'Reset Admin Password'}
              {adminAuthMode === 'reset' && 'Set New Admin Password'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {adminAuthMode === 'login' && 'Sign in with administrative credentials to access centralized controls.'}
              {adminAuthMode === 'forgot' && 'Enter your registered administrator email to receive recovery instructions.'}
              {adminAuthMode === 'reset' && 'Enter your verification token and specify a strong new administrator password.'}
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '14px'
              }}
            >
              {loginError}
            </div>
          )}

          {adminSuccessMsg && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{adminSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit}>
            {/* Email input for login and forgot modes */}
            {adminAuthMode !== 'reset' && (
              <div className="admin-form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="Enter administrator email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Token input for reset mode */}
            {adminAuthMode === 'reset' && (
              <div className="admin-form-group">
                <label>Admin Reset Token</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Paste admin reset token"
                  value={adminResetToken}
                  onChange={(e) => setAdminResetToken(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Password input with seen eye icon for login mode */}
            {adminAuthMode === 'login' && (
              <div className="admin-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Admin Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setAdminSuccessMsg('');
                      setAdminAuthMode('forgot');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-primary)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    className="admin-input"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password inputs with seen eye icons for reset mode */}
            {adminAuthMode === 'reset' && (
              <>
                <div className="admin-form-group">
                  <label>New Admin Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      className="admin-input"
                      placeholder="At least 6 characters"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showAdminConfirmPassword ? 'text' : 'password'}
                      className="admin-input"
                      placeholder="Repeat new password"
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                      aria-label={showAdminConfirmPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showAdminConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary-gold btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={16} className="spin-animation" />
                  Please wait...
                </>
              ) : adminAuthMode === 'login' ? (
                <>
                  <Shield size={16} /> Sign In to Admin Portal
                </>
              ) : adminAuthMode === 'forgot' ? (
                <>
                  <Mail size={16} /> Send Reset Link
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Update Admin Password
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
            {adminAuthMode === 'forgot' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setAdminSuccessMsg('');
                    setAdminAuthMode('reset');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Have a Reset Token?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setAdminSuccessMsg('');
                    setAdminAuthMode('login');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {adminAuthMode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  setAdminSuccessMsg('');
                  setAdminAuthMode('login');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Back to Sign In
              </button>
            )}

            {adminAuthMode === 'login' && (
              <button
                type="button"
                onClick={onBackToHome}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}
              >
                ← Back to AstroAi Home
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin Authenticated View
  return (
    <div className="admin-container">
      {/* Top Header */}
      <div className="admin-header">
        <div>
          <span style={{ fontSize: '12px', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Central Control Room
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 700 }}>AstroAi Master Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBackToHome}>
            View Website
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setIsAdmin(false)}>
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      </div>

      {/* Metrics Row (SOP Page 9) */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-number tabular-nums">{stats.totalUsers.toLocaleString()}</span>
          <span className="stat-trend">+14% this month</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active VIP Subscribers</span>
          <span className="stat-number tabular-nums" style={{ color: 'var(--gold-light)' }}>
            {stats.activeSubscribers}
          </span>
          <span className="stat-trend">₹299/mo Plan</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-number tabular-nums" style={{ color: '#34d399' }}>
            ₹{stats.totalRevenue.toLocaleString()}
          </span>
          <span className="stat-trend">Razorpay Gateway</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Video Views</span>
          <span className="stat-number tabular-nums">{stats.videoViews.toLocaleString()}</span>
          <span className="stat-trend">{stats.totalVideos} Published Shorts</span>
        </div>
      </div>

      {/* Navigation Tabs (SOP Page 9-10) */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Recent
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
          User Management ({usersList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <Film size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Short Videos ({videosList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <Crown size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Subscriptions & Payments
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'ai-settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-settings')}
        >
          <Settings size={14} style={{ display: 'inline', marginRight: '6px' }} />
          AI Astro Settings
        </button>
      </div>

      {/* TAB 1: Overview & Recent Transactions */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>
              Recent VIP Subscriptions
            </h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { user: 'Aarav Sharma', plan: 'Premium ₹299', amount: '₹299', status: 'active', date: 'Today, 10:14 AM' },
                    { user: 'Pooja Verma', plan: 'Premium ₹299', amount: '₹299', status: 'active', date: 'Yesterday' },
                    { user: 'Rohan Gupta', plan: 'Premium ₹299', amount: '₹299', status: 'expired', date: '12 Mar 2026' }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.user}</td>
                      <td>{row.plan}</td>
                      <td className="tabular-nums" style={{ color: 'var(--gold-light)' }}>{row.amount}</td>
                      <td>
                        <span className={`status-tag ${row.status}`}>{row.status}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>
              Top Performing Astrology Shorts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {videosList.slice(0, 3).map((v) => (
                <div key={v._id} className="stat-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.title}
                    </span>
                    <span className="status-tag active">{v.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Views: {v.views.toLocaleString()}</span>
                    <span>Likes: {v.likes}</span>
                    <span>Category: {v.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: User Management (SOP Page 10) */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Registered Astrological Users</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Showing {usersList.length} accounts</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Registered</th>
                  <th>Subscription</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.regDate}</td>
                    <td>
                      <span className={`status-tag ${u.status}`}>{u.status.toUpperCase()}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.expiry}</td>
                    <td>
                      {u.isBlocked ? (
                        <span className="status-tag blocked">BLOCKED</span>
                      ) : (
                        <span style={{ color: '#10b981', fontSize: '12px' }}>Normal</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.isBlocked ? 'btn-primary-gold' : 'btn-danger'}`}
                        onClick={() => handleToggleBlock(u._id)}
                      >
                        {u.isBlocked ? (
                          <>
                            <Unlock size={12} /> Unblock
                          </>
                        ) : (
                          <>
                            <Lock size={12} /> Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Short Videos Management (SOP Page 8 & 16) */}
      {activeTab === 'videos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Astrology Reels & Shorts Catalogue</h3>
            <button className="btn btn-primary-gold btn-sm" onClick={() => setShowAddVideoModal(true)}>
              <Plus size={16} /> Add New Video
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Metrics</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videosList.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{v.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.description}
                      </div>
                    </td>
                    <td>{v.category}</td>
                    <td>
                      <div style={{ fontSize: '12.5px' }}>{v.views} views</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.likes} likes</div>
                    </td>
                    <td>
                      {v.isPremium ? (
                        <span className="premium-badge-tag">VIP</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Free</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-tag ${v.status === 'published' ? 'active' : 'expired'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleTogglePublish(v._id)}
                          title="Toggle publish"
                        >
                          {v.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteVideo(v._id)}
                          title="Delete Video"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Video Modal */}
          {showAddVideoModal && (
            <div className="modal-backdrop" onClick={() => setShowAddVideoModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                <div className="modal-header">
                  <span className="modal-title">Upload New Astrology Short</span>
                  <button className="modal-close-btn" onClick={() => setShowAddVideoModal(false)}>
                    ×
                  </button>
                </div>
                <form onSubmit={handleAddVideo}>
                  <div className="admin-form-group">
                    <label>Video Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Rahu Ketu Transit Impact 2026"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      placeholder="Summary of astrological insight..."
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="admin-form-group">
                      <label>Category</label>
                      <select
                        className="admin-select"
                        value={newVideo.category}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      >
                        {ASTRO_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Access Tier</label>
                      <select
                        className="admin-select"
                        value={newVideo.isPremium ? 'vip' : 'free'}
                        onChange={(e) => setNewVideo({ ...newVideo, isPremium: e.target.value === 'vip' })}
                      >
                        <option value="free">Free Access</option>
                        <option value="vip">VIP Only (₹299)</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Video URL (.mp4 / stream)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Thumbnail URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newVideo.thumbnail}
                      onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Tags (Comma separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newVideo.tags}
                      onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary-gold btn-lg" style={{ width: '100%', marginTop: '16px' }}>
                    <Upload size={16} /> Publish Astrology Reel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Subscriptions & Payment Records (SOP Page 11) */}
      {activeTab === 'subscriptions' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Subscription & Payment Records (₹299 Plan)
          </h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Aarav Sharma', email: 'aarav.sharma@example.com', plan: 'Premium', amount: '₹299', pid: 'PAY_9912A8', start: '01 Mar 2026', expiry: '31 Mar 2026', status: 'active' },
                  { user: 'Pooja Verma', email: 'pooja.verma.astro@gmail.com', plan: 'Premium', amount: '₹299', pid: 'PAY_7731B2', start: '28 Feb 2026', expiry: '30 Mar 2026', status: 'active' },
                  { user: 'Rohan Gupta', email: 'rohan.gupta99@gmail.com', plan: 'Premium', amount: '₹299', pid: 'PAY_5541C9', start: '10 Jan 2026', expiry: '10 Feb 2026', status: 'expired' }
                ].map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{s.user}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                    <td>{s.plan}</td>
                    <td className="tabular-nums" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                      {s.amount}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.pid}</td>
                    <td>{s.start}</td>
                    <td>{s.expiry}</td>
                    <td>
                      <span className={`status-tag ${s.status}`}>{s.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI Astro Admin Settings (SOP Page 11) */}
      {activeTab === 'ai-settings' && (
        <div style={{ maxWidth: '680px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            AI Astro Model Configuration & Guardrails
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Configure persona, guidelines, welcome messages, and prompt instructions for the AI Astro consultation engine.
          </p>

          <form onSubmit={handleSaveAiSettings}>
            <div className="admin-form-group">
              <label>AI Astrologer Name</label>
              <input
                type="text"
                className="admin-input"
                value={aiSettings.aiName}
                onChange={(e) => setAiSettings({ ...aiSettings, aiName: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Welcome Message</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={aiSettings.welcomeMessage}
                onChange={(e) => setAiSettings({ ...aiSettings, welcomeMessage: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>AI System Instructions</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={aiSettings.systemInstructions}
                onChange={(e) => setAiSettings({ ...aiSettings, systemInstructions: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Astrology Guidelines & Ethics</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={aiSettings.astrologyGuidelines}
                onChange={(e) => setAiSettings({ ...aiSettings, astrologyGuidelines: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="admin-form-group">
                <label>Free User Daily Limit</label>
                <input
                  type="number"
                  className="admin-input"
                  value={aiSettings.freeUserLimit}
                  onChange={(e) => setAiSettings({ ...aiSettings, freeUserLimit: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="admin-form-group">
                <label>Response Language Mode</label>
                <input
                  type="text"
                  className="admin-input"
                  value={aiSettings.responseLanguage}
                  onChange={(e) => setAiSettings({ ...aiSettings, responseLanguage: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Premium VIP Prompt Hook</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={aiSettings.premiumPrompt}
                onChange={(e) => setAiSettings({ ...aiSettings, premiumPrompt: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary-gold btn-lg" style={{ marginTop: '16px' }}>
              {isSavedSettings ? (
                <>
                  <Check size={16} /> Settings Saved
                </>
              ) : (
                <>
                  <Save size={16} /> Save AI Configuration
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
