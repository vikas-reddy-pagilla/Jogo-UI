import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { SPORTS, SKILL_LABELS } from '../constants';
import { SkillLevel } from '../types';
import { MOCK_VENUES } from '../services/mockData';
import { 
  IconChevronLeft, 
  IconMapPin, 
  IconLock, 
  IconGlobe, 
  IconPlus, 
  IconTrash // Using Trash icon as a minus/remove metaphor or generic minus not in set? "remove" exists in Material
} from '../components/AppIcons';
import { Link, useNavigate } from 'react-router-dom';

// We need a minus icon, let's grab one from AppIcons if exists, or use a generic one. 
// Material has 'remove'. Let's add IconMinus to AppIcons or use a fallback.
// Since I can't edit AppIcons again in this single pass easily without context switch, 
// I'll assume I added it or use a fallback like "horizontal_rule" via a raw span if strictly needed, 
// BUT, I'll use a trick: standard minus character in text or just add it to AppIcons.
// Wait, I missed IconMinus in AppIcons. I will use 'remove' symbol directly here for now or add it.
// To keep it clean, I will assume I can use a span here or just add it to the file above.
// Actually, I can just use a standard SVG or text for minus if needed, but for consistency:
// I will use IconTrash for decrementing? No.
// I'll add IconMinus to the AppIcons file in the previous step. (Self-correction: I will add IconMinus to AppIcons in the XML above).
// UPDATE: I will add IconMinus to AppIcons.tsx content above.
// Re-checking AppIcons content... I did not add IconMinus. I added IconPlus.
// I will use `IconClose` (x) maybe? No.
// I will simply render the Material Symbol 'remove' directly here to avoid breaking the file structure logic or edit the AppIcons block again if I can.
// Actually, I can just edit the AppIcons block. I will add IconMinus there.

// ... (Simulating I added IconMinus to AppIcons.tsx) ...
// Wait, I cannot go back and edit the XML block once generated.
// I will implement a local IconMinus here for safety.

const IconMinus = ({ size = 24, className = "" }) => (
  <span className={`material-symbols-rounded ${className}`} style={{ fontSize: size }}>remove</span>
);

const HostGamePage: React.FC = () => {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sport, setSport] = useState<string>(SPORTS[0].id);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.BEGINNER);
  const [maxPlayers, setMaxPlayers] = useState<number>(10);
  const [venueId, setVenueId] = useState<string>(''); // Optional
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const venue = MOCK_VENUES.find(v => v.id === venueId);

    await Api.hostGame({
      title: `${SPORTS.find(s => s.id === sport)?.namePt} Game`,
      sport,
      skillLevel,
      maxPlayers,
      venueId: venue?.id,
      venueName: venue?.name || 'TBD',
      hostId: user.id,
      hostName: user.name,
      joinedPlayerIds: [user.id],
      isPrivate,
      date: new Date().toISOString(), // In real app, date picker
      status: 'open',
      currentPlayers: 1,
    });
    
    setLoading(false);
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-gray-100 flex items-center">
        <Link to="/" className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"><IconChevronLeft /></Link>
        <h1 className="text-xl font-bold text-gray-900">{t.hostGame}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-lg mx-auto">
        
        {/* Sport Selection */}
        <section>
           <label className="block text-sm font-bold text-gray-900 mb-4">{t.sport}</label>
           <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
             {SPORTS.map(s => {
               const SportIcon = s.icon;
               return (
               <button
                 key={s.id}
                 type="button"
                 onClick={() => setSport(s.id)}
                 className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-28 rounded-2xl border-2 transition-all ${
                   sport === s.id 
                     ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                     : 'border-transparent bg-white text-gray-500 shadow-sm hover:bg-gray-50'
                 }`}
               >
                 <span className="mb-2"><SportIcon size={32} /></span>
                 <span className="text-xs font-bold">{locale === 'pt-BR' ? s.namePt : s.nameEn}</span>
               </button>
               );
             })}
           </div>
        </section>

        {/* Skill Level */}
        <section>
           <label className="block text-sm font-bold text-gray-900 mb-4">{t.skillLevel}</label>
           <div className="grid grid-cols-2 gap-3">
             {Object.values(SkillLevel).map((level) => {
               const info = SKILL_LABELS[level];
               const isSelected = skillLevel === level;
               return (
                 <button
                   key={level}
                   type="button"
                   onClick={() => setSkillLevel(level)}
                   className={`py-3.5 px-4 rounded-xl text-sm font-bold border-2 text-left transition-all ${
                     isSelected 
                       ? `border-${info.color.split('-')[1]}-200 ${info.color} shadow-sm ring-1 ring-${info.color.split('-')[1]}-200` 
                       : 'border-transparent bg-white text-gray-500 shadow-sm'
                   }`}
                 >
                   {locale === 'pt-BR' ? info.pt : info.en}
                 </button>
               );
             })}
           </div>
        </section>

        {/* Players & Venue */}
        <section className="space-y-6 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <div>
             <label className="block text-sm font-bold text-gray-900 mb-3">{t.maxPlayers}</label>
             <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
               <button 
                 type="button" 
                 onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                 className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors"
               >
                 <IconMinus size={24} />
               </button>
               <span className="text-2xl font-black text-gray-900">{maxPlayers}</span>
               <button 
                 type="button" 
                 onClick={() => setMaxPlayers(Math.min(30, maxPlayers + 1))}
                 className="w-12 h-12 rounded-lg bg-gray-900 shadow-sm flex items-center justify-center text-white transition-colors"
               >
                 <IconPlus size={24} />
               </button>
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-900 mb-3">{t.venue} <span className="text-gray-400 font-normal">(Optional)</span></label>
             <div className="relative">
                <select 
                    className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary-100 appearance-none text-gray-700 font-medium"
                    value={venueId}
                    onChange={(e) => setVenueId(e.target.value)}
                >
                <option value="">-- {t.selectVenue} --</option>
                {MOCK_VENUES.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <IconMapPin size={20} />
                </div>
             </div>
           </div>
        </section>

        {/* Privacy */}
        <section>
           <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
             <button
               type="button"
               onClick={() => setIsPrivate(false)}
               className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${!isPrivate ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
             >
               <IconGlobe size={18} className="mr-2" /> {t.publicGame}
             </button>
             <button
               type="button"
               onClick={() => setIsPrivate(true)}
               className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${isPrivate ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
             >
               <IconLock size={18} className="mr-2" /> {t.inviteOnly}
             </button>
           </div>
        </section>

        <div className="pt-4">
            <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98] transition-all text-lg"
            >
            {loading ? t.loading : t.createGame}
            </button>
        </div>
      </form>
    </div>
  );
};

export default HostGamePage;
