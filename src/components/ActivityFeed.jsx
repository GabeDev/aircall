import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CallItem from './CallItem.jsx';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, activeTab]);

  const fetchActivities = async (isRetry = false) => {
    setLoading(true);
    setError(null);
    
    if (isRetry) {
      setRetrying(true);
    }
    
    try {
      const response = await api.getActivities();
      setActivities(response.data);
      setError(null);
      setRetrying(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Unable to load activities. The server might be starting up.');
      setRetrying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchActivities(true);
  };

  const filterActivities = () => {
    if (activeTab === 'all') {
      setFilteredActivities(activities.filter(activity => !activity.is_archived));
    } else {
      setFilteredActivities(activities.filter(activity => activity.is_archived));
    }
  };

  const handleViewActivity = (id) => {
    navigate(`/activity/${id}`);
  };

  const handleArchiveAll = async () => {
    setLoading(true);
    try {
      const promises = filteredActivities.map(activity => 
        api.updateActivity(activity.id, true)
      );
      await Promise.all(promises);
      await fetchActivities();
    } catch (error) {
      console.error('Error archiving activities:', error);
      setError('Error archiving activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchiveAll = async () => {
    setLoading(true);
    try {
      const promises = filteredActivities.map(activity => 
        api.updateActivity(activity.id, false)
      );
      await Promise.all(promises);
      await fetchActivities();
    } catch (error) {
      console.error('Error unarchiving activities:', error);
      setError('Error unarchiving activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-container">
      <div className="activity-tabs">
        <div 
          className={`activity-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Inbox
        </div>
        <div 
          className={`activity-tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          {retrying && <div className="loading-text">Connecting to API server, this may take up to 60 seconds...</div>}
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <p className="error-info">The API server may be waking up (can take 30-60 seconds).</p>
          <button 
            className="archive-button" 
            onClick={handleRetry}
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {filteredActivities.length > 0 ? (
            <>
              <div className="archive-actions">
                {activeTab === 'all' ? (
                  <button 
                    className="archive-button" 
                    onClick={handleArchiveAll}
                  >
                    Archive all calls
                  </button>
                ) : (
                  <button 
                    className="archive-button" 
                    onClick={handleUnarchiveAll}
                  >
                    Unarchive all calls
                  </button>
                )}
              </div>
              <div className="activity-list">
                {filteredActivities.map(activity => (
                  <CallItem 
                    key={activity.id} 
                    call={activity} 
                    onClick={handleViewActivity}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-activities">
              {activeTab === 'all' 
                ? 'No calls in inbox' 
                : 'No archived calls'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityFeed; 