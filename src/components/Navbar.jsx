import React from 'react';
import { FileUp, Users, Download, HelpCircle, Sparkles } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, recipientCount, onOpenHowToUse }) => {
  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', marginBottom: '24px', padding: '16px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/logo.png" 
            alt="BatchCert - free bulk certificate generator logo" 
            style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #2ABFA4, #F5C563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BatchCert
              </h1>
              <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Batch Generator
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Upload your data + template & generate all certificates automatically
            </p>
          </div>
        </div>

        {/* Tab Buttons — Import first, then Template, then Generate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button 
            className={`glass-btn ${activeTab === 'recipients' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('recipients')}
            style={{ border: activeTab === 'recipients' ? 'none' : 'transparent' }}
          >
            <Users size={16} /> 1. Import Data ({recipientCount})
          </button>

          <button 
            className={`glass-btn ${activeTab === 'editor' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('editor')}
            style={{ border: activeTab === 'editor' ? 'none' : 'transparent' }}
          >
            <FileUp size={16} /> 2. Template & Design
          </button>
          
          <button 
            className={`glass-btn ${activeTab === 'export' ? 'btn-gold' : ''}`}
            onClick={() => setActiveTab('export')}
            style={{ border: activeTab === 'export' ? 'none' : 'transparent' }}
          >
            <Download size={16} /> 3. Generate {recipientCount} Copies
          </button>
        </div>

        {/* How to Use button */}
        <button className="glass-btn" onClick={onOpenHowToUse} style={{ color: '#F5C563', borderColor: 'rgba(245, 197, 99, 0.3)' }}>
          <HelpCircle size={16} /> How to Use
        </button>

      </div>
    </header>
  );
};
