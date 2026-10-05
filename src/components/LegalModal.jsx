import React from 'react';
import { X, ShieldAlert, FileText, RefreshCw, Mail, HelpCircle } from 'lucide-react';

export default function LegalModal({ type, isOpen, onClose }) {
  if (!isOpen) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: FileText,
      body: (
        <>
          <p>
            At <strong>AstroAi</strong>, accessible from https://astroai-backend-1.onrender.com, your privacy and astrological birth confidentiality are of supreme importance.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>1. Information We Collect</h4>
          <p>
            We collect your Name, Email address, Date of Birth, Time of Birth, and Place of Birth solely to compute accurate Vedic planetary positions and astrological chart houses.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>2. Use of Your Data</h4>
          <p>
            Your birth coordinates are parsed by AI models for real-time consultation. We never sell, rent, or distribute personal birth charts to third-party ad networks.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>3. Payment Security</h4>
          <p>
            Payment transactions for the ₹299 Premium plan are processed through Razorpay with 256-bit encryption. AstroAi does not store raw credit card numbers or banking passwords.
          </p>
        </>
      )
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      body: (
        <>
          <p>
            By accessing or using the AstroAi platform, you agree to be bound by these Terms of Service.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>1. Membership & Subscription</h4>
          <p>
            The Premium Subscription is billed at ₹299 per month. Subscribers receive unlimited access to AI consultations, planetary remedies, and exclusive astrology short videos.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>2. User Conduct</h4>
          <p>
            Users agree not to misuse AI chat for generating defamatory, abusive, or unlawful content. AstroAi reserves the right to suspend or block abusive accounts.
          </p>
        </>
      )
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: RefreshCw,
      body: (
        <>
          <p>
            We strive for total satisfaction with our astrological insights and guidance.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>1. Cancellation</h4>
          <p>
            You can cancel your ₹299 monthly subscription at any time directly through the Profile or Subscription settings. Upon cancellation, your VIP privileges remain active until the end of the current billing cycle.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>2. Refund Eligibility</h4>
          <p>
            If you experience technical issues preventing access to the AI consultation engine, contact support within 48 hours for a prompt refund review.
          </p>
        </>
      )
    },
    disclaimer: {
      title: 'AI & Astrology Disclaimer (Mandatory)',
      icon: ShieldAlert,
      body: (
        <>
          <div
            style={{
              padding: '14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '13px',
              lineHeight: 1.6,
              marginBottom: '14px'
            }}
          >
            <strong>Statutory Compliance Notice (SOP 29):</strong> AstroAi ko guaranteed future prediction, guaranteed financial returns, medical diagnosis, legal advice, ya guaranteed outcomes ke roop mein present nahi kiya jana chahiye.
          </div>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>1. Guidance Purposes Only</h4>
          <p>
            Astrology, Kundli matching, and planetary dasha analysis are based on traditional cultural systems and computational synthesis for self-reflection and spiritual guidance only.
          </p>
          <h4 style={{ margin: '14px 0 6px 0', color: 'var(--gold-light)' }}>2. Medical & Financial Decisions</h4>
          <p>
            Always consult a licensed medical doctor for health concerns, and certified financial advisors before making investment or stock market decisions.
          </p>
        </>
      )
    },
    contact: {
      title: 'Contact AstroAi Support',
      icon: Mail,
      body: (
        <>
          <p>Have questions about your Kundli reading, VIP subscription, or video uploads?</p>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
              <strong>Email:</strong> support@astroai.com
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
              <strong>Helpline:</strong> +91 (800) 555-ASTRO (10:00 AM - 07:00 PM IST)
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
              <strong>Backend Endpoint:</strong> https://astroai-backend-1.onrender.com
            </div>
          </div>
        </>
      )
    }
  };

  const current = contentMap[type] || contentMap.disclaimer;
  const Icon = current.icon;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon size={20} style={{ color: 'var(--gold-primary)' }} />
            <span className="modal-title">{current.title}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          {current.body}
        </div>
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
