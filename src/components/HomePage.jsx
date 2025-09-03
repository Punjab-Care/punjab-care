import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import Footer from './Footer'
import SupportCounter from './supportcounter'
const HomePage = ({ onNavigate }) => {
  const { t, language, toggleLanguage } = useLanguage();

  const handleNavigation = (section) => {
    onNavigate(section);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'));
        if (querySnapshot.empty) {
          console.log("Database connected ✅ but no requests found yet.");
        } else {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-500">
             {t('appTitle')}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 text-sm rounded-md ${
                  language === 'en' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                English
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 text-sm rounded-md ${
                  language === 'pa' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Welcome Section */}
          <div className="text-center mb-8">
           
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('welcome')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('welcomeMessage')}
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-4">
            {/* Get Help Now - Primary Action */}
            <button
              onClick={() => handleNavigation('request')}
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
            >
              <span>🆘</span>
              {t('getHelpNow')}
              <span>→</span>
            </button>

            {/* View Helplines */}
            <button
              onClick={() => handleNavigation('helpline')}
              className="w-full bg-white text-gray-700 py-4 px-6 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <span>📞</span>
              {t('viewHelplines')}
            </button>

  
          </div>

          {/* Emergency Notice */}
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-red-800">{t('emergencyNotice')}</h3>
            </div>
            <p className="text-red-700 text-sm">
              {t('emergencyMessage')}
            </p>
          </div>

          <div className="mb-4 flex justify-center">
              <SupportCounter />
            </div>

          {/* Footer */}
          <div className="mt-5 text-center text-gray-500 text-xl">
            <p>{t('footerText')}</p>
          </div>
        </div>
      </main>
      {/* <Footer onNavigate={onNavigate} /> */}
       
    </div>
  );
};

export default HomePage;
