import React, { useState } from 'react';
import { Download, FileText, Archive, CheckCircle2, Sparkles, Loader2, Play } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { renderCertificateToCanvas } from '../utils/certificateRenderer';

export const BatchExporter = ({ templateDataUrl, fields, recipients }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentName, setCurrentName] = useState('');
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [exportType, setExportType] = useState('zip'); // 'zip' or 'pdf'

  const getRecipientDisplayName = (rec, index) => {
    if (!rec) return `Recipient_${index + 1}`;
    if (rec.name) return String(rec.name);
    const values = Object.entries(rec)
      .filter(([k]) => k !== 'id')
      .map(([, v]) => String(v ?? ''));
    const firstVal = values.find(v => v.trim().length > 0);
    return firstVal || `Recipient_${index + 1}`;
  };

  // Run Batch Processing
  const handleStartBatchExport = async () => {
    if (!templateDataUrl || recipients.length === 0) {
      alert('Please upload a template and ensure recipients exist.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadCompleted(false);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = templateDataUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load certificate template image.'));
      });

      const total = recipients.length;

      if (exportType === 'zip') {
        // EXPORT ALL AS HIGH-RES PNG ZIP ARCHIVE
        const zip = new JSZip();
        const folder = zip.folder("Certificates_Batch");

        for (let i = 0; i < total; i++) {
          const recipient = recipients[i];
          const nameStr = getRecipientDisplayName(recipient, i);
          setCurrentName(nameStr);

          const canvas = await renderCertificateToCanvas(img, recipient, fields);
          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

          const safeName = nameStr.replace(/[^a-zA-Z0-9_\-]/g, '_') || `Certificate_${i + 1}`;
          const safeFilename = `${String(i + 1).padStart(3, '0')}_${safeName}.png`;
          folder.file(safeFilename, base64Data, { base64: true });

          setProgress(Math.round(((i + 1) / total) * 100));
          await new Promise(r => setTimeout(r, 10));
        }

        setCurrentName('Compressing ZIP archive...');
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `Certificates_${total}_Copies.zip`);
      } else {
        // EXPORT ALL AS MULTI-PAGE COMBINED PDF DOCUMENT
        const templateWidth = img.naturalWidth || 2000;
        const templateHeight = img.naturalHeight || 1414;
        const orientation = templateWidth > templateHeight ? 'l' : 'p';

        const pdf = new jsPDF({
          orientation: orientation,
          unit: 'px',
          format: [templateWidth, templateHeight]
        });

        for (let i = 0; i < total; i++) {
          const recipient = recipients[i];
          const nameStr = getRecipientDisplayName(recipient, i);
          setCurrentName(nameStr);

          if (i > 0) {
            pdf.addPage([templateWidth, templateHeight], orientation);
          }

          const canvas = await renderCertificateToCanvas(img, recipient, fields);
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, templateWidth, templateHeight);

          setProgress(Math.round(((i + 1) / total) * 100));
          await new Promise(r => setTimeout(r, 10));
        }

        setCurrentName('Saving PDF document...');
        pdf.save(`Certificates_${total}_Pages_Batch.pdf`);
      }

      setDownloadCompleted(true);
    } catch (err) {
      console.error('Batch Export Error:', err);
      alert('Export failed: ' + (err.message || 'An error occurred during generation.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(245, 197, 99, 0.15)', borderRadius: '50%', marginBottom: '12px', border: '1px solid rgba(245, 197, 99, 0.3)' }}>
          <Sparkles size={32} color="#F5C563" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          Batch Exporter: {recipients.length} Certificates
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px' }}>
          Generate and download all {recipients.length} copies at once!
        </p>
      </div>

      {/* Export Format Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => setExportType('zip')}
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: exportType === 'zip' ? 'rgba(42, 191, 164, 0.2)' : 'rgba(15, 23, 42, 0.5)',
            border: exportType === 'zip' ? '2px solid #2ABFA4' : '1px solid rgba(255,255,255,0.08)',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#ffffff',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Archive size={20} color="#2ABFA4" />
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>ZIP of Individual PNGs</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Download {recipients.length} separate high-resolution PNG image files in a single ZIP archive.
          </p>
        </button>

        <button
          onClick={() => setExportType('pdf')}
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: exportType === 'pdf' ? 'rgba(245, 197, 99, 0.2)' : 'rgba(15, 23, 42, 0.5)',
            border: exportType === 'pdf' ? '2px solid #F5C563' : '1px solid rgba(255,255,255,0.08)',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#ffffff',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileText size={20} color="#F5C563" />
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>Combined Multi-Page PDF</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Download a single print-ready PDF file with all {recipients.length} certificates on separate pages.
          </p>
        </button>
      </div>

      {/* Progress & Processing Panel */}
      {isProcessing && (
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(42, 191, 164, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: '#2ABFA4', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 className="animate-spin" size={16} /> Processing: <strong>{currentName}</strong>
            </span>
            <span style={{ fontWeight: '700', color: '#F5C563' }}>{progress}%</span>
          </div>

          <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(to right, #1A9E87, #2ABFA4, #F5C563)',
                transition: 'width 0.1s linear' 
              }} 
            />
          </div>
        </div>
      )}

      {/* Download Success Banner */}
      {downloadCompleted && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '16px', borderRadius: '12px', textAlign: 'center', color: '#34d399' }}>
          <CheckCircle2 size={24} style={{ marginBottom: '4px' }} />
          <p style={{ fontWeight: '600' }}>All {recipients.length} certificates generated and downloaded successfully!</p>
        </div>
      )}

      {/* Action Button */}
      <button 
        className="glass-btn btn-gold"
        onClick={handleStartBatchExport}
        disabled={isProcessing}
        style={{ padding: '16px', fontSize: '1.05rem', justifyContent: 'center', boxShadow: '0 8px 25px rgba(245, 197, 99, 0.3)' }}
      >
        {isProcessing ? (
          <> <Loader2 className="animate-spin" size={20} /> Generating {recipients.length} Certificates... </>
        ) : (
          <> <Play size={20} /> Start Bulk Generation & Download ({recipients.length} Copies) </>
        )}
      </button>

    </div>
  );
};
