import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ActivityDetail = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  const fetchActivityDetails = async (isRetry = false) => {
    setLoading(true);
    setError(null);
    
    if (isRetry) {
      setRetrying(true);
    }
    
    try {
      const response = await api.getActivityDetails(id);
      setActivity(response.data);
      setError(null);
      setRetrying(false);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      setError('Unable to load call details. The server might be starting up.');
      setRetrying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchActivityDetails(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleArchive = async () => {
    try {
      await api.updateActivity(id, !activity.is_archived);
      setActivity({
        ...activity,
        is_archived: !activity.is_archived
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      setError('Error updating call. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        {retrying && <div className="loading-text">Connecting to API server, this may take up to 60 seconds...</div>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <p className="error-info">The API server may be waking up (can take 30-60 seconds).</p>
        <button 
          className="archive-button" 
          onClick={handleRetry}
        >
          Retry Connection
        </button>
        <button 
          className="back-button" 
          onClick={handleGoBack}
          style={{ marginTop: '15px', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to calls
        </button>
      </div>
    );
  }

  if (!activity) {
    return <div className="no-activities">Call not found</div>;
  }

  return (
    <div className="activity-detail">
      <button className="back-button" onClick={handleGoBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to calls
      </button>

      <div className="activity-detail-header">
        <div className="activity-detail-title">
          Call Details
        </div>
        <div className="activity-detail-actions">
          <button 
            className="archive-button" 
            onClick={handleToggleArchive}
          >
            {activity.is_archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      </div>

      <div className="activity-detail-content">
        <div className="activity-detail-item">
          <div className="activity-detail-label">From</div>
          <div className="activity-detail-value">{activity.from}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">To</div>
          <div className="activity-detail-value">{activity.to}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">Via</div>
          <div className="activity-detail-value">{activity.via}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">Direction</div>
          <div className="activity-detail-value">{activity.direction}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">Call Type</div>
          <div className="activity-detail-value">{activity.call_type}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">Duration</div>
          <div className="activity-detail-value">{formatDuration(activity.duration)}</div>
        </div>

        <div className="activity-detail-item">
          <div className="activity-detail-label">Time</div>
          <div className="activity-detail-value">{formatDate(activity.created_at)}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail; 