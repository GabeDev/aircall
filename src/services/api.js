import axios from 'axios';

const BASE_URL = 'https://aircall-api.onrender.com';

const api = {
  // Get all activities
  getActivities: () => {
    return axios.get(`${BASE_URL}/activities`);
  },
  
  // Get a specific call details
  getActivityDetails: (callId) => {
    return axios.get(`${BASE_URL}/activities/${callId}`);
  },
  
  // Update a call (archive/unarchive)
  updateActivity: (callId, isArchived) => {
    return axios.patch(`${BASE_URL}/activities/${callId}`, {
      is_archived: isArchived
    });
  },
  
  // Reset all calls to initial state
  resetActivities: () => {
    return axios.patch(`${BASE_URL}/reset`);
  }
};

export default api; 