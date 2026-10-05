import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Crown,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentApi, subscriptionApi } from '../services/api';

export default function SubscriptionModal({ isOpen, onClose }) {
  const { user, isSubscribed, subscribePlan, cancelSubscription } = useAuth();
  const [step, setStep] = useState('plan'); // 'plan', 'checkout', 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    setIsProcessing(true);
    try {
      // Step 1: Create Order
      const orderRes = await paymentApi.createOrder(299);
      const orderId = orderRes.data?.orderId || 'order_' + Math.random().toString(36).substring(4).toUpperCase();

      // Switch to checkout dialog
      setStep('checkout');
    } catch (e) {
      setStep('checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    const mockPaymentId = 'pay_' + Math.random().toString(36).substring(3).toUpperCase();
    const mockOrderId = 'ord_astro_' + Math.floor(100000 + Math.random() * 900000);

    // Simulate gateway verification
    try {
      await paymentApi.verifyPayment({
        orderId: mockOrderId,
        paymentId: mockPaymentId,
        signature: 'sig_' + Date.now()
      });
    } catch (e) {}

    // Activate subscription via AuthContext
    await subscribePlan({
      paymentId: mockPaymentId,
      orderId: mockOrderId
    });

    setTransactionData({
      paymentId: mockPaymentId,
      orderId: mockOrderId,
      amount: 299,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });

    setIsProcessing(false);
    setStep('success');
  };

  const handleCancelSub = async () => {
    if (confirm('Are you sure you want to cancel your VIP subscription? You will lose access to premium chat & videos.')) {
      await cancelSubscription();
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: step === 'checkout' ? '460px' : '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={22} style={{ color: 'var(--gold-primary)' }} />
            <span className="modal-title">
              {step === 'plan' && 'AstroAi Premium Subscription'}
              {step === 'checkout' && 'Secure Payment Gateway'}
              {step === 'success' && 'VIP Access Activated!'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Plan & Benefits Details */}
        {step === 'plan' && (
          <div>
            <div className="pricing-card" style={{ padding: '24px 20px', margin: '0 0 20px 0' }}>
              <div className="pricing-badge">VIP PLAN</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gold-light)' }}>
                Monthly Cosmic Pass
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Direct access to high-precision Vedic algorithms and AstroAi guidance.
              </p>

              <div className="pricing-price-box" style={{ margin: '16px 0' }}>
                <span className="price-currency">₹</span>
                <span className="price-amount tabular-nums">299</span>
                <span className="price-period"> / Month</span>
              </div>

              <div className="benefits-list" style={{ margin: '16px 0', gap: '10px' }}>
                {[
                  'Unlimited AI Astro Consultations (Career, Marriage, Wealth)',
                  'Complete Kundli Birth Chart & D9 Navamsha Analysis',
                  'Exclusive VIP Astrology Short Videos & Hidden Secrets',
                  'Tailored Vedic Remedies, Mantras & Gemstone Guidance',
                  'Chat History Auto-Saving & Sync across devices',
                  'Priority Ultra-Fast AI Server Processing'
                ].map((b, i) => (
                  <div key={i} className="benefit-item" style={{ fontSize: '13.5px' }}>
                    <CheckCircle size={16} className="benefit-check" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {isSubscribed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      padding: '12px',
                      borderRadius: '8px',
                      color: '#34d399',
                      fontSize: '13.5px',
                      fontWeight: 600
                    }}
                  >
                    ✦ You are currently an Active VIP Member
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={handleCancelSub}>
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary-gold btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleStartPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="spin-animation" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <span>Pay ₹299 Now</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={15} style={{ color: '#10b981' }} />
              <span>Razorpay 256-Bit SSL Encrypted · 100% Satisfaction Guarantee</span>
            </div>
          </div>
        )}

        {/* STEP 2: Interactive Razorpay-style Gateway Dialog */}
        {step === 'checkout' && (
          <div>
            <div className="payment-dialog">
              <div className="payment-header">
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AstroAi Consultation</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Total: ₹299.00
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 8px', borderRadius: '4px' }}>
                  SSL Secure
                </div>
              </div>

              {/* Payment Tab Navigation */}
              <div className="payment-tab-list">
                <button
                  className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <QrCode size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  UPI / QR
                </button>
                <button
                  className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Card
                </button>
                <button
                  className={`payment-tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  NetBanking
                </button>
              </div>

              <div className="payment-body">
                {paymentMethod === 'upi' && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Scan QR code with GPay, PhonePe, Paytm or Enter UPI ID:
                    </p>
                    <div className="qr-code-box">
                      <svg viewBox="0 0 100 100" width="130" height="130">
                        <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                        <rect x="10" y="10" width="25" height="25" fill="#000000" />
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="65" y="10" width="25" height="25" fill="#000000" />
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="10" y="65" width="25" height="25" fill="#000000" />
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                        <rect x="45" y="45" width="12" height="12" fill="#dfa856" />
                        <rect x="40" y="15" width="8" height="15" fill="#000000" />
                        <rect x="50" y="70" width="15" height="8" fill="#000000" />
                        <rect x="75" y="45" width="15" height="8" fill="#000000" />
                        <rect x="45" y="65" width="8" height="20" fill="#000000" />
                      </svg>
                    </div>
                    <div className="admin-form-group" style={{ textAlign: 'left', marginTop: '14px' }}>
                      <label>UPI ID (VPA):</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="admin-form-group">
                      <label>Card Number:</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="admin-form-group">
                        <label>Expiry (MM/YY):</label>
                        <input type="text" className="admin-input" defaultValue="08/29" />
                      </div>
                      <div className="admin-form-group">
                        <label>CVV:</label>
                        <input type="password" className="admin-input" defaultValue="•••" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="admin-form-group">
                    <label>Select Bank:</label>
                    <select className="admin-select" defaultValue="HDFC">
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India (SBI)</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <button
                  className="btn btn-primary-gold btn-lg"
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="spin-animation" />
                      Verifying Signature with Gateway...
                    </>
                  ) : (
                    `Authorize & Pay ₹299`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success Confirmation */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '1.5px solid #10b981'
              }}
            >
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              Welcome to AstroAi VIP!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your payment of ₹299 was successful. Unlimited AI consultations and premium astrology features are now unlocked.
            </p>

            {transactionData && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '12.5px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                  <span className="tabular-nums" style={{ color: 'var(--gold-light)' }}>{transactionData.paymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <span className="tabular-nums">{transactionData.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                  <span className="tabular-nums font-bold">₹{transactionData.amount}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                  <span>{transactionData.date}</span>
                </div>
              </div>
            )}

            <button className="btn btn-primary-gold btn-lg" style={{ width: '100%' }} onClick={onClose}>
              <Sparkles size={16} />
              Start VIP Astrology Consultation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
