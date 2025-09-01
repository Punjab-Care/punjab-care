import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const AboutUs = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "About Us",
      description: `We are a group of students from Punjab who started this initiative to contribute through our education and efforts. 
      This app is built for flood relief — where people in need can request help and others can step forward to support. 
      As the youth of Punjab, we stand with our motherland in every situation.`,
      contact: "Connect with us: punjabcare25@gmail.com",
    },
    pa: {
      title: "ਸਾਡੇ ਬਾਰੇ",
      description: `ਅਸੀਂ ਪੰਜਾਬ ਦੇ ਕੁਝ ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਸਮੂਹ ਹਾਂ, ਜਿਨ੍ਹਾਂ ਨੇ ਆਪਣੀ ਸਿੱਖਿਆ ਅਤੇ ਯਤਨਾਂ ਰਾਹੀਂ ਯੋਗਦਾਨ ਪਾਉਣ ਲਈ ਇਹ ਪਹਿਲ ਕੀਤੀ ਹੈ। 
      ਇਹ ਐਪ ਬਾੜ੍ਹ ਰਾਹਤ ਲਈ ਬਣਾਈ ਗਈ ਹੈ — ਜਿੱਥੇ ਮਦਦ ਦੀ ਲੋੜ ਵਾਲੇ ਲੋਕ ਬੇਨਤੀ ਕਰ ਸਕਦੇ ਹਨ ਅਤੇ ਹੋਰ ਲੋਕ ਮਦਦ ਕਰਨ ਲਈ ਅੱਗੇ ਆ ਸਕਦੇ ਹਨ। 
      ਅਸੀਂ ਪੰਜਾਬ ਦੇ ਨੌਜਵਾਨ ਹਾਂ ਅਤੇ ਹਰ ਸਥਿਤੀ ਵਿੱਚ ਆਪਣੀ ਮਾਂ ਬੋਲੀ ਪੰਜਾਬ ਨਾਲ ਖੜ੍ਹੇ ਹਾਂ।`,
      contact: "ਸਾਡੇ ਨਾਲ ਜੁੜੋ: punjabcare25@gmail.com",
    },
  };

  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-3">{content[language].title}</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {content[language].description}
      </p>
      <p className="mt-3 font-medium text-blue-600">
        {content[language].contact}
      </p>
    </div>
  );
};

export default AboutUs;
