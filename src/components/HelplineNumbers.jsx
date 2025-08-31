import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const HelplineNumbers = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);

  // Punjab districts
  const punjabDistricts = [
    'Amritsar',
    'Barnala',
    'Bathinda',
    'Faridkot',
    'Fatehgarh Sahib',
    'Ferozepur',
    'Gurdaspur',
    'Hoshiarpur',
    'Jalandhar',
    'Kapurthala',
    'Ludhiana',
    'Mansa',
    'Moga',
    'Muktsar',
    'Pathankot',
    'Patiala',
    'Rupnagar',
    'S.A.S. Nagar (Mohali)',
    'Sangrur',
    'Shahid Bhagat Singh Nagar',
    'Tarn Taran'
  ];

  useEffect(() => {
    // Set districts on component mount
    setDistricts(punjabDistricts);
  }, []);

  const fetchHelplinesByDistrict = async (district) => {
    if (!district) {
      setHelplines([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch helplines for the selected district
      const helplinesQuery = query(
        collection(db, 'helplines'),
        where('district', '==', district)
      );
      
      const snapshot = await getDocs(helplinesQuery);
      const helplineData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setHelplines(helplineData);
    } catch (error) {
      console.error('Error fetching helplines:', error);
      setHelplines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    fetchHelplinesByDistrict(district);
  };

  const HelplineCard = ({ helpline }) => (
    <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-gray-900">{helpline.name}</div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          helpline.type === 'government' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {helpline.type === 'government' ? t('government') : t('ngo')}
        </span>
      </div>
      
      <div className="text-blue-600 font-medium mb-2">
        <a href={`tel:${helpline.phone}`} className="hover:underline">
          {helpline.phone}
        </a>
      </div>
      
      {helpline.description && (
        <div className="text-sm text-gray-600 mb-2">{helpline.description}</div>
      )}
      
      {helpline.address && (
        <div className="text-sm text-gray-500">
          <strong>{t('address')}:</strong> {helpline.address}
        </div>
      )}
      
      {helpline.availableHours && (
        <div className="text-sm text-gray-500 mt-1">
          <strong>{t('availableHours')}:</strong> {helpline.availableHours}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('helplineNumbers')}</h2>
      
      {/* District Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('selectDistrict')}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t('selectDistrict')}</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Helplines Display */}
      {selectedDistrict && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('helplinesFor')} {selectedDistrict}
            </h3>
            {loading && (
              <div className="text-sm text-gray-500">{t('loading')}</div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">{t('loading')}</div>
            </div>
          ) : helplines.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">{t('noHelplinesFound')}</div>
              <div className="text-sm text-gray-400">{t('noHelplinesMessage')}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {helplines.map((helpline) => (
                <HelplineCard key={helpline.id} helpline={helpline} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions when no district is selected */}
      {!selectedDistrict && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">{t('selectDistrictToView')}</div>
          <div className="text-sm text-gray-400">{t('selectDistrictMessage')}</div>
        </div>
      )}
    </div>
  );
};

export default HelplineNumbers;
