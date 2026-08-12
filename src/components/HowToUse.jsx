import React from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, Sparkles, Lightbulb, ArrowRight, Shield, Columns, MousePointer, Download } from 'lucide-react';

export const HowToUse = ({ onBack }) => {
  const steps = [
    {
      num: '1',
      title: '1. Import Data & Choose Fields',
      icon: FileSpreadsheet,
      color: '#2ABFA4',
      description: 'Upload an Excel (.xlsx) or CSV file with your recipient list. BatchCert detects all columns automatically. Select which columns you want to include on the certificate (e.g., Name, City, Date, Ref No).',
      tip: 'You can select 2, 3, or more fields — each column becomes a positionable text field'
    },
    {
      num: '2',
      title: '2. Upload Certificate Template',
      icon: Upload,
      color: '#F5C563',
      description: 'Design your certificate in any software (Canva, Photoshop, Figma, PowerPoint). Leave the name area blank, export as PDF or PNG/JPG, then upload or drag & drop it into BatchCert.',
      tip: 'Use high-resolution landscape images (e.g. 2000×1414px) for best quality'
    },
    {
      num: '3',
      title: '3. Position Fields on Template',
      icon: MousePointer,
      color: '#2ABFA4',
      description: 'Go to Template & Design. Click directly on the certificate preview image to place any field instantly, or fine-tune using the ◄ Left / Right ► and ▲ Up / Down ▼ nudge buttons.',
      tip: 'Customize font style, size, and color for each column individually'
    },
    {
      num: '4',
      title: '4. Batch Export All Certificates',
      icon: Download,
      color: '#F5C563',
      description: 'Go to Generate Copies and choose ZIP of PNGs or Combined PDF. Click Start Bulk Generation — our bulk certificate generator processes all certificates in seconds right inside your browser.',
      tip: 'ZIP format gives individual high-res PNG files for each recipient'
    }
  ];

  const tips = [
    { icon: MousePointer, text: 'Click anywhere on the certificate canvas to place text instantly' },
    { icon: Columns, text: 'Nudge text by 0.5% with the ◄ Left / Right ► and ▲ Up / Down ▼ buttons' },
    { icon: ArrowRight, text: 'Export as ZIP of PNGs for individual files, or PDF for easy printing' },
    { icon: Shield, text: '100% private — all processing happens in your browser' }
  ];

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', padding: '30px 16px 60px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="glass-btn"
        style={{ marginBottom: '32px', color: '#2ABFA4', borderColor: 'rgba(42, 191, 164, 0.3)' }}
      >
        <ArrowLeft size={18} /> Back to App
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex', padding: '14px', borderRadius: '16px', marginBottom: '16px',
          background: 'rgba(42, 191, 164, 0.1)', border: '1px solid rgba(42, 191, 164, 0.2)'
        }}>
          <Lightbulb size={32} color="#2ABFA4" />
        </div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: '12px',
          background: 'linear-gradient(135deg, #2ABFA4, #F5C563)', WebkitBackgroundClip: 'text',
          backgroundClip: 'text', color: 'transparent'
        }}>
          How to Use BatchCert
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
          Generate hundreds of personalized certificates in seconds. Follow these 4 easy steps to use our free bulk certificate generator.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
        {steps.map((step) => (
          <div 
            key={step.num}
            className="glass-panel"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            {/* Left accent bar */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
              background: `linear-gradient(to bottom, ${step.color}, transparent)`
            }} />

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Step number */}
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
                background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                border: `1px solid ${step.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 700, color: step.color
              }}>
                {step.num}
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                {/* Title with icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <step.icon size={20} color={step.color} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc' }}>{step.title}</h3>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '12px' }}>
                  {step.description}
                </p>

                {/* Tip */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
                  borderRadius: '8px', fontSize: '0.8rem',
                  background: 'rgba(245, 197, 99, 0.08)', border: '1px solid rgba(245, 197, 99, 0.15)',
                  color: '#F5C563'
                }}>
                  <Lightbulb size={14} />
                  {step.tip}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div style={{ marginBottom: '44px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px', textAlign: 'center' }}>
          Pro Tips & Best Practices
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {tips.map((tip, i) => (
            <div 
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <tip.icon size={16} color="#F5C563" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onBack}
          className="glass-btn btn-primary"
          style={{ padding: '14px 36px', fontSize: '1rem', fontWeight: 600, borderRadius: '12px' }}
        >
          <Sparkles size={18} /> Get Started Now
        </button>
      </div>
    </div>
  );
};

export default HowToUse;
