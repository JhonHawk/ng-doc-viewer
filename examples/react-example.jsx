/**
 * React Example for Universal Document Viewer
 *
 * Usage:
 * 1. Install: npm install universal-doc-viewer
 * 2. Import and use the component as shown below
 */

import React, { useEffect, useRef, useState } from 'react';
import { DocumentViewer } from 'universal-doc-viewer';

function DocumentViewerComponent({ url, type, height = '600px' }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create viewer instance
      viewerRef.current = new DocumentViewer({
        container: containerRef.current,
        url: url,
        type: type,
        height: height,
        onLoad: () => {
          setLoading(false);
          setError(null);
        },
        onError: (err) => {
          setLoading(false);
          setError(err.message);
        }
      });

      // Render the document
      viewerRef.current.render();
    }

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [url, type, height]);

  return (
    <div>
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffe6e6' }}>
          Error: {error}
        </div>
      )}
      <div ref={containerRef}></div>
    </div>
  );
}

// Example App Component
function App() {
  const [documentUrl, setDocumentUrl] = useState('https://pdfobject.com/pdf/sample.pdf');
  const [documentType, setDocumentType] = useState('pdf');

  const documents = [
    { name: 'Sample PDF', url: 'https://pdfobject.com/pdf/sample.pdf', type: 'pdf' },
    { name: 'Sample Image', url: 'https://download.samplelib.com/png/sample-boat-400x300.png', type: 'png' },
    { name: 'Sample Text', url: 'https://example-files.online-convert.com/document/txt/example.txt', type: 'txt' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Universal Document Viewer - React Example</h1>

      <div style={{ marginBottom: '20px' }}>
        {documents.map((doc) => (
          <button
            key={doc.url}
            onClick={() => {
              setDocumentUrl(doc.url);
              setDocumentType(doc.type);
            }}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            {doc.name}
          </button>
        ))}
      </div>

      <DocumentViewerComponent
        url={documentUrl}
        type={documentType}
        height="700px"
      />
    </div>
  );
}

export default App;
