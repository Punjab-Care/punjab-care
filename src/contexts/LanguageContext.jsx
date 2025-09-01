import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    requestHelp: 'Request Help',
    helplineNumbers: 'Helpline Numbers',
    viewRequests: 'View Requests',
    myRequests: 'My Requests',
    backToHome: 'Back to Home',
    
    // Home Page
    welcome: 'Punjab Stands Together',
    welcomeMessage: 'Do you need help or want to help? Use the buttons below to request assistance or offer support!',
    getHelpNow: 'Get Help Now',
    viewHelplines: 'View Helplines',
    viewAllRequests: 'View All Requests',
    emergencyNotice: 'Emergency Notice',
    emergencyMessage: 'If you are in immediate danger, call emergency services first',
    footerText: 'Simple, mobile-focused layout for everyone',
    
    // Request Help Form
    name: 'Name',
    location: 'Location',
    contactNumber: 'Contact Number',
    typeOfHelp: 'Type of Help',
    description: 'Description',
    submit: 'Submit',
    getLocation: 'Get My Location',
    
    // Form Validation
    nameRequired: 'Name is required',
    locationRequired: 'Location is required',
    contactNumberRequired: 'Contact number is required',
    typeOfHelpRequired: 'Please select a type of help',
    descriptionRequired: 'Description is required',
    
    // Help Types
    medical: 'Medical',
    food: 'Food',
    shelter: 'Shelter',
    emergencyTransport: 'Emergency Transport',
    
    // Helpline Sections
    governmentHelplines: 'Government Helplines',
    ngoHelplines: 'NGO & Helping Groups',
    
    // District Selection
    selectDistrict: 'Select District',
    helplinesFor: 'Helplines for',
    selectDistrictToView: 'Please select a district to view helplines',
    selectDistrictMessage: 'Choose your district from the dropdown above to see available helplines',
    noHelplinesFound: 'No helplines found for this district',
    noHelplinesMessage: 'Please check back later or contact emergency services directly',
    government: 'Government',
    ngo: 'NGO',
    address: 'Address',
    availableHours: 'Available Hours',
    
    // Request Details
    clickToViewDetails: 'Click to View Details',
    loadMore: 'Load More',
    loadAll: 'Load All',
    noRequests: 'No requests found',
    
    // Status and Actions
    all: 'All',
    pending: 'Pending',
    completed: 'Completed',
    markCompleted: 'Mark Completed',
    completedAt: 'Completed At',
    updating: 'Updating...',
    
    // Error Handling
    errorLoading: 'Error loading data',
    retry: 'Retry',
    error: 'Error',
    permissionDenied: 'Permission denied. Please check your Firebase configuration.',
    serviceUnavailable: 'Service temporarily unavailable. Please try again later.',
    unauthenticated: 'Authentication required. Please refresh the page.',
    
    // Messages
    requestSubmitted: 'Request submitted successfully',
    errorSubmitting: 'Error submitting request',
    locationError: 'Error getting location. Please ensure location services are enabled and try again.',
    enablingGPS: 'Enabling GPS for better accuracy...',
    fetchingLocation: 'Fetching your location...',
    locationFetched: 'Location fetched successfully',
    lowAccuracyWarning: 'Warning: Low GPS accuracy. Try moving to an open area for better results.',
    locationPermissionDenied: 'Location permission denied. Please enable it in your browser settings.',
    locationUnavailable: 'Unable to retrieve location. Please check your device settings.',
    locationTimeout: 'Location request timed out. Please try again in an open area.',
    near: 'Near',
    accuracy: 'accuracy',
    loading: 'Loading...',
  },
  pa: {
    // Navigation
    requestHelp: 'ਸਹਾਇਤਾ ਲਈ ਬੇਨਤੀ',
    helplineNumbers: 'ਹੈਲਪਲਾਈਨ ਨੰਬਰ',
    viewRequests: 'ਬੇਨਤੀਆਂ ਦੇਖੋ',
    myRequests: 'ਮੇਰੀਆਂ ਬੇਨਤੀਆਂ',
    backToHome: 'ਹੋਮ ਪੇਜ ਤੇ ਵਾਪਸ',
    
    // Home Page
    welcome: 'ਪੰਜਾਬ ਇਕੱਠਾ ਖੜ੍ਹਾ ਹੈ',
    welcomeMessage: 'ਜੇ ਕਰ ਤੁਹਾਨੂੰ ਮਦਦ ਦੀ ਲੋੜ ਹੈ ਜਾਂ ਤੁਸੀਂ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ ਤਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨਾਂ ਰਾਹੀਂ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਜਾਂ ਪਹੁੰਚਾ ਸਕਦੇ ਹੋ !',
    getHelpNow: 'ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    viewHelplines: 'ਸੰਪਰਕ ਕਰਨ ਲਈ',
    viewAllRequests: 'ਸਾਰੀਆਂ ਬੇਨਤੀਆਂ ਦੇਖੋ',
    emergencyNotice: 'ਐਮਰਜੈਂਸੀ ਨੋਟਿਸ',
    emergencyMessage: 'ਜੇਕਰ ਤੁਸੀਂ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ, ਤਾਂ ਪਹਿਲਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ',
    footerText: 'ਸਭ ਲਈ ਸਰਲ, ਮੋਬਾਈਲ-ਕੇਂਦ੍ਰਿਤ ਲੇਆਊਟ',
    
    // Request Help Form
    name: 'ਨਾਮ',
    location: 'ਟਿਕਾਣਾ',
    contactNumber: 'ਸੰਪਰਕ ਨੰਬਰ',
    typeOfHelp: 'ਮਦਦ ਦੀ ਕਿਸਮ',
    description: 'ਵੇਰਵਾ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    getLocation: 'ਮੇਰਾ ਟਿਕਾਣਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    
    // Form Validation
    nameRequired: 'ਨਾਮ ਲੋੜੀਂਦਾ ਹੈ',
    locationRequired: 'ਟਿਕਾਣਾ ਲੋੜੀਂਦਾ ਹੈ',
    contactNumberRequired: 'ਸੰਪਰਕ ਨੰਬਰ ਲੋੜੀਂਦਾ ਹੈ',
    typeOfHelpRequired: 'ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਦੀ ਕਿਸਮ ਚੁਣੋ',
    descriptionRequired: 'ਵੇਰਵਾ ਲੋੜੀਂਦਾ ਹੈ',
    
    // Help Types
    medical: 'ਮੈਡੀਕਲ',
    food: 'ਭੋਜਨ',
    shelter: 'ਆਸਰਾ',
    emergencyTransport: 'ਐਮਰਜੈਂਸੀ ਟ੍ਰਾਂਸਪੋਰਟ',
    
    // Helpline Sections
    governmentHelplines: 'ਸਰਕਾਰੀ ਹੈਲਪਲਾਈਨ',
    ngoHelplines: 'ਐਨਜੀਓ ਅਤੇ ਮਦਦ ਕਰਨ ਵਾਲੇ ਗਰੁੱਪ',
    
    // District Selection
    selectDistrict: 'ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    helplinesFor: 'ਹੈਲਪਲਾਈਨ',
    selectDistrictToView: 'ਹੈਲਪਲਾਈਨ ਦੇਖਣ ਲਈ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    selectDistrictMessage: 'ਉਪਲਬਧ ਹੈਲਪਲਾਈਨ ਦੇਖਣ ਲਈ ਉੱਪਰ ਦੇ ਡ੍ਰੌਪਡਾਊਨ ਤੋਂ ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    noHelplinesFound: 'ਇਸ ਜ਼ਿਲ੍ਹੇ ਲਈ ਕੋਈ ਹੈਲਪਲਾਈਨ ਨਹੀਂ ਮਿਲੀ',
    noHelplinesMessage: 'ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਚੈਕ ਕਰੋ ਜਾਂ ਸਿੱਧੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਸੰਪਰਕ ਕਰੋ',
    government: 'ਸਰਕਾਰੀ',
    ngo: 'ਐਨਜੀਓ',
    address: 'ਪਤਾ',
    availableHours: 'ਉਪਲਬਧ ਘੰਟੇ',
    
    // Request Details
    clickToViewDetails: 'ਵੇਰਵੇ ਦੇਖਣ ਲਈ ਕਲਿਕ ਕਰੋ',
    loadMore: 'ਹੋਰ ਲੋਡ ਕਰੋ',
    loadAll: 'ਸਭ ਲੋਡ ਕਰੋ',
    noRequests: 'ਕੋਈ ਬੇਨਤੀ ਨਹੀਂ ਮਿਲੀ',
    
    // Status and Actions
    all: 'ਸਭ',
    pending: 'ਬਕਾਇਆ',
    completed: 'ਪੂਰਾ ਹੋਇਆ',
    markCompleted: 'ਪੂਰਾ ਕਰੋ',
    completedAt: 'ਪੂਰਾ ਹੋਇਆ',
    updating: 'ਅਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...',
    
    // Error Handling
    errorLoading: 'ਡੇਟਾ ਲੋਡ ਕਰਨ ਵਿੱਚ ਗਲਤੀ',
    retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    error: 'ਗਲਤੀ',
    permissionDenied: 'ਅਧਿਕਾਰ ਤੋਂ ਇਨਕਾਰ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ Firebase ਕਨਫਿਗਰੇਸ਼ਨ ਚੈਕ ਕਰੋ।',
    serviceUnavailable: 'ਸੇਵਾ ਅਸਥਾਈ ਤੌਰ ਤੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    unauthenticated: 'ਪ੍ਰਮਾਣੀਕਰਨ ਲੋੜੀਂਦਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪੇਜ ਨੂੰ ਰੀਫ੍ਰੈਸ਼ ਕਰੋ।',
    
    // Messages
    requestSubmitted: 'ਬੇਨਤੀ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਕੀਤੀ ਗਈ ਹੈ',
    errorSubmitting: 'ਬੇਨਤੀ ਜਮ੍ਹਾਂ ਕਰਨ ਵਿੱਚ ਤਰੁਟੀ',
    locationError: 'ਸਥਾਨ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ. ਕਿਰਪਾ ਕਰਕੇ ਪੱਕਾ ਕਰੋ ਕਿ ਲੋਕੇਸ਼ਨ ਸਰਵਿਸਾਂ ਚਾਲੂ ਹਨ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    enablingGPS: 'ਬਿਹਤਰ ਸ਼ੁੱਧਤਾ ਲਈ GPS ਚਾਲੂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    fetchingLocation: 'ਤੁਹਾਡਾ ਸਥਾਨ ਪ੍ਰਾਪਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    locationFetched: 'ਸਥਾਨ ਸਫਲਤਾਪੂਰਵਕ ਪ੍ਰਾਪਤ ਕੀਤਾ ਗਿਆ',
    lowAccuracyWarning: 'ਚੇਤਾਵਨੀ: GPS ਸ਼ੁੱਧਤਾ ਘੱਟ ਹੈ। ਬਿਹਤਰ ਨਤੀਜਿਆਂ ਲਈ ਖੁੱਲ੍ਹੇ ਖੇਤਰ ਵਿੱਚ ਜਾਓ।',
    locationPermissionDenied: 'ਸਥਾਨ ਦੀ ਪਰਮਿਸ਼ਨ ਨਾਕਾਰਾ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਜ਼ ਵਿੱਚ ਇਸਨੂੰ ਚਾਲੂ ਕਰੋ।',
    locationUnavailable: 'ਸਥਾਨ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਡਿਵਾਈਸ ਸੈਟਿੰਗਜ਼ ਦੀ ਜਾਂਚ ਕਰੋ।',
    locationTimeout: 'ਸਥਾਨ ਦੀ ਬੇਨਤੀ ਦਾ ਸਮਾਂ ਸਮਾਪਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਖੁੱਲ੍ਹੇ ਖੇਤਰ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    near: 'ਨੇੜੇ',
    accuracy: 'ਸ਼ੁੱਧਤਾ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    gpsEnabled: 'ਜੀਪੀਐਸ ਚਾਲੂ ਕੀਤਾ ਗਿਆ',
    gpsDisabled: 'ਜੀਪੀਐਸ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ',
    locationServicesEnabled: 'ਲੋਕੇਸ਼ਨ ਸਰਵਿਸਾਂ ਚਾਲੂ ਕੀਤੀਆਂ ਗਈਆਂ',
    locationServicesDisabled: 'ਲੋਕੇਸ਼ਨ ਸਰਵਿਸਾਂ ਬੰਦ ਕਰ ਦਿੱਤੀਆਂ ਗਈਆਂ',
    highAccuracy: 'ਉੱਚ ਸ਼ੁੱਧਤਾ',
    mediumAccuracy: 'ਮੱਧਮ ਸ਼ੁੱਧਤਾ',
    lowAccuracy: 'ਘੱਟ ਸ਼ੁੱਧਤਾ',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pa' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
