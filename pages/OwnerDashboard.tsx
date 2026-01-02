
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { Api } from '../services/api';
import { BookingRequest } from '../types';
import { 
  IconCheck, 
  IconClose, 
  IconClock, 
  IconCalendar, 
  IconUser,
  IconStore,
  IconArrowRight
} from '../components/AppIcons';

const OwnerDashboardPage: React.FC = () => {
  const { t, locale } = useLanguage();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await Api.getBookingRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'decline') => {
    await Api.handleBookingRequest(id, action);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'declined' } : r));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-6 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
         <h1 className="text-2xl font-bold text-gray-900">{t.ownerDashboard}</h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Quick Actions */}
        <Link 
          to="/venues/manage"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg text-white group active:scale-[0.98] transition-all"
        >
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                 <IconStore size={24} className="text-white" />
              </div>
              <div>
                 <h3 className="font-bold text-lg">{t.manageVenues}</h3>
                 <p className="text-xs text-gray-300">Update details & services</p>
              </div>
           </div>
           <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <IconArrowRight size={20} />
           </div>
        </Link>

        {/* Requests List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            {t.pendingRequests} 
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {requests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </h2>
          
          <div className="space-y-4">
            {loading ? (
               [1,2].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)
            ) : requests.length === 0 ? (
               <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
                 <div className="text-4xl mb-3 grayscale opacity-50">📭</div>
                 <p className="font-medium text-sm">{t.noData}</p>
               </div>
            ) : (
              requests.map(req => (
                <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                            <IconUser size={24} />
                         </div>
                         <div>
                            <h3 className="font-bold text-gray-900">{req.userName}</h3>
                            <p className="text-xs text-gray-500">{new Date(req.timestamp).toLocaleTimeString(locale, {hour:'2-digit', minute:'2-digit'})}</p>
                         </div>
                      </div>
                      {req.status !== 'pending' && (
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                           req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      )}
                   </div>

                   <div className="bg-gray-50 p-3 rounded-xl space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                         <IconCalendar size={18} className="mr-2 text-gray-400" />
                         <span className="font-medium">{new Date(req.date).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long'})}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                         <IconClock size={18} className="mr-2 text-gray-400" />
                         <span className="font-medium">{req.slot}</span>
                      </div>
                      <div className="text-xs text-gray-500 pl-6 pt-1 border-t border-gray-200 mt-2">
                         {req.venueName} • {req.courtName}
                      </div>
                   </div>

                   {req.status === 'pending' && (
                     <div className="flex space-x-3">
                        <button 
                          onClick={() => handleAction(req.id, 'decline')}
                          className="flex-1 py-3 border border-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                          <IconClose size={20} className="mr-1" />
                          {t.decline}
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'approve')}
                          className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center shadow-lg"
                        >
                          <IconCheck size={20} className="mr-1" />
                          {t.approve}
                        </button>
                     </div>
                   )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
