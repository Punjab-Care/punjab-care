import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const NGOPartnership = () => {
  const { t, language } = useLanguage();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const typingLines = t('ngoPartnership.typingLines') || [];

  useEffect(() => {
    if (typingLines.length === 0) return;

    const currentLine = typingLines[currentLineIndex];
    let timeout;

    if (isTyping) {
      // Typing effect
      if (currentText.length < currentLine.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentLine.slice(0, currentText.length + 1));
        }, 50);
      } else {
        // Finished typing, wait then start erasing
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Erasing effect
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentLine.slice(0, currentText.length - 1));
        }, 30);
      } else {
        // Finished erasing, move to next line
        setCurrentLineIndex((prev) => (prev + 1) % typingLines.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, currentLineIndex, typingLines]);

  const handlePartnerClick = () => {
    // For now, just show an alert. You can replace with actual contact logic
    window.open('mailto:punjabcare25@gmail.com?subject=Partnership Inquiry', '_blank');
  };

  const handleShareClick = () => {
    const url = window.location.href;
    const text = t('ngoPartnership.subtext');
    
    // Try to share via Web Share API first
    if (navigator.share) {
      navigator.share({
        title: t('ngoPartnership.heading'),
        text: text,
        url: url,
      }).catch(console.error);
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${t('ngoPartnership.heading')}\n\n${text}\n\n${url}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
      <div className="text-center">
        {/* Heading */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {t('ngoPartnership.heading')}
        </h3>

        {/* Typing Animation */}
        <div className="mb-4 min-h-[2.5rem] flex items-center justify-center">
          <p className="text-sm text-gray-600 font-medium">
            {currentText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Subtext */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {t('ngoPartnership.subtext')}
        </p>

                 {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row gap-3 justify-center">
           <button
             onClick={handlePartnerClick}
             className="px-6 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-sm hover:shadow-md"
           >
             {t('ngoPartnership.partnerButton')}
           </button>
           
           <button
             onClick={handleShareClick}
             className="px-6 py-3 bg-green-400 text-white rounded-lg font-medium hover:bg-green-500 transition-colors shadow-sm hover:shadow-md"
           >
             {t('ngoPartnership.shareButton')}
           </button>
         </div>
      </div>
    </div>
  );
};

export default NGOPartnership;
