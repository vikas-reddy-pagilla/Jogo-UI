import React from 'react';
import { useLanguage, useAuth } from '../App';
import LanguageToggle from '../components/LanguageToggle';
import { SKILL_LABELS } from '../constants';
import { LogOut, Award, Star, Settings, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { t, locale } = useLanguage();
  const { user, logout } = useAuth();

  if (!user) return null;

  const skillInfo = SKILL_LABELS[user.skillLevel];
  const skillLabel = locale === 'pt-BR' ? skillInfo.pt : skillInfo.en;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Profile */}
      <div className="bg-white p-6 pb-10 rounded-b-[2.5rem] shadow-sm mb-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-24 bg-primary-600 z-0"></div>
         
         <div className="relative z-10 flex flex-col items-center mt-8">
            <div className="relative mb-3">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-gray-200"
              />
              <div className={`absolute bottom-0 right-0 ${skillInfo.color} border-2 border-white text-xs px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap`}>
                {skillLabel}
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>

            <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold">
              <Star size={16} className="fill-current text-yellow-500" />
              <span>{user.rating.toFixed(1)} {t.rating}</span>
            </div>
         </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Stats Section - Mocked */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
             <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">📅</span>
             </div>
             <div className="text-2xl font-bold text-gray-900">12</div>
             <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t.myBookings}</div>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">⚽</span>
             </div>
             <div className="text-2xl font-bold text-gray-900">5</div>
             <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t.myEvents}</div>
           </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="bg-gray-100 p-2 rounded-lg"><Settings size={18} className="text-gray-600"/></div>
                 <span className="font-bold text-gray-700">{t.settings}</span>
              </div>
           </div>
           
           <div className="p-4">
              <LanguageToggle />
           </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-4 text-red-500 font-bold bg-white border border-red-100 rounded-2xl hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          <span>{t.logout}</span>
        </button>
        
        <div className="text-center text-xs text-gray-400 pb-4">
          v1.0.0 • Jogo Brazil
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;