/**
 * AstroAI API Service
 * Base URL: https://astroai-backend-1.onrender.com
 * Handles authentication, profile, chat, videos, subscriptions, payments, and admin endpoints.
 * Includes graceful offline/sleeping fallback so the app is always fully interactive.
 */

const BASE_URL = 'https://astroai-backend-1.onrender.com';

// Local storage keys
const TOKEN_KEY = 'astroai_token';
const ADMIN_TOKEN_KEY = 'astroai_admin_token';
const USER_KEY = 'astroai_user';
const ADMIN_KEY = 'astroai_admin';

// Helper to get auth header
export const getAuthHeaders = (isAdmin = false) => {
  const token = localStorage.getItem(isAdmin ? ADMIN_TOKEN_KEY : TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with timeout
const request = async (endpoint, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return { success: true, data };
  } catch (error) {
    clearTimeout(id);
    console.warn(`API call to ${endpoint} failed or timed out:`, error.message);
    return { success: false, error: error.message };
  }
};

// 1. Health Check
export const checkHealth = async () => {
  return await request('/');
};

// 2. Authentication
export const authApi = {
  register: async (userData) => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res;
  },

  login: async (credentials) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res;
  },

  forgotPassword: async (email) => {
    return await request('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (token, password) => {
    return await request(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  },

  getMe: async () => {
    return await request('/api/auth/me', {
      headers: getAuthHeaders()
    });
  },

  adminLogin: async (credentials) => {
    return await request('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  adminForgotPassword: async (email) => {
    return await request('/api/auth/admin/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  adminResetPassword: async (token, password) => {
    return await request(`/api/auth/admin/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  }
};

// 3. User Profile
export const userApi = {
  getProfile: async () => {
    return await request('/api/users/profile', {
      headers: getAuthHeaders()
    });
  },

  updateProfile: async (profileData) => {
    return await request('/api/users/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
  },

  updatePhone: async (phone) => {
    return await request('/api/users/phone', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ phone })
    });
  },

  getSubscription: async () => {
    return await request('/api/users/subscription', {
      headers: getAuthHeaders()
    });
  },

  deleteAccount: async () => {
    return await request('/api/users/account', {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};

// 4. Chat & AI
export const chatApi = {
  sendMessage: async (messageData) => {
    return await request('/api/chat/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData)
    });
  },

  getHistory: async () => {
    return await request('/api/chat/history', {
      headers: getAuthHeaders()
    });
  },

  deleteHistory: async () => {
    return await request('/api/chat/history', {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  getChatById: async (chatId) => {
    return await request(`/api/chat/${chatId}`, {
      headers: getAuthHeaders()
    });
  },

  deleteChatById: async (chatId) => {
    return await request(`/api/chat/${chatId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  askAiDirect: async (prompt, astrologyContext = {}) => {
    return await request('/api/ai/chat', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, astrologyContext })
    });
  }
};

// 5. Videos (Shorts / Reels)
export const videoApi = {
  getPublishedVideos: async () => {
    return await request('/api/videos/published');
  },

  getVideoById: async (id) => {
    return await request(`/api/videos/${id}`);
  },

  recordView: async (id) => {
    return await request(`/api/videos/${id}/view`, {
      method: 'POST'
    });
  },

  // Admin routes
  adminGetAll: async () => {
    return await request('/api/videos/admin/all', {
      headers: getAuthHeaders(true)
    });
  },

  adminUpload: async (formData) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    try {
      const response = await fetch(`${BASE_URL}/api/videos/`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  adminUpdate: async (id, data) => {
    return await request(`/api/videos/admin/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data)
    });
  },

  adminPublish: async (id) => {
    return await request(`/api/videos/admin/${id}/publish`, {
      method: 'PUT',
      headers: getAuthHeaders(true)
    });
  },

  adminUnpublish: async (id) => {
    return await request(`/api/videos/admin/${id}/unpublish`, {
      method: 'PUT',
      headers: getAuthHeaders(true)
    });
  },

  adminDelete: async (id) => {
    return await request(`/api/videos/admin/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(true)
    });
  }
};

// 6. Subscriptions
export const subscriptionApi = {
  getPlan: async () => {
    return await request('/api/subscriptions/plan');
  },

  createSubscription: async (subscriptionData) => {
    return await request('/api/subscriptions/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subscriptionData)
    });
  },

  getMySubscription: async () => {
    return await request('/api/subscriptions/my', {
      headers: getAuthHeaders()
    });
  },

  checkAccess: async () => {
    return await request('/api/subscriptions/check-access', {
      headers: getAuthHeaders()
    });
  },

  cancelSubscription: async () => {
    return await request('/api/subscriptions/cancel', {
      method: 'PUT',
      headers: getAuthHeaders()
    });
  }
};

// 7. Payments
export const paymentApi = {
  createOrder: async (amount = 299) => {
    return await request('/api/payments/create-order', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, currency: 'INR', plan: 'Premium ₹299' })
    });
  },

  verifyPayment: async (paymentDetails) => {
    return await request('/api/payments/verify', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentDetails)
    });
  },

  getMyPayments: async () => {
    return await request('/api/payments/my', {
      headers: getAuthHeaders()
    });
  }
};

// 8. Admin Portal APIs
export const adminApi = {
  getProfile: async () => {
    return await request('/api/admin/profile', {
      headers: getAuthHeaders(true)
    });
  },

  getDashboard: async () => {
    return await request('/api/admin/dashboard', {
      headers: getAuthHeaders(true)
    });
  },

  getUsers: async () => {
    return await request('/api/admin/users', {
      headers: getAuthHeaders(true)
    });
  },

  getUserById: async (id) => {
    return await request(`/api/admin/users/${id}`, {
      headers: getAuthHeaders(true)
    });
  },

  blockUser: async (id) => {
    return await request(`/api/admin/users/${id}/block`, {
      method: 'PUT',
      headers: getAuthHeaders(true)
    });
  },

  unblockUser: async (id) => {
    return await request(`/api/admin/users/${id}/unblock`, {
      method: 'PUT',
      headers: getAuthHeaders(true)
    });
  },

  getSubscriptions: async () => {
    return await request('/api/admin/subscriptions', {
      headers: getAuthHeaders(true)
    });
  },

  getPayments: async () => {
    return await request('/api/admin/payments', {
      headers: getAuthHeaders(true)
    });
  }
};
