import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  en: {
    appTitle: "Punjab Care",
    // Navigation
    requestHelp: "Request Help",
    helplineNumbers: "Helpline Numbers",
    viewRequests: "View Requests",
    myRequests: "My Requests",
    backToHome: "Back to Home",

    // Home Page
    welcome: "Punjab Stands Together",
    welcomeMessage:
      "Do you need help or want to help? Use the buttons below to request assistance or offer support!",
    getHelpNow: "Get Help Now!",
    viewHelplines: "View Helplines",
    viewAllRequests: "View All Requests",
    emergencyNotice: "Emergency Notice",
    emergencyMessage:
      "If you are in immediate danger, call emergency services first",
    footerText: "Simple, mobile-focused layout for everyone",

    // About Us
    AboutUs: {
      title: "About Us",
      description:
        "We are a group of students from Punjab who started this initiative to contribute through our education and efforts. This app is built for flood relief — where people in need can request help and others can step forward to support. As the youth of Punjab, we stand with our motherland in every situation.",
      contact: "Connect with us: punjabcare25@gmail.com",
    },

    // Request Help Form
    name: "Name",
    location: "Location",
    contactNumber: "Contact Number",
    typeOfHelp: "Type of Help",
    description: "Description",
    submit: "Submit",
    getLocation: "Get My Location",
    contactPlaceholder: "Enter 10-digit contact number",

    // Form Validation
    nameRequired: "Name is required",
    locationRequired: "Location is required",
    contactNumberRequired: "Contact number is required",
    invalidContactNumber: "Invalid Contact Number",
    typeOfHelpRequired: "Please select a type of help",
    descriptionRequired: "Description is required",

    // Help Types (nested object for consistency)
    helpTypes: {
      medical: "Medical",
      food: "Food",
      shelter: "Shelter",
      emergencyTransport: "Emergency Transport",
      mosquitoNetTarpaulin: "Mosquito net / Tarpaulin",
      animalFeedMedicine: "Grass & medicines for animals",
    },

    // Helpline Sections
    governmentHelplines: "Government Helplines",
    ngoHelplines: "NGO & Helping Groups",

    // District Selection
    selectDistrict: "Select District",
    helplinesFor: "Helplines for",
    selectDistrictToView: "Please select a district to view helplines",
    selectDistrictMessage:
      "Choose your district from the dropdown above to see available helplines",
    noHelplinesFound: "No helplines found for this district",
    noHelplinesMessage:
      "Please check back later or contact emergency services directly",
    government: "Government",
    ngo: "NGO",
    address: "Address",
    availableHours: "Available Hours",

    // Request Details
    clickToViewDetails: "Click to View Details",
    loadMore: "Load More",
    loadAll: "Load All",
    noRequests: "No requests found",

    // Status and Actions
    all: "All",
    pending: "Pending",
    completed: "Completed",
    markCompleted: "Mark Completed",
    completedAt: "Completed At",
    updating: "Updating...",

    // Error Handling
    errorLoading: "Error loading data",
    retry: "Retry",
    error: "Error",
    permissionDenied:
      "Permission denied. Please check your Firebase configuration.",
    serviceUnavailable:
      "Service temporarily unavailable. Please try again later.",
    unauthenticated: "Authentication required. Please refresh the page.",

    // Messages
    requestSubmitted: "Request submitted successfully",
    errorSubmitting: "Error submitting request",
    locationError:
      "Error getting location. Please ensure location services are enabled and try again.",
    enablingGPS: "Enabling GPS for better accuracy...",
    fetchingLocation: "Fetching your location...",
    locationFetched: "Location fetched successfully",
    lowAccuracyWarning:
      "Warning: Low GPS accuracy. Try moving to an open area for better results.",
    locationPermissionDenied:
      "Location permission denied. Please enable it in your browser settings.",
    locationUnavailable:
      "Unable to retrieve location. Please check your device settings.",
    locationTimeout:
      "Location request timed out. Please try again in an open area.",
    near: "Near",
    accuracy: "accuracy",
    loading: "Loading...",
  },

  pa: {
    appTitle: "ਪੰਜਾਬ ਕੇਅਰ",
    // Request Help Form
    requestHelp: "ਸਹਾਇਤਾ ਲਈ ਬੇਨਤੀ",
    helplineNumbers: "ਹੈਲਪਲਾਈਨ ਨੰਬਰ",
    viewRequests: "ਬੇਨਤੀਆਂ ਦੇਖੋ",
    myRequests: "ਮੇਰੀਆਂ ਬੇਨਤੀਆਂ",
    backToHome: "ਹੋਮ ਪੇਜ ਤੇ ਵਾਪਸ",

    // Home Page
    welcome: "ਅਸੀਂ ਪੰਜਾਬ ਦੇ ਨਾਲ ਹਾਂ",
    welcomeMessage:
      "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਦੀ ਲੋੜ ਹੈ ਜਾਂ ਤੁਸੀਂ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰੋ ਜਾਂ ਸਹਾਇਤਾ ਪੇਸ਼ ਕਰੋ!",
    getHelpNow: "ਤੁਰੰਤ ਮਦਦ ਲਓ!",
    viewHelplines: "ਹੈਲਪਲਾਈਨ ਦੇਖੋ",
    viewAllRequests: "ਸਾਰੀਆਂ ਬੇਨਤੀਆਂ ਦੇਖੋ",
    emergencyNotice: "ਐਮਰਜੈਂਸੀ ਸੂਚਨਾ",
    emergencyMessage:
      "ਜੇ ਤੁਸੀਂ ਤੁਰੰਤ ਖਤਰੇ ਵਿੱਚ ਹੋ, ਤਾਂ ਪਹਿਲਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ",
    footerText: "ਸਭ ਲਈ ਸਰਲ, ਮੋਬਾਈਲ-ਕੇਂਦ੍ਰਿਤ ਲੇਆਉਟ",

    // District Selection
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    helplinesFor: "ਲਈ ਹੈਲਪਲਾਈਨ",
    selectDistrictToView: "ਕਿਰਪਾ ਕਰਕੇ ਹੈਲਪਲਾਈਨਾਂ ਦੇਖਣ ਲਈ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    selectDistrictMessage:
      "ਉਪਲਬਧ ਹੈਲਪਲਾਈਨਾਂ ਦੇਖਣ ਲਈ ਉੱਪਰ ਡ੍ਰੌਪਡਾਊਨ ਤੋਂ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    noHelplinesFound: "ਇਸ ਜ਼ਿਲ੍ਹੇ ਲਈ ਕੋਈ ਹੈਲਪਲਾਈਨ ਨਹੀਂ ਮਿਲੀ",
    noHelplinesMessage:
      "ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਮੁੜ ਚੈਕ ਕਰੋ ਜਾਂ ਸਿੱਧੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",

    // Status and common
    all: "ਸਭ",
    pending: "ਜਾਰੀ",
    completed: "ਪੂਰਾ ਹੋਇਆ",
    markCompleted: "ਪੂਰਾ ਹੋਇਆ ਚਿੰਨ੍ਹਿਤ ਕਰੋ",
    completedAt: "ਇਸ ਵੇਲੇ ਪੂਰਾ",
    updating: "ਅੱਪਡੇਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    near: "ਨੇੜੇ",
    accuracy: "ਸਹੀਪਣ",
    locationError:
      "ਟਿਕਾਣਾ ਲੈਣ ਵਿੱਚ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਲੋਕੇਸ਼ਨ ਸੇਵਾਵਾਂ ਚਾਲੂ ਹਨ।",
    enablingGPS: "ਵਧੀਆ ਸਹੀਪਣ ਲਈ GPS ਚਾਲੂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    fetchingLocation: "ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    locationFetched: "ਟਿਕਾਣਾ ਸਫਲਤਾਪੂਰਵਕ ਮਿਲ ਗਿਆ",
    lowAccuracyWarning:
      "ਚੇਤਾਵਨੀ: GPS ਸਹੀਪਣ ਘੱਟ ਹੈ। ਵਧੀਆ ਨਤੀਜੇ ਲਈ ਖੁੱਲ੍ਹੇ ਇਲਾਕੇ ਵਿੱਚ ਜਾਓ।",
    locationPermissionDenied:
      "ਟਿਕਾਣੇ ਦੀ ਇਜਾਜ਼ਤ ਰੱਦ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇਸਨੂੰ ਚਾਲੂ ਕਰੋ।",
    locationUnavailable:
      "ਟਿਕਾਣਾ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਿਵਾਈਸ ਸੈਟਿੰਗਾਂ ਚੈਕ ਕਰੋ।",
    locationTimeout:
      "ਟਿਕਾਣੇ ਦੀ ਬੇਨਤੀ ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਬਾਹਰ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",

    // Help Types (nested object, matches en)
    helpTypes: {
      medical: "ਮੈਡੀਕਲ/ਡਾਕਟਰੀ ਸਬੰਧਿਤ",
      food: "ਖਾਣ-ਪੀਣ ਸਬੰਧਿਤ",
      shelter: "ਆਸਰੇ ਦੇ ਸਬੰਧਿਤ",
      emergencyTransport: "ਐਮਰਜੈਂਸੀ ਟ੍ਰਾਂਸਪੋਰਟ ਸਬੰਧਿਤ",
      mosquitoNetTarpaulin: "ਮੱਛਰਦਾਨੀ /  ਤਾਰਪੌਲਿਨ",
      animalFeedMedicine: "ਪਸ਼ੂਆਂ ਲਈ ਨਿਰਾ ਅਤੇ ਦਵਾਈਆਂ",
    },

    // About Us
    AboutUs: {
      title: "ਸਾਡੇ ਬਾਰੇ",
      description:
        "ਅਸੀਂ ਪੰਜਾਬ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਇੱਕ ਟੀਮ ਹਾਂ ਜਿਸ ਨੇ ਆਪਣੀ ਸਿੱਖਿਆ ਅਤੇ ਕੋਸ਼ਿਸ਼ਾਂ ਰਾਹੀਂ ਯੋਗਦਾਨ ਪਾਉਣ ਲਈ ਇਹ ਪਹਲ ਸ਼ੁਰੂ ਕੀਤੀ ਹੈ। ਇਹ ਐਪ ਬਾਢ਼ ਰਾਹਤ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ — ਜਿਥੇ ਜ਼ਰੂਰਤਮੰਦ ਲੋਕ ਮਦਦ ਦੀ ਬੇਨਤੀ ਕਰ ਸਕਦੇ ਹਨ ਅਤੇ ਹੋਰ ਲੋਕ ਸਹਿਯੋਗ ਦੇਣ ਲਈ ਅੱਗੇ ਆ ਸਕਦੇ ਹਨ। ਪੰਜਾਬ ਦੀ ਨੌਜਵਾਨ ਤਾਕਤ ਵਜੋਂ, ਅਸੀਂ ਹਰ ਹਾਲਤ ਵਿੱਚ ਆਪਣੀ ਮਾਂ-ਧਰਤੀ ਨਾਲ ਖੜ੍ਹੇ ਹਾਂ।",
      contact: "ਸਾਡੇ ਨਾਲ ਜੁੜੋ: punjabcare25@gmail.com",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    const value = key
      .split(".")
      .reduce((obj, part) => obj?.[part], translations[language]);
    if (!value) {
      console.warn(`Missing translation for key: "${key}" in ${language}`);
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pa" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{ language, t, toggleLanguage, translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
