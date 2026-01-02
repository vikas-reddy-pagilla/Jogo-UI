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

  const openMap = (e: React.MouseEvent, address: string) => {
    e.preventDefault();
    e.stopPropagation();
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

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
             <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
               {[1,2,3].map(i => <div key={i} className="flex-shrink-0 w-64 h-64 bg-white rounded-3xl animate-pulse" />)}
             </div>
          ) : filteredVenues.length === 0 ? (
             <div className="text-gray-400 text-center py-10">{t.noData}</div>
          ) : (
            <div className="flex space-x-5 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar">
              {filteredVenues.map(venue => (
                <Link to="/book" key={venue.id} className="flex-shrink-0 w-72 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden snap-center group hover:-translate-y-1 transition-transform duration-300">
                  <div className="h-40 w-full relative">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
                      <IconStar size={14} className="text-yellow-500 mr-1" filled /> {venue.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{venue.name}</h3>
                    
                    {/* Clickable Address */}
                    <button 
                      onClick={(e) => openMap(e, venue.address)}
                      className="flex items-center text-xs text-gray-500 mb-3 hover:text-primary-600 transition-colors text-left w-full group/map"
                    >
                       <IconMapPin size={16} className="mr-1 text-gray-400 group-hover/map:text-primary-600"/> 
                       <span className="truncate underline decoration-dotted decoration-gray-300 group-hover/map:decoration-primary-400 underline-offset-2">{venue.address}</span>
                    </button>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400 font-medium">
                        {venue.distanceKm} {t.distance}
                      </div>
                      <div className="text-primary-600 font-bold">
                        {formatCurrency(venue.pricePerHour)}<span className="text-xs text-gray-400 font-normal">{t.perHour}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Open Games */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-5 px-1">
            <h2 className="text-xl font-bold text-gray-900">{t.openGames}</h2>
            <Link to="/events" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
               <IconArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-4">
             {loading ? (
                [1,2].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse" />)
             ) : filteredEvents.length === 0 ? (
                <div className="text-gray-400 text-center py-10">{t.noData}</div>
             ) : (
               filteredEvents.map(event => {
                 const skillInfo = SKILL_LABELS[event.skillLevel];
                 return (
                   <Link to={`/chat/${event.id}`} key={event.id} className="block bg-white p-4 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${skillInfo.color.replace('text-', 'bg-').replace('700', '100')} ${skillInfo.color}`}>
                           {(() => {
                             const s = SPORTS.find(sp => sp.id === event.sport);
                             const Ico = s?.icon;
                             return Ico ? <Ico size={28}/> : '🏆';
                           })()}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                           <div className="flex items-center text-xs text-gray-500 mt-1">
                              <IconUsers size={14} className="mr-1"/> 
                              <span className="mr-3">{event.currentPlayers}/{event.maxPlayers}</span>
                              <span className={`px-1.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${skillInfo.border} ${skillInfo.color} bg-opacity-10`}>
                                {locale === 'pt-BR' ? skillInfo.pt : skillInfo.en}
                              </span>
                           </div>
                        </div>
                      </div>
                      <div className="text-gray-300 group-hover:text-primary-600 transition-colors">
                        <IconArrowRight size={20} />
                      </div>
                   </Link>
                 )
               })
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;