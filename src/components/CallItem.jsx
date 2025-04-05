import React from 'react';

const CallItem = ({ call, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCallIcon = () => {
    switch (call.call_type) {
      case 'missed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="call-missed">
            <polyline points="22 6 13.5 14.5 8.5 9.5 2 16"></polyline>
            <polyline points="16 6 22 6 22 12"></polyline>
          </svg>
        );
      case 'answered':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="call-answered">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        );
      case 'voicemail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="call-voicemail">
            <circle cx="6" cy="12" r="4"></circle>
            <circle cx="18" cy="12" r="4"></circle>
            <line x1="6" y1="16" x2="18" y2="16"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  const getCallTypeText = () => {
    const direction = call.direction === 'inbound' ? 'from' : 'to';
    let recipient = call.direction === 'inbound' ? call.from : call.to;
    
    // Make sure recipient is a string and not null/undefined
    recipient = typeof recipient === 'string' ? recipient : '';
    
    // Remove country code for cleaner display
    if (recipient && recipient.startsWith('+')) {
      recipient = recipient.substring(recipient.indexOf(' ') + 1);
    }
    
    return `${call.call_type} call ${direction} ${recipient}`;
  };

  return (
    <div className="activity-item" onClick={() => onClick(call.id)}>
      <div className="activity-icon">
        {getCallIcon()}
      </div>
      <div className="activity-info">
        <div className="activity-number">
          {call.from || 'Unknown'}
        </div>
        <div className="activity-type">
          {getCallTypeText()}
        </div>
      </div>
      <div className="activity-time">
        {formatDate(call.created_at)}
      </div>
    </div>
  );
};

export default CallItem; 