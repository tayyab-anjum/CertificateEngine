import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Zap, Shield, Clock, Upload, FileSpreadsheet, Download, HelpCircle, ChevronDown } from 'lucide-react';

export const LandingPage = ({ onGetStarted, onNavigateHowToUse }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    setIsExiting(true);
    setTimeout(() => {
      onGetStarted();
    }, 850);
  };

  const faqs = [
    {
      q: "How do I generate bulk certificates from an Excel file?",
      a: "Upload your Excel (.xlsx) or CSV file in Step 1. Select which columns (Name, City, Date, Ref No, etc.) you want on your certificate. Then upload your design template, position the fields, and click Generate to download all certificates in bulk."
    },
    {
      q: "Is BatchCert free to use?",
      a: "Yes! BatchCert is 100% free with no hidden fees, subscriptions, or watermarks. You can generate unlimited certificates."
    },
    {
      q: "Is my data private and secure?",
      a: "Absolutely. All processing occurs locally inside your web browser using HTML5 Canvas technology. Your spreadsheet data and certificate templates are never uploaded to any external server."
    },
    {
      q: "What file formats are supported for export?",
      a: "You can batch export your certificates as individual high-resolution PNG images inside a ZIP archive or as a single multi-page PDF document ready for bulk printing."
    }
  ];

  return (
    <>
      <style>{`
        @keyframes landingFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes landingPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes landingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .landing-curtain {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0A1128;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.85s ease;
        }
        .landing-curtain.exit {
          transform: translateY(-100%);
          opacity: 0;
        }
      `}</style>

      <div className={`landing-curtain ${isExiting ? 'exit' : ''}`}>
        {/* Background blobs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,191,164,0.12) 0%, transparent 70%)',
            animation: 'landingPulse 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,197,99,0.1) 0%, transparent 70%)',
            animation: 'landingPulse 10s ease-in-out infinite 2s'
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', width: '800px', height: '800px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,191,164,0.05) 0%, transparent 60%)',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
          padding: '60px 20px 40px', maxWidth: '850px', margin: '0 auto'
        }}>
          
          {/* Logo */}
          <div style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            marginBottom: '16px', animation: isVisible ? 'landingFloat 6s ease-in-out infinite 1s' : 'none'
          }}>
            <img 
              src="/logo.png" 
              alt="BatchCert Logo" 
              style={{
                width: '100px', height: '100px', objectFit: 'cover', borderRadius: '24px',
                filter: 'drop-shadow(0 8px 24px rgba(42, 191, 164, 0.3))'
              }} 
            />
          </div>

          {/* App name */}
          <h1 style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #2ABFA4 0%, #7DD9BC 40%, #F5C563 100%)',
            backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', marginBottom: '6px', lineHeight: 1.1,
            animation: isVisible ? 'landingGradient 6s ease infinite' : 'none'
          }}>
            BatchCert
          </h1>

          {/* Tagline */}
          <p style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            fontSize: '1rem', color: '#64748b', fontWeight: 500, letterSpacing: '3px',
            textTransform: 'uppercase', marginBottom: '48px'
          }}>
            Free Bulk Certificate Generator
          </p>

          {/* Headline */}
          <h2 style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
            fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', fontWeight: 700, textAlign: 'center',
            lineHeight: 1.3, marginBottom: '20px', color: '#e2e8f0'
          }}>
            Tired of creating certificates{' '}
            <span style={{ color: '#F5C563' }}>one by one?</span>
          </h2>

          {/* Description */}
          <p style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            fontSize: '1.1rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.7,
            maxWidth: '580px', marginBottom: '40px'
          }}>
            Import your Excel data, upload your certificate template, and generate hundreds of personalized certificates in seconds.
          </p>

          {/* Feature pills */}
          <div style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
            display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: '48px'
          }}>
            {[
              { icon: FileSpreadsheet, label: 'Import Excel/CSV', color: '#2ABFA4' },
              { icon: Upload, label: 'Upload Template', color: '#F5C563' },
              { icon: Download, label: 'Batch Export', color: '#2ABFA4' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                borderRadius: '24px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.9rem',
                fontWeight: 500, color: '#cbd5e1'
              }}>
                <item.icon size={16} color={item.color} />
                {item.label}
              </div>
            ))}
          </div>

          {/* How it works mini */}
          <div style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.65s',
            display: 'flex', gap: '32px', marginBottom: '52px', flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { step: '1', title: 'Import Data', desc: 'Excel or CSV file' },
              { step: '2', title: 'Upload Template', desc: 'Your certificate design' },
              { step: '3', title: 'Generate', desc: 'Download all copies at once' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1A9E87, #2ABFA4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0
                }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.95rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.desc}</div>
                </div>
                {i < 2 && <div style={{ color: '#334155', fontSize: '1.2rem', marginLeft: '8px' }}>→</div>}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.75s',
            display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: '60px'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 36px',
                fontSize: '1.1rem', fontWeight: 600, borderRadius: '50px', cursor: 'pointer',
                border: 'none', color: '#fff', fontFamily: 'inherit',
                background: 'linear-gradient(135deg, #1A9E87 0%, #2ABFA4 100%)',
                boxShadow: '0 6px 20px rgba(42, 191, 164, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(42, 191, 164, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(42, 191, 164, 0.4)';
              }}
            >
              Get Started <ArrowRight size={20} />
            </button>

            <button
              onClick={onNavigateHowToUse}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px',
                fontSize: '1.1rem', fontWeight: 600, borderRadius: '50px', cursor: 'pointer',
                border: '2px solid rgba(245, 197, 99, 0.5)', color: '#F5C563',
                background: 'transparent', fontFamily: 'inherit',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.background = 'rgba(245, 197, 99, 0.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 197, 99, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <BookOpen size={18} /> How to Use
            </button>
          </div>

          {/* SEO FAQ Section */}
          <section style={{
            width: '100%', opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.85s',
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px', padding: '28px 24px', marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: '20px', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="#2ABFA4" /> Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  style={{
                    borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)', overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    style={{
                      width: '100%', padding: '14px 18px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', background: 'none', border: 'none', color: '#e2e8f0',
                      fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} style={{ transform: openFaqIndex === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {openFaqIndex === i && (
                    <div style={{ padding: '0 18px 14px', fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Security note */}
          <div style={{
            opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease 1s',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', color: '#475569'
          }}>
            <Shield size={14} />
            All processing happens in your browser — your data never leaves your device
          </div>

          {/* Footer */}
          <p style={{
            opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease 1.1s',
            marginTop: '24px', fontSize: '0.8rem', color: '#334155'
          }}>
            © 2026 BatchCert. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
