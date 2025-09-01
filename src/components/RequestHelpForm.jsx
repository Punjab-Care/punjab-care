import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { getSessionId } from '../utils/session';
import toast from 'react-hot-toast';

const RequestHelpForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    typeOfHelp: '',
    description: ''
    // coordinates is added by getLocation when available
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const helpTypes = [
    { value: 'medical', label: t('medical') },
    { value: 'food', label: t('food') },
    { value: 'shelter', label: t('shelter') },
    { value: 'emergencyTransport', label: t('emergencyTransport') }
  ];

  // Generic input handler (keeps your original behaviour)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Your original getLocation logic — unchanged except using the same setMessage/timeouts you used
  const getLocation = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser, please fill the detil manually');
      }

      // Show loading message immediately
      setMessage(t('enablingGPS'));
      
      // First, try to get high-accuracy GPS position
      const position = await new Promise((resolve, reject) => {
        // First try with high accuracy (may take longer)
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            // If high accuracy fails, try with standard accuracy
            if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
              console.log('High accuracy failed, trying standard accuracy...');
              navigator.geolocation.getCurrentPosition(
                resolve,
                reject,  // If standard accuracy also fails, reject with the original error
                {
                  enableHighAccuracy: false,
                  timeout: 15000,  // 15 seconds timeout
                  maximumAge: 0    // Force fresh position
                }
              );
            } else {
              reject(error);
            }
          },
          {
            enableHighAccuracy: true,  // Request high accuracy (uses GPS if available)
            timeout: 10000,           // 10 seconds timeout for high accuracy
            maximumAge: 0,            // Force fresh position
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Got position with accuracy: ${accuracy} meters`);
      
      // If accuracy is poor (more than 500m), warn the user
      if (accuracy > 500) {
        setMessage(t('lowAccuracyWarning'));
      } else {
        setMessage(t('fetchingLocation'));
      }
      
      // Use OpenStreetMap Nominatim for reverse geocoding with user's preferred language
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=${navigator.language || 'en'}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }
      
      const data = await response.json();
      
      // Extract the most relevant location name (village, town, city, etc.)
      const address = data.address || {};
      let locationName = '';
      
      // Try to get the most specific location name available
      const locationTypes = [
        'village', 'town', 'city_district', 'city', 'county', 'state_district', 'state'
      ];
      
      // Find the most specific location type that exists in the address
      for (const type of locationTypes) {
        if (address[type]) {
          if (locationName) {
            // If we already have a location but it's too general, append the more specific one
            if (type === 'village' || type === 'town' || 
                (type === 'city' && !locationName.includes(address[type]))) {
              locationName = `${address[type]}, ${locationName}`;
              break;
            }
          } else {
            locationName = address[type];
          }
        }
      }
      
      // If no specific location found, show coordinates with accuracy
      if (!locationName) {
        locationName = `${t('near')} ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        if (accuracy < 1000) {
          locationName += ` (${Math.round(accuracy)}m ${t('accuracy')})`;
        }
      }
      
      // Save the human-readable location
      setFormData(prev => ({
        ...prev,
        location: locationName,
        coordinates: { 
          latitude: latitude.toFixed(6), 
          longitude: longitude.toFixed(6),
          accuracy: Math.round(accuracy)
        }
      }));
      
      setMessage(t('locationFetched'));
      // keep the UI message short-lived as before
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error getting location:', error);
      let errorMessage = t('locationError');
      
      // More specific error messages based on error code
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = t('locationPermissionDenied');
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = t('locationUnavailable');
      } else if (error.code === error.TIMEOUT) {
        errorMessage = t('locationTimeout');
      }
      
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // VALIDATION: returns { valid: boolean, error: string|null } — avoids race with setState
  const validateForm = () => {
    if (!formData.location || !formData.location.trim()) {
      return { valid: false, error: t('locationRequired') };
    }

    // Indian mobile validation: must start with 6-9 and be 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber))  {
      // add t('invalidContactNumber') in your translations for i18n
      return { valid: false, error: t('invalidContactNumber') || 'Invalid Contact Number. Please enter a 10-digit Indian mobile number.' };
    }
  
    if (!formData.typeOfHelp) {
      return { valid: false, error: t('typeOfHelpRequired') };
    }

    return { valid: true, error: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors/messages
    setError(null);
    setMessage('');

    const { valid, error: validationError } = validateForm();
    if (!valid) {
      setError(validationError);
      // show toast + top error box
      toast.error(validationError);
      // clear error after 5s
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      
      
      const requestData = {
        ...formData,
        sessionId,
        timestamp: new Date(),
        status: 'pending'
      };

    
      // Create new request
      const docRef = await addDoc(collection(db, 'requests'), requestData);

      
      // show both toast and message
      const successMsg = t('requestSubmitted') || 'Request submitted';
      setMessage(successMsg);
      toast.success(successMsg);

      // Reset form
      setFormData({
        name: '',
        location: '',
        contactNumber: '',
        typeOfHelp: '',
        description: ''
      });

      // clear success message after 3s
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Request submission error:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      
      // Provide more specific error messages (as you had)
      let errMsg;
      if (err.code === 'permission-denied') {
        errMsg = t('permissionDenied');
      } else if (err.code === 'unavailable') {
        errMsg = t('serviceUnavailable');
      } else if (err.code === 'unauthenticated') {
        errMsg = t('unauthenticated');
      } else {
        errMsg = `${t('errorSubmitting') || 'Error submitting request'}: ${err.message}`;
      }

      setError(errMsg);
      toast.error(errMsg);
      // clear error after 5s
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('requestHelp')}</h2>
      
      {/* Top Error Display (your custom errors only) */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <div className="font-medium">{t('error')}</div>
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {/* Success Message (kept as before) */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {/* NOTE: noValidate prevents browser native validation popups */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">{t('name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t('name')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('location')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder={t('location')}
            />
            <button
              type="button"
              onClick={getLocation}
              className="px-4 py-3 bg-blue-500 text-white rounded-md text-sm"
            >
              {t('getLocation')}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('contactNumber')}</label>
          <input
            type="tel"
            inputMode="numeric"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => {
              // enforce digits only and max length 10
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData(prev => ({ ...prev, contactNumber: onlyNums }));
            }}
            maxLength="10"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t('Enter 10-digit contact number')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('typeOfHelp')}</label>
          <select
            name="typeOfHelp"
            value={formData.typeOfHelp}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">{t('typeOfHelp')}</option>
            {helpTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('description')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t('description')}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-3 rounded-md font-medium disabled:opacity-50"
        >
          {isSubmitting ? t('loading') : t('submit')}
        </button>
      </form>
    </div>
  );
};

export default RequestHelpForm;
