import React, { useEffect, useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { GameEvent } from '../types';
import { SPORTS, SKILL_LABELS } from '../constants';
import { 
  IconUsers, 
  IconCalendar, 
  IconMapPin,
  IconShare
} from '../components/AppIcons';

const EventsPage: React.FC = () => {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'my_games'>('discover');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await Api.getEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayedEvents = activeTab === 'discover' 
    ? events.filter(e => e.status === 'open')
    : events.filter(e => e.joinedPlayerIds.includes(user?.id || '') || e.hostId === user?.id);

  const openMap = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = async (e: React.MouseEvent, event: GameEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: event.title,
      text: `${locale === 'pt-BR' ? 'Vamos jogar!' : 'Let\'s play!'} ${event.title} @ ${event.venueName}`,
      url: window.location.href // In a real app, this would be `https://jogo.app/events/${event.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        setToastMessage(t.linkCopied);
        setTimeout(() => setToastMessage(''), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
           {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.events}</h1>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
           <button
             onClick={() => setActiveTab('discover')}
             className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
               activeTab === 'discover' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             {t.discover}
           </button>
           <button
             onClick={() => setActiveTab('my_games')}
             className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
               activeTab === 'my_games' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             {t.myEvents}
           </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {loading ? (
           <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="bg-white h-48 rounded-3xl animate-pulse" />)}
           </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
             <div className="text-5xl mb-4 grayscale opacity-50">🏟️</div>
             <p className="font-medium">{t.noData}</p>
          </div>
        ) : (
          displayedEvents.map(event => {
            const skillInfo = SKILL_LABELS[event.skillLevel];
            const displaySkill = locale === 'pt-BR' ? skillInfo.pt : skillInfo.en;
            const sport = SPORTS.find(s => s.id === event.sport);
            const SportIcon = sport?.icon;
            const isHost = event.hostId === user?.id;
            const isJoined = event.joinedPlayerIds.includes(user?.id || '');

            return (
              <div key={event.id} className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gray-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 text-gray-700">
                      {SportIcon && <SportIcon size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.title}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase mt-1.5 inline-block border ${skillInfo.color} ${skillInfo.border}`}>
                        {displaySkill}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                     <button 
                       onClick={(e) => handleShare(e, event)} 
                       className="p-2 -mr-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                       title={t.share}
                     >
                       <IconShare size={20} />
                     </button>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5 pl-1">
                  <button 
                    onClick={() => openMap(event.venueName)}
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors text-left w-full group/map"
                  >
                    <IconMapPin size={16} className="mr-3 text-gray-400 group-hover/map:text-primary-600" />
                    <span className="underline decoration-dotted decoration-gray-300 group-hover/map:decoration-primary-400 underline-offset-4">{event.venueName}</span>
                  </button>
                  <div className="flex items-center text-sm text-gray-600">
                     <IconCalendar size={16} className="mr-3 text-gray-400" />
                     {new Date(event.date).toLocaleDateString(locale, {weekday: 'short', month: 'numeric', day: 'numeric'})} • {new Date(event.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <IconUsers size={16} className="mr-3 text-gray-400" />
                    <span className="font-medium text-gray-900">{event.currentPlayers}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-500">{event.maxPlayers} {t.players}</span>
                    {event.maxPlayers - event.currentPlayers > 0 && (
                      <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        {event.maxPlayers - event.currentPlayers} {t.slotsAvailable}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                   <div className="flex items-center">
                      <img src={`https://i.pravatar.cc/150?u=${event.hostId}`} className="w-6 h-6 rounded-full border border-gray-100" alt="Host" />
                      <span className="text-xs text-gray-500 ml-2">{t.hostedBy} <span className="font-bold text-gray-800">{event.hostName}</span></span>
                   </div>
                   {isJoined ? (
                      <button className="px-6 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm">
                        {isHost ? t.host : t.joined}
                      </button>
                   ) : (
                      <button className="px-6 py-2 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all">
                        {t.join}
                      </button>
                   )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsPage;