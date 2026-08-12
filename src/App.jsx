import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { VisualEditor } from './components/VisualEditor';
import { RecipientManager } from './components/RecipientManager';
import { BatchExporter } from './components/BatchExporter';
import { LandingPage } from './components/LandingPage';
import { HowToUse } from './components/HowToUse';

const defaultFieldStyle = (index, total) => ({
  enabled: true,
  x: 50,
  y: 30 + (index * (50 / Math.max(total, 1))),
  fontSize: index === 0 ? 56 : 24,
  fontFamily: index === 0 ? 'Playfair Display' : 'Montserrat',
  color: index === 0 ? '#0f172a' : '#334155',
  align: 'center',
  fontWeight: index === 0 ? '700' : '600',
  isUppercase: false
});

export function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('app');
  const [activeTab, setActiveTab] = useState('recipients');
  const [templateDataUrl, setTemplateDataUrl] = useState(null);
  const [fields, setFields] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipientIdx, setSelectedRecipientIdx] = useState(0);
  const [mappedColumns, setMappedColumns] = useState([]);

  // Called by RecipientManager when columns are applied
  const handleColumnsApplied = useCallback((columns) => {
    setMappedColumns(columns);
    
    if (columns.length === 0) {
      setFields([]);
      return;
    }

    // Generate a field for each selected column
    const newFields = columns.map((col, index) => ({
      id: col,
      label: col,
      ...defaultFieldStyle(index, columns.length)
    }));

    setFields(newFields);
  }, []);

  // Landing page
  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={() => setShowLanding(false)} 
        onNavigateHowToUse={() => { setShowLanding(false); setCurrentPage('howToUse'); }} 
      />
    );
  }

  if (currentPage === 'howToUse') {
    return <HowToUse onBack={() => setCurrentPage('app')} />;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 20px 40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        recipientCount={recipients.length}
        onOpenHowToUse={() => setCurrentPage('howToUse')}
      />

      <main className="animate-fade">
        {activeTab === 'recipients' && (
          <RecipientManager 
            recipients={recipients}
            setRecipients={setRecipients}
            setSelectedRecipientIdx={setSelectedRecipientIdx}
            onColumnsApplied={handleColumnsApplied}
            mappedColumns={mappedColumns}
          />
        )}

        {activeTab === 'editor' && (
          <VisualEditor 
            templateDataUrl={templateDataUrl}
            setTemplateDataUrl={setTemplateDataUrl}
            fields={fields}
            setFields={setFields}
            recipients={recipients}
            selectedRecipientIdx={selectedRecipientIdx}
            setSelectedRecipientIdx={setSelectedRecipientIdx}
          />
        )}

        {activeTab === 'export' && (
          <BatchExporter 
            templateDataUrl={templateDataUrl}
            fields={fields}
            recipients={recipients}
          />
        )}
      </main>
    </div>
  );
}

export default App;
