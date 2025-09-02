import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const AboutUs = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">{t('AboutUs.title')}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t('AboutUs.description')}
        </p>
        <div className="mt-5">
          <a href="mailto:punjabcare25@gmail.com" className="inline-block px-4 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            {t('AboutUs.contact')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
