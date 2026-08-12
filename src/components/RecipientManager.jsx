import React, { useState, useRef } from 'react';
import { Users, FileSpreadsheet, Plus, Trash2, Search, Columns, Check, X, Upload, Eye } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const RecipientManager = ({ recipients, setRecipients, setSelectedRecipientIdx, onColumnsApplied, mappedColumns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // Raw data state for column mapping
  const [rawData, setRawData] = useState(null);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [showMapper, setShowMapper] = useState(false);
  const [fileName, setFileName] = useState('');

  // Parse uploaded file
  const handleSpreadsheetUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const fileExt = file.name.split('.').pop().toLowerCase();
    let jsonData = [];

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      } catch (err) {
        alert('Failed to parse Excel file.');
        return;
      }
    } else {
      const text = await file.text();
      const results = Papa.parse(text, { header: true, skipEmptyLines: true });
      jsonData = results.data || [];
    }

    if (!jsonData || jsonData.length === 0) {
      alert('No data found in file.');
      return;
    }

    const columns = Object.keys(jsonData[0]);
    setRawData(jsonData);
    setAllColumns(columns);
    // Select all columns by default
    setSelectedColumns(new Set(columns));
    setShowMapper(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleColumn = (col) => {
    setSelectedColumns(prev => {
      const next = new Set(prev);
      if (next.has(col)) {
        if (next.size <= 1) return prev; // must keep at least 1
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  };

  // Apply mapping
  const applyMapping = () => {
    if (!rawData || selectedColumns.size === 0) return;

    const cols = allColumns.filter(c => selectedColumns.has(c));
    
    const parsed = rawData.map((row, index) => {
      const entry = { id: index + 1 };
      cols.forEach(col => {
        entry[col] = String(row[col] ?? '').trim();
      });
      return entry;
    });

    setRecipients(parsed);
    setSelectedRecipientIdx(0);
    setShowMapper(false);

    // Tell App which columns were selected so it can create fields
    if (onColumnsApplied) {
      onColumnsApplied(cols);
    }
  };

  const handleDeleteSingle = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Clear all entries?')) {
      setRecipients([]);
      setRawData(null);
      setShowMapper(false);
      if (onColumnsApplied) onColumnsApplied([]);
    }
  };

  // The display columns for the table come from mappedColumns prop
  const displayCols = mappedColumns || [];

  const filteredRecipients = recipients.filter(r => {
    const term = searchTerm.toLowerCase();
    return displayCols.some(col => String(r[col] || '').toLowerCase().includes(term));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Upload Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: showMapper ? '20px' : 0 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={20} color="#2ABFA4" /> Import Data
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              {recipients.length > 0
                ? <><strong style={{ color: '#F5C563' }}>{recipients.length}</strong> recipients loaded{fileName ? ` from ${fileName}` : ''} with <strong style={{ color: '#2ABFA4' }}>{displayCols.length} fields</strong> per certificate</>
                : 'Upload an Excel (.xlsx) or CSV file to get started'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleSpreadsheetUpload} style={{ display: 'none' }} />
            <button className="glass-btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ fontWeight: 600 }}>
              <Upload size={16} /> Upload Excel / CSV
            </button>
            {recipients.length > 0 && (
              <button className="glass-btn" onClick={handleClearAll} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                <Trash2 size={16} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Column Mapper */}
        {showMapper && rawData && (
          <div style={{ background: 'rgba(42,191,164,0.06)', border: '1px solid rgba(42,191,164,0.2)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Columns size={18} color="#2ABFA4" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
                Select Columns for Certificate
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              {rawData.length} rows, {allColumns.length} columns detected. Toggle which columns to include on certificates:
            </p>

            {/* Column chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {allColumns.map(col => {
                const isSelected = selectedColumns.has(col);
                return (
                  <button
                    key={col}
                    onClick={() => toggleColumn(col)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'all 0.2s',
                      background: isSelected ? 'rgba(42,191,164,0.15)' : 'rgba(239,68,68,0.08)',
                      border: isSelected ? '1px solid rgba(42,191,164,0.4)' : '1px solid rgba(239,68,68,0.25)',
                      color: isSelected ? '#2ABFA4' : '#ef4444',
                      textDecoration: isSelected ? 'none' : 'line-through',
                      opacity: isSelected ? 1 : 0.5
                    }}
                  >
                    {isSelected ? <Check size={14} /> : <X size={14} />}
                    {col}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
              <strong style={{ color: '#2ABFA4' }}>{selectedColumns.size}</strong> column{selectedColumns.size !== 1 ? 's' : ''} selected — each will appear as a positionable text field on your certificate
            </p>

            {/* Preview */}
            {selectedColumns.size > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} /> Preview (first 3 entries):
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {rawData.slice(0, 3).map((row, i) => (
                    <div key={i} style={{
                      padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', gap: '16px', flexWrap: 'wrap'
                    }}>
                      {allColumns.filter(c => selectedColumns.has(c)).map((col, j) => (
                        <span key={j} style={{ color: j === 0 ? '#2ABFA4' : '#F5C563' }}>
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{col}: </span>
                          {row[col] || '—'}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="glass-btn" onClick={() => setShowMapper(false)} style={{ fontSize: '0.85rem' }}>Cancel</button>
              <button
                className="glass-btn btn-primary"
                onClick={applyMapping}
                disabled={selectedColumns.size === 0}
                style={{ fontSize: '0.85rem', fontWeight: 600, opacity: selectedColumns.size > 0 ? 1 : 0.5 }}
              >
                <Check size={16} /> Apply & Load {rawData.length} Recipients ({selectedColumns.size} fields)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Users size={18} color="#2ABFA4" /> Recipient List
        </h3>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '36px' }} />
        </div>

        {/* Dynamic Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                {displayCols.map(col => (
                  <th key={col}>{col}</th>
                ))}
                <th style={{ textAlign: 'right', width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((rec, idx) => (
                  <tr key={rec.id || idx}>
                    <td style={{ color: '#64748b' }}>{idx + 1}</td>
                    {displayCols.map((col, ci) => (
                      <td key={col} style={{ fontWeight: ci === 0 ? 600 : 400, color: ci === 0 ? '#f8fafc' : '#cbd5e1' }}>
                        {rec[col] || '—'}
                      </td>
                    ))}
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteSingle(rec.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={displayCols.length + 2} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    {recipients.length === 0 ? 'No data loaded. Upload a file above.' : 'No results match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
