import React, { useRef, useEffect, useState } from 'react';
import { Upload, Move, Type, Eye, Palette, Layers, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, Sparkles, FileUp, Columns } from 'lucide-react';
import { loadTemplateFromFile } from '../utils/pdfTemplateLoader';
import { generateDefaultTemplateCanvas } from '../utils/defaultTemplates';
import { renderCertificateToCanvas } from '../utils/certificateRenderer';

const fontOptions = [
  { name: 'Cinzel (Serif Elegance)', value: 'Cinzel' },
  { name: 'Playfair Display (Classic Luxury)', value: 'Playfair Display' },
  { name: 'Great Vibes (Handwritten Signature Script)', value: 'Great Vibes' },
  { name: 'Alex Brush (Calligraphy)', value: 'Alex Brush' },
  { name: 'Cormorant Garamond (Graceful)', value: 'Cormorant Garamond' },
  { name: 'Montserrat (Modern Bold)', value: 'Montserrat' },
  { name: 'Inter (Clean Sans-Serif)', value: 'Inter' }
];

export const VisualEditor = ({ 
  templateDataUrl, 
  setTemplateDataUrl, 
  fields, 
  setFields, 
  recipients, 
  selectedRecipientIdx, 
  setSelectedRecipientIdx 
}) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFieldId, setSelectedFieldId] = useState('name');
  const [isUploading, setIsUploading] = useState(false);
  const [activePreset, setActivePreset] = useState('custom');
  const [isDragOver, setIsDragOver] = useState(false);

  // Active recipient being previewed
  const currentRecipient = recipients[selectedRecipientIdx] || recipients[0] || { name: 'Sample Name', certId: 'REF-001' };

  // Render canvas whenever template, fields or recipient index changes
  useEffect(() => {
    if (!templateDataUrl || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = templateDataUrl;
    img.onload = async () => {
      const renderedCanvas = await renderCertificateToCanvas(img, currentRecipient, fields);
      const displayCanvas = canvasRef.current;
      displayCanvas.width = renderedCanvas.width;
      displayCanvas.height = renderedCanvas.height;
      const ctx = displayCanvas.getContext('2d');
      ctx.drawImage(renderedCanvas, 0, 0);
    };
  }, [templateDataUrl, fields, selectedRecipientIdx, currentRecipient]);

  // Handle template file upload (PDF or Image)
  const processFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const { dataUrl } = await loadTemplateFromFile(file);
      setTemplateDataUrl(dataUrl);
      setActivePreset('custom');
    } catch (err) {
      console.error('Error loading template file:', err);
      alert('Upload error: ' + (err.message || 'Please make sure it is a valid PDF, PNG, or JPG file.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
    // Reset file input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Preset Template Loader
  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    const dataUrl = generateDefaultTemplateCanvas(preset);
    setTemplateDataUrl(dataUrl);
  };

  // Active field being configured
  const currentField = fields.find(f => f.id === selectedFieldId) || fields[0];

  const updateCurrentField = (key, value) => {
    setFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, [key]: value } : f));
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !selectedFieldId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clickX = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const clickY = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    const clampX = Math.max(0, Math.min(100, clickX));
    const clampY = Math.max(0, Math.min(100, clickY));

    setFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, x: clampX, y: clampY } : f));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf" 
        style={{ display: 'none' }} 
        onChange={handleFileUpload} 
      />

      {/* Upload Bar & Drag-and-Drop Area */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          background: isDragOver 
            ? 'rgba(42, 191, 164, 0.25)' 
            : 'linear-gradient(135deg, rgba(42, 191, 164, 0.15) 0%, rgba(26, 158, 135, 0.15) 100%)',
          border: isDragOver ? '2px dashed #2ABFA4' : '1px solid rgba(42, 191, 164, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2ABFA4', padding: '10px', borderRadius: '10px' }}>
            <FileUp size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>
                Upload Certificate Template (PDF, PNG, or JPG)
              </span>
              <span className="badge badge-gold">Drag & Drop Supported</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Click the button or drag & drop your PDF / PNG file into this area
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="glass-btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ padding: '12px 20px', fontSize: '0.95rem', fontWeight: '600' }}
          >
            <Upload size={18} /> {isUploading ? 'Rendering Template...' : 'Browse & Upload Template'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN: Canvas Preview */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Preview Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#2ABFA4" /> Live Certificate Preview
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Previewing Entry {selectedRecipientIdx + 1} of {recipients.length}
              </p>
            </div>

            <button 
              className="glass-btn" 
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.8rem' }}
            >
              <Upload size={14} /> Change Template File
            </button>
          </div>

          {/* Canvas Display */}
          <div className="canvas-wrapper">
            {templateDataUrl ? (
              <canvas 
                ref={canvasRef} 
                className="canvas-element" 
                onClick={handleCanvasClick}
                style={{ cursor: 'crosshair' }}
                title={`Click anywhere on certificate to position "${currentField?.label || 'text'}"`}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <Upload size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '8px', color: '#94a3b8' }}>No template loaded</p>
                <p style={{ fontSize: '0.85rem' }}>Upload a PDF or image file above to get started</p>
              </div>
            )}
          </div>

          {templateDataUrl && currentField && (
            <p style={{ fontSize: '0.78rem', color: '#2ABFA4', textAlign: 'center', background: 'rgba(42, 191, 164, 0.08)', padding: '6px 12px', borderRadius: '6px' }}>
              💡 Tip: Click anywhere directly on the certificate image to place <strong>"{currentField.label}"</strong> instantly!
            </p>
          )}

          {/* Pagination & Recipient Selector Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 18px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                className="glass-btn" 
                onClick={() => setSelectedRecipientIdx(prev => Math.max(0, prev - 1))}
                disabled={selectedRecipientIdx === 0}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '0.88rem', fontWeight: '500', color: '#cbd5e1' }}>
                {currentRecipient ? (currentRecipient[currentField?.id] || currentRecipient.name || 'Recipient') : 'No Recipient'} ({selectedRecipientIdx + 1} / {recipients.length})
              </span>
              <button 
                className="glass-btn" 
                onClick={() => setSelectedRecipientIdx(prev => Math.min(recipients.length - 1, prev + 1))}
                disabled={selectedRecipientIdx >= recipients.length - 1}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Field Position & Font Controls */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {fields.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Columns size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>No fields to position</p>
              <p style={{ fontSize: '0.82rem' }}>Import your data first to see positionable fields here</p>
            </div>
          ) : (
          <>
          
          {/* Field Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              Select Field to Position & Style
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {fields.map((f, fIdx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: selectedFieldId === f.id ? 'rgba(42, 191, 164, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                    border: selectedFieldId === f.id ? '1px solid #2ABFA4' : '1px solid rgba(255,255,255,0.08)',
                    color: selectedFieldId === f.id ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Type size={16} color={selectedFieldId === f.id ? '#5CC8A8' : '#64748b'} />
                    <span style={{ fontWeight: '600' }}>{fIdx + 1}. {f.label}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={f.enabled} 
                    onChange={(e) => {
                      e.stopPropagation();
                      setFields(prev => prev.map(item => item.id === f.id ? { ...item, enabled: e.target.checked } : item));
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Selected Field Style Controls */}
          {currentField && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#5CC8A8' }}>
                  Position & Font: {currentField.label}
                </span>
              </div>

              {/* Position X (Horizontal %) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: '#e2e8f0' }}>Horizontal Position (X)</span>
                  <span style={{ background: 'rgba(42,191,164,0.15)', color: '#2ABFA4', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>{currentField.x}%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    className="glass-btn" 
                    onClick={() => updateCurrentField('x', parseFloat(Math.max(0, currentField.x - 0.5).toFixed(1)))}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    title="Nudge Left 0.5%"
                  >
                    ◄ Left
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={currentField.x} 
                    onChange={(e) => updateCurrentField('x', parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#2ABFA4', cursor: 'pointer' }}
                  />
                  <button 
                    className="glass-btn" 
                    onClick={() => updateCurrentField('x', parseFloat(Math.min(100, currentField.x + 0.5).toFixed(1)))}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    title="Nudge Right 0.5%"
                  >
                    Right ►
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  <span>← Left (0%)</span>
                  <span>Right (100%) →</span>
                </div>
              </div>

              {/* Position Y (Vertical %) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: '#e2e8f0' }}>Vertical Position (Y)</span>
                  <span style={{ background: 'rgba(245,197,99,0.15)', color: '#F5C563', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>{currentField.y}%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    className="glass-btn" 
                    onClick={() => updateCurrentField('y', parseFloat(Math.max(0, currentField.y - 0.5).toFixed(1)))}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    title="Nudge Up 0.5%"
                  >
                    ▲ Up
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={currentField.y} 
                    onChange={(e) => updateCurrentField('y', parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#F5C563', cursor: 'pointer' }}
                  />
                  <button 
                    className="glass-btn" 
                    onClick={() => updateCurrentField('y', parseFloat(Math.min(100, currentField.y + 0.5).toFixed(1)))}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    title="Nudge Down 0.5%"
                  >
                    Down ▼
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  <span>↑ Top / Up (0%)</span>
                  <span>Bottom / Down (100%) ↓</span>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Font Family
                </label>
                <select 
                  value={currentField.fontFamily} 
                  onChange={(e) => updateCurrentField('fontFamily', e.target.value)}
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>

              {/* Font Size & Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Font Size (px)
                  </label>
                  <input 
                    type="number" 
                    value={currentField.fontSize} 
                    onChange={(e) => updateCurrentField('fontSize', parseInt(e.target.value) || 20)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Text Color
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="color" 
                      value={currentField.color} 
                      onChange={(e) => updateCurrentField('color', e.target.value)}
                      style={{ width: '38px', height: '38px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={currentField.color} 
                      onChange={(e) => updateCurrentField('color', e.target.value)}
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
          </>
          )}

        </div>

      </div>
    </div>
  );
};
