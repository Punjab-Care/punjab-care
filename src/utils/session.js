export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getSessionId = () => {
  let sessionId = localStorage.getItem('floodReliefSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('floodReliefSessionId', sessionId);
  }
  return sessionId;
};

export const clearSessionId = () => {
  localStorage.removeItem('floodReliefSessionId');
};
