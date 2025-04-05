import React, { useState, useEffect } from 'react';
import CallModal from './CallModal.jsx';
import api from '../services/api';
import contactsService from '../services/contacts';

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to generate a random name
  const generateRandomName = () => {
    const firstNames = [
      'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 
      'Linda', 'William', 'Elizabeth', 'David', 'Susan', 'Joseph', 'Jessica', 
      'Charles', 'Sarah', 'Thomas', 'Karen', 'Daniel', 'Nancy'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 
      'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 
      'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
    ];
    
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirst} ${randomLast}`;
  };
  
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get activities from API and transform them into contacts
      const response = await api.getActivities();
      console.log('API Response:', response);
      
      // Transform API data into contacts format
      const contactsMap = new Map();
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Processing', response.data.length, 'records');
        
        // First collect all unique IDs from both from and to fields
        response.data.forEach(call => {
          const fromId = call.from;
          const toId = call.to;
          
          // Create entry for 'from' ID if it doesn't exist
          if (fromId && !contactsMap.has(fromId)) {
            contactsMap.set(fromId, contactsService.getContactForId(fromId));
          }
          
          // Create entry for 'to' ID if it doesn't exist
          if (toId && !contactsMap.has(toId)) {
            contactsMap.set(toId, contactsService.getContactForId(toId));
          }
        });
      }
      
      const contactsList = Array.from(contactsMap.values());
      console.log('Generated contacts:', contactsList);
      setContacts(contactsList);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Unable to load contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredContacts = contacts.filter(contact => 
    (contact.name && typeof contact.name === 'string' && contact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchQuery)) ||
    (contact.company && typeof contact.company === 'string' && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCall = (contact) => {
    try {
      if (contact && typeof contact === 'object') {
        setActiveCall(contact);
      } else {
        console.error('Invalid contact object:', contact);
      }
    } catch (err) {
      console.error('Error handling call:', err);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="contacts-page">
      <div className="search-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search contacts" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="clear-search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading contacts...</div>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button 
            className="settings-button"
            onClick={fetchContacts}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="contacts-list">
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              contact && contact.id ? (
                <div key={contact.id} className="contact-item">
                  <div className="contact-avatar">
                    {typeof contact.name === 'string' ? contact.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.name || 'Unknown'}
                      {contact.favorite && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="favorite-icon">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      )}
                    </div>
                    <div className="contact-phone">{contact.phone || 'No phone number'}</div>
                    {contact.email && <div className="contact-email">{contact.email}</div>}
                    {contact.company && <div className="contact-company">{contact.company}</div>}
                  </div>
                  <div className="contact-actions">
                    <button className="contact-call-btn" onClick={() => handleCall(contact)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AC420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null
            ))
          ) : (
            <div className="no-contacts">
              <p>No contacts found</p>
            </div>
          )}
        </div>
      )}
      
      <button className="add-contact-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {activeCall && <CallModal contact={activeCall} onClose={handleEndCall} />}
    </div>
  );
};

export default ContactsPage; 