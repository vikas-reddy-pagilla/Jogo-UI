import React, { useEffect, useState } from 'react';
import { useLanguage } from '../App';
import { Api } from '../services/api';
import { Venue, GameEvent } from '../types';
import { SPORTS, SKILL_LABELS } from '../constants';
import { 
  IconMapPin, 
  IconStar, 
  IconSearch, 
  IconArrowRight, 
  IconUsers, 
  IconBell 
} from '../components/AppIcons';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { t, locale, formatCurrency } = useLanguage();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [venuesData, eventsData] = await Promise.all([
          Api.getVenues(),
          Api.getEvents()
        ]);
        setVenues(venuesData);
        setEvents(eventsData.filter(e => e.status === 'open'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredVenues = activeSport
    ? venues.filter(v => v.sports.includes(activeSport))
    : venues;

  const filteredEvents = activeSport
    ? events.filter(e => e.sport === activeSport)
    : events;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modern Header */}
      <header className="bg-white px-6 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-20 bg-white/90 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-primary-600">JOGO</h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Brazil</p>
          </div>
          <div className="flex items-center space-x-3">
             <button 
               onClick={() => setHasNotifications(false)}
               className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 relative hover:bg-gray-100 transition-colors active:scale-95"
               aria-label="Notifications"
             >
               <IconBell size={22} className="text-gray-700" />
               {hasNotifications && (
                 <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               )}
             </button>
             <Link to="/profile" className="w-10 h-10 rounded-full bg-primary-100 overflow-hidden border-2 border-white shadow-sm block">
                <img src="https://i.pravatar.cc/150?u=u1" alt="Profile" className="w-full h-full object-cover"/>
             </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative shadow-sm group">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 group-hover:bg-white group-hover:border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none"
          />
          <div className="absolute left-4 top-3.5 text-gray-400 group-hover:text-primary-500 transition-colors">
            <IconSearch size={22} />
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* Sport Chips */}
        <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar">
          <button
            onClick={() => setActiveSport(null)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeSport === null 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105' 
                : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {SPORTS.map(sport => {
            const SportIcon = sport.icon;
            return (
              <button
                key={sport.id}
                onClick={() => setActiveSport(sport.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center space-x-2 ${
                  activeSport === sport.id 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105' 
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="mr-1"><SportIcon size={20} /></span>
                <span>{locale === 'pt-BR' ? sport.namePt : sport.nameEn}</span>
              </button>
            )
          })}
        </div>

        {/* Nearby Venues */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5 px-1">
            <h2 className="text-xl font-bold text-gray-900">{t.nearbyVenues}</h2>
            <Link to="/book" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
               <IconArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
             <div className="flex space-x-4 overflow-x-hidden">
               {[1, 2].map(i => <div key={i} className="min-w-[280px] h-56 bg-white rounded-3xl animate-pulse" />)}
             </div>
          ) : (
            <div className="flex space-x-5 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
              {filteredVenues.map(venue => (
                <Link to="/book" key={venue.id} className="min-w-[280px] w-[280px] bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] block group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                       <IconStar size={14} filled className="text-yellow-500 mr-1" />
                       {venue.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg truncate mb-1">{venue.name}</h3>
                    <div className="flex items-center text-gray-500 text-xs mb-3">
                      <IconMapPin size={14} className="mr-1" />
                      <span className="truncate">{venue.address}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                        <div className="flex -space-x-1.5">
                           {venue.sports.slice(0, 3).map(s => {
                             const sportObj = SPORTS.find(sp => sp.id === s);
                             const SportIcon = sportObj ? sportObj.icon : null;
                             return (
                               <span key={s} className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] shadow-sm text-gray-600">
                                 {SportIcon && <SportIcon size={14} />}
                               </span>
                             )
                           })}
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-sm font-bold text-primary-600">{formatCurrency(venue.pricePerHour)}</span>
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Open Games */}
        <div className="pb-24">
          <div className="flex justify-between items-center mb-5 px-1">
            <h2 className="text-xl font-bold text-gray-900">{t.openGames}</h2>
            <Link to="/events" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
               <IconArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="h-32 bg-white rounded-3xl animate-pulse" />
            ) : filteredEvents.length === 0 ? (
               <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p>{t.noData}</p>
                  <Link to="/host" className="text-primary-600 font-bold text-sm mt-3 inline-block px-4 py-2 bg-primary-50 rounded-full">{t.hostGame}</Link>
               </div>
            ) : (
              filteredEvents.slice(0, 3).map(event => {
                const skillInfo = SKILL_LABELS[event.skillLevel];
                const displaySkill = locale === 'pt-BR' ? skillInfo.pt : skillInfo.en;
                const sport = SPORTS.find(s => s.id === event.sport);
                const SportIcon = sport?.icon;

                return (
                  <Link to="/events" key={event.id} className="block bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-[0.99] transition-transform hover:border-primary-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 text-gray-700">
                          {SportIcon && <SportIcon size={24} />}
                        </div>
                        <div>
                           <h3 className="font-bold text-gray-900 leading-tight">{event.title}</h3>
                           <div className="flex items-center mt-1 space-x-2">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${skillInfo.color} ${skillInfo.border}`}>
                               {displaySkill}
                             </span>
                           </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-xs font-bold text-gray-400 uppercase">{new Date(event.date).toLocaleDateString(locale, {weekday: 'short'})}</span>
                         <span className="text-xl font-black text-gray-900">{new Date(event.date).getDate()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                       <div className="flex items-center -space-x-2">
                          {[...Array(Math.min(3, event.currentPlayers))].map((_, i) => (
                             <img key={i} src={`https://i.pravatar.cc/150?u=${event.id}${i}`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                          ))}
                          {event.currentPlayers > 3 && (
                             <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">+{event.currentPlayers - 3}</div>
                          )}
                          <span className="ml-3 text-xs font-medium text-gray-500">{event.currentPlayers}/{event.maxPlayers} {t.players}</span>
                       </div>
                       <span className="text-xs font-bold text-primary-600 flex items-center">
                          {new Date(event.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
