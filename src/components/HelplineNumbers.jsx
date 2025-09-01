import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import districts from '../../data/districts';

const HelplineNumbers = () => {
  const { t, selectedLanguage } = useLanguage(); // language context
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch helplines for selected district & language
  const fetchHelplinesByDistrict = async (district) => {
    if (!district) {
      setHelplines([]);
      return;
    }

    setLoading(true);
    try {
      const districtField = selectedLanguage === 'pa' ? 'district.pa' : 'district.en';

      const helplinesQuery = query(
        collection(db, 'helplines'), // make sure collection name matches
        where(districtField, '==', district)
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

  // Fetch helplines whenever district or language changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchHelplinesByDistrict(selectedDistrict);
    }
  }, [selectedDistrict, selectedLanguage]);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  // Card component
  const HelplineCard = ({ helpline }) => (
    <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-gray-900">{helpline.name[selectedLanguage]}</div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            helpline.type === 'government'
              ? 'bg-blue-100 text-blue-800'
              : helpline.type === 'gurudwara'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {helpline.type === 'government'
            ? t('government')
            : helpline.type === 'gurudwara'
            ? t('gurudwara')
            : t('ngo')}
        </span>
      </div>

      <div className="text-blue-600 font-medium mb-2">
        <a href={`tel:${helpline.contactNumber}`} className="hover:underline">
          {helpline.contactNumber}
        </a>
      </div>

      {helpline.description && (
        <div className="text-sm text-gray-600 mb-2">{helpline.description[selectedLanguage]}</div>
      )}

      {helpline.address && (
        <div className="text-sm text-gray-500">
          <strong>{t('address')}:</strong> {helpline.address[selectedLanguage]}
        </div>
      )}

      {helpline.availableHours && (
        <div className="text-sm text-gray-500 mt-1">
          <strong>{t('availableHours')}:</strong> {helpline.availableHours}
        </div>
      )}
    </div>
  );

  // Group helplines by type
  const groupedHelplines = {
    ngo: helplines.filter(h => h.type === 'ngo'),
    gurudwara: helplines.filter(h => h.type === 'gurudwara'),
    government: helplines.filter(h => h.type === 'government')
  };

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
          {districts.map(d => (
            <option
              key={d.district}
              value={selectedLanguage === 'pa' ? d.district_punjabi : d.district}
            >
              {d.district} / {d.district_punjabi}
            </option>
          ))}
        </select>
      </div>

      {/* Helplines Display */}
      {selectedDistrict ? (
        <div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">{t('loading')}</div>
          ) : helplines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t('noHelplinesFound')}</div>
          ) : (
            <div className="space-y-6">
              {groupedHelplines.ngo.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('ngo')}</h3>
                  <div className="space-y-4">
                    {groupedHelplines.ngo.map(hl => <HelplineCard key={hl.id} helpline={hl} />)}
                  </div>
                </div>
              )}
              {groupedHelplines.gurudwara.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('gurudwara')}</h3>
                  <div className="space-y-4">
                    {groupedHelplines.gurudwara.map(hl => <HelplineCard key={hl.id} helpline={hl} />)}
                  </div>
                </div>
              )}
              {groupedHelplines.government.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('government')}</h3>
                  <div className="space-y-4">
                    {groupedHelplines.government.map(hl => <HelplineCard key={hl.id} helpline={hl} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">{t('selectDistrictToView')}</div>
      )}
    </div>
  );
};

export default HelplineNumbers;
