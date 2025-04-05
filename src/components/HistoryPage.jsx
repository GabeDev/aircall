import React, { useState, useEffect } from 'react';
import CallModal from './CallModal.jsx';
import api from '../services/api';
import contactsService from '../services/contacts';

const HistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCallHistory();
  }, []);
  
  const fetchCallHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getActivities();
      setCallHistory(response.data);
    } catch (err) {
      console.error('Error fetching call history:', err);
      setError('Unable to load call history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCalls = callHistory.filter(call => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'missed') return call.call_type === 'missed';
    if (activeFilter === 'incoming') return call.direction === 'inbound';
    if (activeFilter === 'outgoing') return call.direction === 'outbound';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
      `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getCallIcon = (direction, callType) => {
    if (callType === 'missed') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 6 13.5 14.5 8.5 9.5 2 16"></polyline>
          <polyline points="16 6 22 6 22 12"></polyline>
        </svg>
      );
    }
    
    if (callType === 'voicemail') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="12" r="4"></circle>
          <circle cx="18" cy="12" r="4"></circle>
          <line x1="6" y1="16" x2="18" y2="16"></line>
        </svg>
      );
    }
    
    if (direction === 'inbound') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AC420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 20 10 4 8 12 2 12"></polyline>
        </svg>
      );
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AC420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 12 23 12 23 18"></polyline>
        <line x1="23" y1="12" x2="17" y2="18"></line>
        <path d="M10 5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
      </svg>
    );
  };

  const getContactName = (id) => {
    const contact = contactsService.getContactForId(id);
    return contact.name;
  };
  
  const getContactPhone = (id) => {
    const contact = contactsService.getContactForId(id);
    return contact.phone;
  };

  const handleCall = (call) => {
    try {
      const contact = {
        name: getContactName(call.from),
        number: getContactPhone(call.to),
        phone: getContactPhone(call.from)
      };
      setActiveCall(contact);
    } catch (err) {
      console.error('Error handling call:', err);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleClearHistory = async () => {
    try {
      await api.resetActivities();
      fetchCallHistory();
    } catch (err) {
      console.error('Error clearing call history:', err);
      setError('Unable to clear call history. Please try again later.');
    }
  };

  return (
    <div className="history-page">
      <div className="history-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'missed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('missed')}
        >
          Missed
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveFilter('incoming')}
        >
          Incoming
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveFilter('outgoing')}
        >
          Outgoing
        </button>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading call history...</div>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button 
            className="settings-button"
            onClick={fetchCallHistory}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filteredCalls.length > 0 ? (
            filteredCalls.map(call => (
              <div key={call.id} className={`history-item ${call.call_type}`}>
                <div className="history-icon">
                  {getCallIcon(call.direction, call.call_type)}
                </div>
                <div className="history-info">
                  <div className="history-name">{getContactName(call.from)}</div>
                  <div className="history-number">{getContactPhone(call.to)}</div>
                </div>
                <div className="history-details">
                  <div className="history-time">{formatDate(call.created_at)}</div>
                  {call.duration > 0 && (
                    <div className="history-duration">{formatDuration(call.duration)}</div>
                  )}
                </div>
                <button className="history-call-btn" onClick={() => handleCall(call)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AC420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="no-history">
              <p>No call history found</p>
            </div>
          )}
        </div>
      )}
      
      {activeCall && <CallModal contact={activeCall} onClose={handleEndCall} />}
    </div>
  );
};

export default HistoryPage; 