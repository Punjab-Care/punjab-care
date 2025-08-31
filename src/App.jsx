import { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import HomePage from './components/HomePage';
import RequestHelpForm from './components/RequestHelpForm';
import HelplineNumbers from './components/HelplineNumbers';
import ViewRequests from './components/ViewRequests';
import MyRequests from './components/MyRequests';
import './App.css';


let ownerId = localStorage.getItem("ownerId");
if (!ownerId) {
  ownerId = crypto.randomUUID(); // unique ID
  localStorage.setItem("ownerId", ownerId);
} 

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
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
  );
};

const AppContent = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'request':
        return <RequestHelpForm />;
      case 'helpline':
        return <HelplineNumbers />;
      case 'view':
        return <ViewRequests />;
      case 'my':
        return <MyRequests />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  // If we're on the home page, render it directly (it has its own header)
  if (currentPage === 'home') {
    return renderContent();
  }

  // For other pages, show the navigation header
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-blue-600 hover:text-blue-800 font-medium text-2xl"
                aria-label="Back to home"
              >
                ←
              </button>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'request', label: t('requestHelp') },
              { id: 'helpline', label: t('helplineNumbers') },
              { id: 'view', label: t('viewRequests') },
              { id: 'my', label: t('myRequests') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  currentPage === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

