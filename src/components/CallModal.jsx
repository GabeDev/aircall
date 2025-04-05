import React, { useState, useEffect } from 'react';

const CallModal = ({ contact, onClose }) => {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, ringing, in-progress, ended
  const [callDuration, setCallDuration] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Simulate connection and ringing
    const connectTimeout = setTimeout(() => {
      setCallStatus('ringing');
      
      // Simulate call being answered after 2 seconds
      const answerTimeout = setTimeout(() => {
        setCallStatus('in-progress');
        
        // Start timer for call duration
        const callTimer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setTimer(callTimer);
      }, 2000);
      
      return () => clearTimeout(answerTimeout);
    }, 1000);
    
    return () => {
      clearTimeout(connectTimeout);
      if (timer) clearInterval(timer);
    };
  }, []);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleEndCall = () => {
    if (timer) clearInterval(timer);
    setCallStatus('ended');
    
    // Close the modal after showing "Call ended" for a brief moment
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        <div className="call-header">
          <div className="call-status">
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'ringing' && 'Ringing...'}
            {callStatus === 'in-progress' && 'Connected'}
            {callStatus === 'ended' && 'Call ended'}
          </div>
        </div>
        
        <div className="call-content">
          <div className="call-avatar">
            {contact.name ? contact.name.charAt(0).toUpperCase() : '#'}
          </div>
          <div className="call-name">{contact.name || 'Unknown'}</div>
          <div className="call-number">{contact.phone || contact.number}</div>
          
          {callStatus === 'in-progress' && (
            <div className="call-duration">{formatDuration(callDuration)}</div>
          )}
        </div>
        
        <div className="call-actions">
          <button className="call-action-btn mute">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            </svg>
            <span>Mute</span>
          </button>
          
          <button className="call-action-btn keypad">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            <span>Keypad</span>
          </button>
          
          <button className="call-action-btn speaker">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <span>Speaker</span>
          </button>
        </div>
        
        <button 
          className="end-call-btn"
          onClick={handleEndCall}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
            <line x1="23" y1="1" x2="1" y2="23"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CallModal; 