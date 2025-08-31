import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { getSessionId } from '../utils/session';

const RequestHelpForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    typeOfHelp: '',
    description: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLocation = async () => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t('nameRequired'));
      return false;
    }
    if (!formData.location.trim()) {
      setError(t('locationRequired'));
      return false;
    }
    if (!formData.contactNumber.trim()) {
      setError(t('contactNumberRequired'));
      return false;
    }
    if (!formData.typeOfHelp) {
      setError(t('typeOfHelpRequired'));
      return false;
    }
    if (!formData.description.trim()) {
      setError(t('descriptionRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      console.log('Session ID:', sessionId); // Debug log
      
      const requestData = {
        ...formData,
        sessionId,
        timestamp: new Date(),
        status: 'pending'
      };

      console.log('Submitting request data:', requestData); // Debug log

      // Create new request
      const docRef = await addDoc(collection(db, 'requests'), requestData);
      console.log('Request submitted successfully with ID:', docRef.id); // Debug log
      
      setMessage(t('requestSubmitted'));

      // Reset form
      setFormData({
        name: '',
        location: '',
        contactNumber: '',
        typeOfHelp: '',
        description: ''
      });
    } catch (error) {
      console.error('Request submission error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        setError(t('permissionDenied'));
      } else if (error.code === 'unavailable') {
        setError(t('serviceUnavailable'));
      } else if (error.code === 'unauthenticated') {
        setError(t('unauthenticated'));
      } else {
        setError(`${t('errorSubmitting')}: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
      // Clear error after 5 seconds
      if (error) {
        setTimeout(() => setError(null), 5000);
      }
      // Clear success message after 3 seconds
      if (message) {
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('requestHelp')}</h2>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <div className="font-medium">{t('error')}</div>
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {/* Success Message */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
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
              required
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
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t('contactNumber')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('typeOfHelp')}</label>
          <select
            name="typeOfHelp"
            value={formData.typeOfHelp}
            onChange={handleInputChange}
            required
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
            required
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
