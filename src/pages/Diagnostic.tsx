import React from 'react';
import { Link } from 'react-router-dom';

const Diagnostic = () => {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ color: '#9D5A8F', marginTop: 0 }}>Healthify Diagnostic Page</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>App Status</h2>
          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>Rendering:</strong> Working ✅</p>
            <p><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>React Router:</strong> {typeof Link !== 'undefined' ? 'Working ✅' : 'Not working ❌'}</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Navigation Links</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><Link to="/" style={{ color: '#9D5A8F' }}>Home Page</Link></li>
            <li style={{ marginBottom: '8px' }}><Link to="/login" style={{ color: '#9D5A8F' }}>Login Page</Link></li>
            <li style={{ marginBottom: '8px' }}><Link to="/register" style={{ color: '#9D5A8F' }}>Register Page</Link></li>
            <li style={{ marginBottom: '8px' }}><Link to="/splash" style={{ color: '#9D5A8F' }}>Splash Screen</Link></li>
            <li style={{ marginBottom: '8px' }}><Link to="/dashboard" style={{ color: '#9D5A8F' }}>Dashboard (requires auth)</Link></li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Local Storage Status</h2>
          <button 
            onClick={() => {
              const items = {};
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                items[key] = localStorage.getItem(key);
              }
              alert(JSON.stringify(items, null, 2));
            }}
            style={{
              background: '#9D5A8F',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Show Local Storage
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              alert('Local storage cleared!');
            }}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear Local Storage
          </button>
        </div>
        
        <div>
          <h2>System Information</h2>
          <button 
            onClick={() => {
              alert(JSON.stringify({
                url: window.location.href,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                performance: {
                  memory: 'memory' in performance ? 'Available' : 'Not available',
                  timing: 'timing' in performance ? 'Available' : 'Not available'
                }
              }, null, 2));
            }}
            style={{
              background: '#2E7D32',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Show System Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diagnostic; 