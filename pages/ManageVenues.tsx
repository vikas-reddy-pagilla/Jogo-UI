
import React, { useEffect, useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { Venue } from '../types';
import { VENUE_SERVICES, SPORTS } from '../constants';
import { Link } from 'react-router-dom';
import { 
  IconChevronLeft, 
  IconLoader, 
  IconMapPin, 
  IconStar, 
  IconEdit, 
  IconCheck, 
  IconMoney,
  IconStore,
  IconPlus
} from '../components/AppIcons';

const ManageVenuesPage: React.FC = () => {
  const { t, locale, formatCurrency } = useLanguage();
  const { user } = useAuth();
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'owner') {
      loadVenues();
    }
  }, [user]);

  const loadVenues = async () => {
    if (!user) return;
    setLoading(true);
    const data = await Api.getOwnerVenues(user.id);
    setVenues(data);
    setLoading(false);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue({ ...venue });
  };

  const handleCloseEdit = () => {
    setEditingVenue(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;
    
    setSaveLoading(true);
    try {
      await Api.updateVenue(editingVenue);
      setVenues(prev => prev.map(v => v.id === editingVenue.id ? editingVenue : v));
      setEditingVenue(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    if (!editingVenue) return;
    const currentServices = editingVenue.services || [];
    if (currentServices.includes(serviceId)) {
      setEditingVenue({ 
        ...editingVenue, 
        services: currentServices.filter(s => s !== serviceId) 
      });
    } else {
      setEditingVenue({ 
        ...editingVenue, 
        services: [...currentServices, serviceId] 
      });
    }
  };

  const toggleSport = (sportId: string) => {
    if (!editingVenue) return;
    const currentSports = editingVenue.sports || [];
    if (currentSports.includes(sportId)) {
      setEditingVenue({ 
        ...editingVenue, 
        sports: currentSports.filter(s => s !== sportId) 
      });
    } else {
      setEditingVenue({ 
        ...editingVenue, 
        sports: [...currentSports, sportId] 
      });
    }
  };

  if (editingVenue) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-safe">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
          <button onClick={handleCloseEdit} className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
            <IconChevronLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t.editVenue}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
           <form onSubmit={handleSave} className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                 <h2 className="font-bold text-gray-900 mb-2">{t.venueDetails}</h2>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.name}</label>
                    <input 
                      type="text" 
                      required
                      value={editingVenue.name}
                      onChange={(e) => setEditingVenue({...editingVenue, name: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-primary-500"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.venueAddress}</label>
                    <input 
                      type="text" 
                      required
                      value={editingVenue.address}
                      onChange={(e) => setEditingVenue({...editingVenue, address: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none text-sm font-medium focus:ring-2 focus:ring-primary-500"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.venueImage}</label>
                    <input 
                      type="url" 
                      required
                      value={editingVenue.imageUrl}
                      onChange={(e) => setEditingVenue({...editingVenue, imageUrl: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 text-gray-500 truncate"
                    />
                    <img src={editingVenue.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-3 bg-gray-100" />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Price {t.perHour}</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         required
                         min="0"
                         value={editingVenue.pricePerHour}
                         onChange={(e) => setEditingVenue({...editingVenue, pricePerHour: parseFloat(e.target.value)})}
                         className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-primary-500"
                       />
                       <div className="absolute left-3 top-3.5 text-gray-400">
                          <IconMoney size={20} />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sports */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                 <h2 className="font-bold text-gray-900 mb-4">{t.sportsOffered}</h2>
                 <div className="grid grid-cols-2 gap-3">
                    {SPORTS.map(sport => {
                      const isActive = editingVenue.sports.includes(sport.id);
                      return (
                        <button
                          key={sport.id}
                          type="button"
                          onClick={() => toggleSport(sport.id)}
                          className={`p-3 rounded-xl text-sm font-bold border flex items-center transition-all ${
                            isActive 
                            ? 'border-primary-500 bg-primary-50 text-primary-700' 
                            : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                           <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${isActive ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                              {isActive && <IconCheck size={12} className="text-white" />}
                           </div>
                           {locale === 'pt-BR' ? sport.namePt : sport.nameEn}
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Services */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                 <h2 className="font-bold text-gray-900 mb-4">{t.services}</h2>
                 <div className="space-y-3">
                    {VENUE_SERVICES.map(service => {
                      const isActive = (editingVenue.services || []).includes(service.id);
                      const labelKey = service.id as keyof typeof t; 
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`w-full p-3 rounded-xl text-sm font-bold border flex items-center justify-between transition-all ${
                            isActive 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                           <div className="flex items-center">
                              <span className="material-symbols-rounded mr-2">{service.icon}</span>
                              {t[labelKey] || service.id} 
                           </div>
                           {isActive && <IconCheck size={18} />}
                        </button>
                      );
                    })}
                 </div>
              </div>

              <div className="pt-4 pb-10">
                 <button
                   type="submit"
                   disabled={saveLoading}
                   className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-800 transition-all flex justify-center items-center"
                 >
                   {saveLoading ? <IconLoader /> : t.updateSuccess.replace('!', '')}
                 </button>
              </div>

           </form>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
        <Link to="/" className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
           <IconChevronLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{t.myVenues}</h1>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24">
        {loading ? (
           <div className="space-y-4">
             {[1,2].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)}
           </div>
        ) : venues.length === 0 ? (
           <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100">
              <div className="text-5xl mb-4 grayscale opacity-50">🏟️</div>
              <p className="font-medium">{t.noData}</p>
           </div>
        ) : (
           venues.map(venue => (
             <div key={venue.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:border-primary-200 transition-all">
                <div className="h-32 w-full relative">
                   <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
                      <IconStar size={14} className="text-yellow-500 mr-1" filled /> {venue.rating}
                   </div>
                </div>
                <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{venue.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                           <IconMapPin size={14} className="mr-1" /> {venue.address}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleEdit(venue)}
                        className="bg-gray-100 p-2 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                         <IconEdit size={20} />
                      </button>
                   </div>
                   
                   <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-3">
                      <div className="flex -space-x-2">
                        {venue.sports.slice(0,3).map(s => {
                           const sp = SPORTS.find(sp => sp.id === s);
                           if (!sp) return null;
                           const Ico = sp.icon;
                           return (
                             <div key={s} className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-400" title={s}>
                                <Ico size={14} />
                             </div>
                           )
                        })}
                      </div>
                      <div className="text-primary-600 font-bold">
                        {formatCurrency(venue.pricePerHour)}<span className="text-xs text-gray-400 font-normal">{t.perHour}</span>
                      </div>
                   </div>
                </div>
             </div>
           ))
        )}
      </div>

      <div className="fixed bottom-24 right-6">
         <button className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-white/20">
            <IconPlus size={32} />
         </button>
      </div>
    </div>
  );
};

export default ManageVenuesPage;
