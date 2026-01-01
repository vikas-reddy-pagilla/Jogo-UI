import React from 'react';
import { useLanguage } from '../App';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center space-x-2 text-gray-600 mb-2">
        <Globe size={18} />
        <span className="font-semibold text-sm">{t.language}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setLocale('pt-BR')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            locale === 'pt-BR'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Português (Brasil)
        </button>
        <button
          onClick={() => setLocale('en')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            locale === 'en'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;