import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Crown,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import { QUICK_PROMPTS, generateAstrologyResponse } from '../data/astroData';

export default function ChatModule({ onOpenSubscription, onOpenProfile }) {
  const { user, isSubscribed, dailyQuestionCount, incrementQuestionCount } = useAuth();

  // Chats state with persistence
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('astroai_chat_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'session-default',
        title: 'Career & Mahadasha Consultation',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 'm-1',
            sender: 'ai',
            text: `Namaste ${user?.name || 'Bhakt'}! Main aapka **AstroAi Panditji** hoon. Aapki Kundli ke graha aur Gochar (transits) dekh kar main aapke sawalon ka uttar doonga.\n\nAap career, vivah, dhan, ya graha dasha ke baare mein kuch bhi pooch sakte hain.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState('session-default');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Active session object
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem('astroai_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  // Handle new conversation
  const handleNewChat = () => {
    const newSession = {
      id: 'session-' + Date.now(),
      title: 'New Consultation',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'm-' + Date.now(),
          sender: 'ai',
          text: `Namaste ${user?.name || 'Aap'}! Shubh aarambh. Aapki Janam Kundli ki planetary positions load ho chuki hain. Aaj aap kis vishay par graha margdarshan chahte hain?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  // Delete chat
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    if (updated.length === 0) {
      handleNewChat();
    } else {
      setSessions(updated);
      if (activeSessionId === sessionId) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    // Check free tier limits
    if (!isSubscribed && dailyQuestionCount >= 5) {
      onOpenSubscription();
      return;
    }

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active session with user message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          const updatedTitle = s.messages.length === 1 ? query.slice(0, 32) + '...' : s.title;
          return {
            ...s,
            title: updatedTitle,
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    setInputText('');
    setIsLoading(true);
    incrementQuestionCount();

    // Call API with profile context
    try {
      const astrologyContext = {
        name: user?.name,
        dob: user?.dob,
        birthTime: user?.birthTime,
        birthPlace: user?.birthPlace,
        gender: user?.gender,
        preferredLanguage: user?.preferredLanguage,
        rashi: user?.rashi
      };

      let aiAnswer = '';
      const apiRes = await chatApi.askAiDirect(query, astrologyContext);
      if (apiRes.success && apiRes.data?.response) {
        aiAnswer = apiRes.data.response;
      } else {
        // High-fidelity fallback Vedic Astro engine
        await new Promise((r) => setTimeout(r, 900));
        aiAnswer = generateAstrologyResponse(query, astrologyContext);
      }

      const aiMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === currentSession.id) {
            return {
              ...s,
              messages: [...s.messages, aiMessage]
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-module-container">
      {/* Left Sidebar: Astrology Context & History */}
      <div className="chat-sidebar">
        <button className="btn btn-outline-gold btn-sm" style={{ width: '100%' }} onClick={handleNewChat}>
          <Plus size={16} />
          <span>New Chat</span>
        </button>

        {/* User Kundli Info Box */}
        <div className="astro-context-box">
          <div className="astro-context-title">
            <span>Birth Chart (Kundli)</span>
            <button
              onClick={onOpenProfile}
              style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
            >
              Edit
            </button>
          </div>
          <div className="astro-context-items">
            <div className="astro-context-row">
              <span>Name:</span>
              <span>{user?.name?.split(' ')[0] || 'Bhakt'}</span>
            </div>
            <div className="astro-context-row">
              <span>DOB:</span>
              <span>{user?.dob || 'Not set'}</span>
            </div>
            <div className="astro-context-row">
              <span>Time:</span>
              <span>{user?.birthTime || 'Not set'}</span>
            </div>
            <div className="astro-context-row">
              <span>City:</span>
              <span>{user?.birthPlace?.split(',')[0] || 'Varanasi'}</span>
            </div>
            <div className="astro-context-row">
              <span>Rashi:</span>
              <span style={{ color: 'var(--gold-light)' }}>{user?.rashi || 'Cancer'}</span>
            </div>
          </div>
        </div>

        {/* Subscription Status Warning if free */}
        {!isSubscribed && (
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(223, 168, 86, 0.08)',
              border: '1px solid var(--border-gold)',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)', fontWeight: 600 }}>
              <Crown size={14} />
              <span>Free Tier ({dailyQuestionCount}/5 used)</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              Upgrade to ₹299 for unlimited Vedic consultations & full D9 Kundli.
            </p>
            <button
              className="btn btn-primary-gold btn-sm"
              style={{ width: '100%', fontSize: '11px', padding: '4px 8px' }}
              onClick={onOpenSubscription}
            >
              Unlock Premium ₹299
            </button>
          </div>
        )}

        <div className="chat-sidebar-header">
          <span className="sidebar-title">Recent Chats</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sessions.length}</span>
        </div>

        <div className="history-list">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`history-item ${s.id === activeSessionId ? 'active' : ''}`}
              onClick={() => setActiveSessionId(s.id)}
            >
              <span className="history-item-text">{s.title}</span>
              <button
                onClick={(e) => handleDeleteSession(s.id, e)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                title="Delete Chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-astrologer-info">
            <img
              src="/src/assets/images/astro_ai_avatar_1791176888518.jpg"
              alt="AstroAi Panditji"
              className="chat-astrologer-avatar"
              referrerPolicy="no-referrer"
            />
            <div className="chat-title-group">
              <h3>AstroAi Panditji</h3>
              <span className="chat-status-text">Online · Ready for Vedic Consultation</span>
            </div>
          </div>
          <div>
            {isSubscribed ? (
              <span className="premium-badge-tag">VIP Active</span>
            ) : (
              <button className="btn btn-outline-gold btn-sm" onClick={onOpenSubscription}>
                <Crown size={13} />
                Get VIP ₹299
              </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="messages-container">
          {currentSession?.messages.map((m) => (
            <div key={m.id} className={`message-row ${m.sender}`}>
              {m.sender === 'ai' && (
                <img
                  src="/src/assets/images/astro_ai_avatar_1791176888518.jpg"
                  alt="AstroAi"
                  className="message-avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <div className="message-bubble">
                  {m.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} style={{ whiteSpace: 'pre-line' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="message-time">{m.timestamp}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row ai">
              <img
                src="/src/assets/images/astro_ai_avatar_1791176888518.jpg"
                alt="AstroAi"
                className="message-avatar"
                referrerPolicy="no-referrer"
              />
              <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={14} className="spin-animation" style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Calculating Graha Dasha and Planetary Aspects...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="quick-prompts-bar">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              className="prompt-chip"
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <textarea
            className="chat-textarea"
            placeholder="Ask your astrology question (e.g. Mere career me promotion kab hoga?)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary-gold"
            style={{ height: '48px', width: '48px', padding: 0 }}
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
