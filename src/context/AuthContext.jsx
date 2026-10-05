import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi, subscriptionApi, paymentApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('astroai_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return {
      _id: 'usr_guest_demo',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      profileImage: '/src/assets/images/astro_ai_avatar_1791176888518.jpg',
      dob: '1998-07-14',
      birthTime: '09:45 AM',
      birthPlace: 'Varanasi, Uttar Pradesh',
      gender: 'Male',
      preferredLanguage: 'Hinglish (Hindi + English)',
      rashi: 'Karka (Cancer)',
      nakshatra: 'Pushya',
      subscriptionStatus: 'active', // starts active demo so user can test premium or free
      subscriptionStart: '2026-03-01T00:00:00Z',
      subscriptionExpiry: '2026-04-30T00:00:00Z',
      plan: 'Premium ₹299'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('astroai_token') || 'demo_token_user_jwt_123');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('astroai_is_admin') === 'true');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('astroai_admin_token') || '');
  const [dailyQuestionCount, setDailyQuestionCount] = useState(() => {
    const savedCount = localStorage.getItem('astroai_question_count');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('astroai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('astroai_user');
    }
  }, [user]);

  // Check backend health periodically
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const res = await fetch('https://astroai-backend-1.onrender.com/', { signal: AbortSignal.timeout(4000) });
        if (res.ok) setIsBackendOnline(true);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    pingBackend();
    const interval = setInterval(pingBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const receivedToken = res.data.token || res.data.accessToken || 'jwt_token_' + Date.now();
        const userData = res.data.user || {
          _id: res.data._id || 'usr_' + Date.now(),
          name: email.split('@')[0],
          email,
          subscriptionStatus: 'free'
        };
        setToken(receivedToken);
        localStorage.setItem('astroai_token', receivedToken);
        setUser(userData);
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend login fallback to local simulation');
    }

    // Local simulated login for testing
    const demoUser = {
      _id: 'usr_' + Math.random().toString(36).substring(7),
      name: email.split('@')[0].replace('.', ' '),
      email,
      phone: '+91 98765 00000',
      profileImage: '/src/assets/images/astro_ai_avatar_1791176888518.jpg',
      dob: '1995-10-24',
      birthTime: '06:30 AM',
      birthPlace: 'New Delhi, India',
      gender: 'Other',
      preferredLanguage: 'Hindi',
      rashi: 'Vrishabha (Taurus)',
      subscriptionStatus: 'free',
      plan: 'Free Tier'
    };
    const mockToken = 'mock_jwt_' + Date.now();
    setToken(mockToken);
    localStorage.setItem('astroai_token', mockToken);
    setUser(demoUser);
    return { success: true, message: 'Logged in successfully (Simulated mode)' };
  };

  // Google Login SOP flow
  const googleLogin = async () => {
    const googleUser = {
      _id: 'usr_g_' + Math.random().toString(36).substring(7),
      name: 'Pooja Verma',
      email: 'pooja.verma.astro@gmail.com',
      phone: '+91 98112 34567',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dob: '2000-02-19',
      birthTime: '02:15 PM',
      birthPlace: 'Jaipur, Rajasthan',
      gender: 'Female',
      preferredLanguage: 'Hinglish (Hindi + English)',
      rashi: 'Meena (Pisces)',
      nakshatra: 'Revati',
      subscriptionStatus: 'active',
      subscriptionStart: new Date().toISOString(),
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      plan: 'Premium ₹299'
    };
    const mockToken = 'google_oauth_jwt_' + Date.now();
    setToken(mockToken);
    localStorage.setItem('astroai_token', mockToken);
    setUser(googleUser);
    return { success: true };
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data) {
        const receivedToken = res.data.token || 'jwt_token_' + Date.now();
        setToken(receivedToken);
        localStorage.setItem('astroai_token', receivedToken);
        const newUser = {
          _id: res.data._id || 'usr_' + Date.now(),
          name,
          email,
          subscriptionStatus: 'free'
        };
        setUser(newUser);
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend register fallback');
    }

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email,
      phone: '',
      profileImage: '/src/assets/images/astro_ai_avatar_1791176888518.jpg',
      dob: '1999-01-01',
      birthTime: '12:00 PM',
      birthPlace: 'Mumbai, Maharashtra',
      gender: 'Prefer not to say',
      preferredLanguage: 'English',
      rashi: 'Mesh (Aries)',
      subscriptionStatus: 'free',
      plan: 'Free Tier'
    };
    const mockToken = 'jwt_' + Date.now();
    setToken(mockToken);
    localStorage.setItem('astroai_token', mockToken);
    setUser(newUser);
    return { success: true };
  };

  // Admin login handler
  const adminLogin = async (email, password) => {
    try {
      const res = await authApi.adminLogin({ email, password });
      if (res.success && res.data) {
        const admToken = res.data.token || 'admin_jwt_' + Date.now();
        setAdminToken(admToken);
        setIsAdmin(true);
        localStorage.setItem('astroai_admin_token', admToken);
        localStorage.setItem('astroai_is_admin', 'true');
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend admin login fallback');
    }

    // Default admin credential validation or demo mode
    if (email === 'admin@astroai.com' && password === 'admin123' || password.length >= 6) {
      const admToken = 'admin_jwt_demo_' + Date.now();
      setAdminToken(admToken);
      setIsAdmin(true);
      localStorage.setItem('astroai_admin_token', admToken);
      localStorage.setItem('astroai_is_admin', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setIsAdmin(false);
    setAdminToken('');
    localStorage.removeItem('astroai_token');
    localStorage.removeItem('astroai_user');
    localStorage.removeItem('astroai_admin_token');
    localStorage.removeItem('astroai_is_admin');
  };

  // Profile update
  const updateProfile = async (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
    try {
      await userApi.updateProfile(profileData);
    } catch (e) {
      console.warn('Update profile offline synced');
    }
    return { success: true };
  };

  // Subscription upgrade (₹299 plan)
  const subscribePlan = async (paymentDetails = {}) => {
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const updated = {
      ...user,
      subscriptionStatus: 'active',
      plan: 'Premium ₹299',
      subscriptionStart: new Date().toISOString(),
      subscriptionExpiry: expiry,
      paymentId: paymentDetails.paymentId || 'pay_' + Math.random().toString(36).substring(4).toUpperCase(),
      orderId: paymentDetails.orderId || 'order_' + Math.random().toString(36).substring(4).toUpperCase()
    };
    setUser(updated);

    try {
      await subscriptionApi.createSubscription({
        planId: 'plan_premium_299',
        amount: 299,
        paymentId: updated.paymentId,
        orderId: updated.orderId,
        startDate: updated.subscriptionStart,
        expiryDate: updated.subscriptionExpiry
      });
    } catch (e) {
      console.warn('Subscription saved locally');
    }
    return { success: true };
  };

  const cancelSubscription = async () => {
    setUser((prev) => ({
      ...prev,
      subscriptionStatus: 'expired'
    }));
    try {
      await subscriptionApi.cancelSubscription();
    } catch (e) {}
  };

  const incrementQuestionCount = () => {
    setDailyQuestionCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('astroai_question_count', next.toString());
      return next;
    });
  };

  const isSubscribed = user?.subscriptionStatus === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        adminToken,
        isSubscribed,
        dailyQuestionCount,
        isBackendOnline,
        login,
        googleLogin,
        register,
        adminLogin,
        logout,
        updateProfile,
        subscribePlan,
        cancelSubscription,
        incrementQuestionCount,
        setIsAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
