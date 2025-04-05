import React, { useState } from 'react';
import CallModal from './CallModal.jsx';

const DialPad = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeCall, setActiveCall] = useState(null);

  const handleKeyPress = (key) => {
    setPhoneNumber(prevNumber => prevNumber + key);
  };

  const handleDelete = () => {
    setPhoneNumber(prevNumber => prevNumber.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneNumber) {
      setActiveCall({
        number: phoneNumber,
        name: 'Custom Number'
      });
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="dialpad-container">
      <h2>New Call</h2>
      
      <div className="phone-display">
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          className="phone-input"
        />
        {phoneNumber && (
          <button className="delete-btn" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <line x1="18" y1="9" x2="12" y2="15"></line>
              <line x1="12" y1="9" x2="18" y2="15"></line>
            </svg>
          </button>
        )}
      </div>
      
      <div className="dialpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(key => (
          <button 
            key={key} 
            className="dialpad-key"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      
      <button 
        className={`call-button ${phoneNumber ? 'active' : ''}`}
        disabled={!phoneNumber}
        onClick={handleCall}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </button>

      {activeCall && <CallModal contact={activeCall} onClose={handleEndCall} />}
    </div>
  );
};

export default DialPad; 