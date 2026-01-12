import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Building2,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  Phone,
  Loader2,
  AlertCircle,
  Star
} from 'lucide-react';
import { PLANS, useCredits, type PlanType } from '../../hooks/useCredits';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const { setPlan } = useCredits();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStep, setDemoStep] = useState<'phone' | 'verify' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const planCards = [
    {
      id: 'demo' as PlanType,
      name: 'Demo',
      price: 0,
      priceLabel: 'Free Trial',
      description: 'Try before you buy',
      icon: Sparkles,
      highlights: [
        { label: 'Duration', value: '7 days' },
        { label: 'AI Reviews', value: '3 total' },
        { label: 'AI Creation', value: '1 total' },
        { label: 'Publishes', value: '10 total' }
      ],
      cta: 'Start Demo',
      popular: false,
      requiresVerification: true
    },
    {
      id: 'starter' as PlanType,
      name: 'Starter',
      price: 29,
      description: 'For solopreneurs',
      icon: Zap,
      highlights: [
        { label: 'Credits', value: '500/month' },
        { label: 'AI Reviews', value: '10/day' },
        { label: 'AI Creation', value: '5/day' },
        { label: 'Products', value: '10' }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'growth' as PlanType,
      name: 'Growth',
      price: 79,
      description: 'For growing businesses',
      icon: Crown,
      highlights: [
        { label: 'Credits', value: '5,000/month' },
        { label: 'AI Features', value: '50/day' },
        { label: 'Landing Pages', value: '10' },
        { label: 'Team', value: '3 members' }
      ],
      extraFeatures: ['A/B Testing', 'Full Analytics'],
      cta: 'Go Growth',
      popular: true
    },
    {
      id: 'pro' as PlanType,
      name: 'Pro',
      price: 199,
      description: 'For agencies',
      icon: Rocket,
      highlights: [
        { label: 'Credits', value: '25,000/month' },
        { label: 'AI Features', value: 'Unlimited' },
        { label: 'Landing Pages', value: 'Unlimited' },
        { label: 'Team', value: '10 members' }
      ],
      extraFeatures: ['White Label', 'Priority Support'],
      cta: 'Go Pro',
      popular: false
    },
    {
      id: 'enterprise' as PlanType,
      name: 'Enterprise',
      price: 499,
      description: 'For large organizations',
      icon: Building2,
      highlights: [
        { label: 'Credits', value: '100,000/month' },
        { label: 'Everything', value: 'Unlimited' },
        { label: 'SLA', value: '99.9%' },
        { label: 'API', value: 'Full Access' }
      ],
      extraFeatures: ['Dedicated Manager', 'Custom Integrations'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handleStartDemo = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // In production, call /api/demo/request-verification
      // For demo, simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDemoStep('verify');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // In production, call /api/demo/verify
      // For demo, accept any 6-digit code
      if (verificationCode.length !== 6) {
        throw new Error('Invalid code');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoStep('success');
      
      // Activate demo after short delay
      setTimeout(() => {
        setPlan('demo');
        setShowDemoModal(false);
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === 'demo') {
      setShowDemoModal(true);
      setDemoStep('phone');
      setError('');
    } else if (planId === 'enterprise') {
      // Contact sales
      window.open('mailto:sales@marketingapp.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
    } else {
      // Start checkout (in production, redirect to Stripe)
      alert(`Starting checkout for ${PLANS[planId].name} plan ($${PLANS[planId].price}/month) - Demo mode`);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Start with a free demo, upgrade anytime as you grow</p>
      </div>

      <div className="pricing-features-bar">
        <div className="feature-highlight">
          <Shield size={20} />
          <span>7-Day Free Trial</span>
        </div>
        <div className="feature-highlight">
          <Sparkles size={20} />
          <span>5 AI Agents</span>
        </div>
        <div className="feature-highlight">
          <Users size={20} />
          <span>Unlimited Publishing</span>
        </div>
        <div className="feature-highlight">
          <Star size={20} />
          <span>Cancel Anytime</span>
        </div>
      </div>

      <div className="pricing-grid five-tier">
        {planCards.map((plan) => (
          <div 
            key={plan.id} 
            className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.id === 'demo' ? 'demo-tier' : ''}`}
          >
            {plan.popular && (
              <div className="popular-ribbon">Most Popular</div>
            )}
            
            <div className="plan-icon" style={{ background: `${PLANS[plan.id].color}20` }}>
              <plan.icon size={24} style={{ color: PLANS[plan.id].color }} />
            </div>
            
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-description">{plan.description}</p>
            
            <div className="plan-price">
              {plan.price === 0 ? (
                <span className="price-free">{plan.priceLabel || 'Free'}</span>
              ) : (
                <>
                  <span className="price-currency">$</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">/mo</span>
                </>
              )}
            </div>

            <div className="plan-highlights">
              {plan.highlights.map((highlight, i) => (
                <div key={i} className="highlight">
                  <span className="highlight-label">{highlight.label}</span>
                  <span className="highlight-value">{highlight.value}</span>
                </div>
              ))}
            </div>

            {plan.extraFeatures && (
              <div className="extra-features">
                {plan.extraFeatures.map((feature, i) => (
                  <span key={i} className="extra-badge">✨ {feature}</span>
                ))}
              </div>
            )}

            <ul className="plan-features">
              {PLANS[plan.id].features.slice(0, 4).map((feature, index) => (
                <li key={index} className="included">
                  <Check size={14} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`plan-cta ${plan.popular ? 'primary' : ''} ${plan.id === 'demo' ? 'demo' : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.cta}
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How does the demo work?</h4>
            <p>The demo requires phone verification to prevent abuse. You get 7 days to try AI features with limited usage. One demo per phone number.</p>
          </div>
          <div className="faq-item">
            <h4>What are publishing credits?</h4>
            <p>Credits are used for WhatsApp (2), Telegram (2), Email (1), and SMS (3). Publishing to Instagram, Facebook, LinkedIn, YouTube, Twitter is always free.</p>
          </div>
          <div className="faq-item">
            <h4>Can I switch plans?</h4>
            <p>Yes! Upgrade or downgrade anytime. When upgrading, you get immediate access to new features. Credits are prorated.</p>
          </div>
          <div className="faq-item">
            <h4>What's included in White Label?</h4>
            <p>Pro plan includes custom branding: your logo, colors, and domain. Perfect for agencies serving multiple clients.</p>
          </div>
        </div>
      </div>

      <div className="back-to-app">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back to App
        </button>
      </div>

      {/* Demo Verification Modal */}
      {showDemoModal && (
        <div className="modal-overlay" onClick={() => !isLoading && setShowDemoModal(false)}>
          <div className="modal-content demo-modal" onClick={e => e.stopPropagation()}>
            {demoStep === 'phone' && (
              <>
                <div className="demo-modal-header">
                  <Phone size={32} />
                  <h2>Start Your Free Demo</h2>
                </div>
                <p className="demo-modal-desc">
                  Verify your phone number to activate your 7-day demo. One demo per phone number.
                </p>
                
                <div className="phone-input-group">
                  <select 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                    className="country-select"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input 
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="phone-input"
                  />
                </div>
                
                {error && (
                  <div className="demo-error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                
                <div className="demo-info">
                  <Shield size={16} />
                  <span>We only use your phone for verification. No spam, ever.</span>
                </div>
                
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowDemoModal(false)}>
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleStartDemo}
                    disabled={phoneNumber.length < 10 || isLoading}
                  >
                    {isLoading ? <><Loader2 size={18} className="spin" /> Sending...</> : <>Send Code <ArrowRight size={16} /></>}
                  </button>
                </div>
              </>
            )}

            {demoStep === 'verify' && (
              <>
                <div className="demo-modal-header">
                  <Sparkles size={32} />
                  <h2>Enter Verification Code</h2>
                </div>
                <p className="demo-modal-desc">
                  We sent a 6-digit code to {countryCode} {phoneNumber}
                </p>
                
                <input 
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="code-input"
                  maxLength={6}
                />
                
                {error && (
                  <div className="demo-error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setDemoStep('phone')}>
                    ← Back
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || isLoading}
                  >
                    {isLoading ? <><Loader2 size={18} className="spin" /> Verifying...</> : <>Verify & Start Demo</>}
                  </button>
                </div>
              </>
            )}

            {demoStep === 'success' && (
              <div className="demo-success">
                <div className="success-icon">
                  <Check size={48} />
                </div>
                <h2>Demo Activated! 🎉</h2>
                <p>You have 7 days to explore all features. Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
