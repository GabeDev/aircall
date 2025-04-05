import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Header.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ActivityDetail from './components/ActivityDetail.jsx';
import ContactsPage from './components/ContactsPage.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import DialPad from './components/DialPad.jsx';
import BottomNavbar from './components/BottomNavbar.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './css/activity.css';
import './css/navbar.css';
import './css/dialpad.css';
import './css/pages.css';
import './css/call-modal.css';
import './css/theme.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className='container'>
          <Header/>
          <div className="container-view">
            <Routes>
              <Route path="/" element={<ActivityFeed />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/dial" element={<DialPad />} />
            </Routes>
          </div>
          <BottomNavbar />
        </div>
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
