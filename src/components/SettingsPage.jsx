import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [callForwarding, setCallForwarding] = useState(false);
  const [forwardingNumber, setForwardingNumber] = useState('');
  const [syncContacts, setSyncContacts] = useState(true);
  const [language, setLanguage] = useState('english');
  
  const languages = [
    { value: 'english', label: 'English' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'spanish', label: 'Spanish' }
  ];

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Account</h3>
        <div className="account-info">
          <div className="user-avatar">GA</div>
          <div className="user-details">
            <div className="user-name">Gabriel Albu</div>
            <div className="user-email">gabriel.albu@speer.com</div>
            <div className="user-plan">Premium Plan</div>
          </div>
        </div>
        <button className="settings-button">Edit Profile</button>
      </div>
      
      <div className="settings-section">
        <h3>Preferences</h3>
        
        <div className="settings-row">
          <div className="setting-info">
            <div className="setting-name">Notifications</div>
            <div className="setting-description">Receive incoming call notifications</div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="notifications" 
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <label htmlFor="notifications"></label>
          </div>
        </div>
        
        <div className="settings-row">
          <div className="setting-info">
            <div className="setting-name">Dark Mode</div>
            <div className="setting-description">Use dark theme</div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="darkMode" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <label htmlFor="darkMode"></label>
          </div>
        </div>
        
        <div className="settings-row">
          <div className="setting-info">
            <div className="setting-name">Sync Contacts</div>
            <div className="setting-description">Sync with device contacts</div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="syncContacts" 
              checked={syncContacts}
              onChange={() => setSyncContacts(!syncContacts)}
            />
            <label htmlFor="syncContacts"></label>
          </div>
        </div>
        
        <div className="settings-row">
          <div className="setting-info">
            <div className="setting-name">Language</div>
            <div className="setting-description">Select your preferred language</div>
          </div>
          <select 
            className="settings-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Call Settings</h3>
        
        <div className="settings-row">
          <div className="setting-info">
            <div className="setting-name">Call Forwarding</div>
            <div className="setting-description">Forward calls to another number</div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="callForwarding" 
              checked={callForwarding}
              onChange={() => setCallForwarding(!callForwarding)}
            />
            <label htmlFor="callForwarding"></label>
          </div>
        </div>
        
        {callForwarding && (
          <div className="settings-row forwarding-number">
            <input 
              type="text"
              placeholder="Enter forwarding number"
              value={forwardingNumber}
              onChange={(e) => setForwardingNumber(e.target.value)}
              className="settings-input"
            />
            <button className="settings-button save-btn">Save</button>
          </div>
        )}
      </div>
      
      <div className="settings-section">
        <h3>About</h3>
        <div className="settings-row about-row">
          <div className="setting-info">
            <div className="setting-name">Version</div>
          </div>
          <div className="setting-value">2.3.1</div>
        </div>
        
        <div className="settings-row about-row">
          <div className="setting-info">
            <div className="setting-name">Terms of Service</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        
        <div className="settings-row about-row">
          <div className="setting-info">
            <div className="setting-name">Privacy Policy</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
      
      <div className="settings-section">
        <button className="settings-button logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 