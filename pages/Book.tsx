
import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { MOCK_VENUES } from '../services/mockData';
import { Api } from '../services/api';
import { 
  IconSuccess, 
  IconCalendar, 
  IconClock, 
  IconChevronLeft, 
  IconCourt, 
  IconCreditCard, 
  IconQrCode, 
  IconStore,
  IconStar,
  IconLoader,
  IconCheck,
  IconMapPin
} from '../components/AppIcons';
import { SPORTS } from '../constants';
import { Venue } from '../types';
import { Link, useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3 | 4;

const BookPage: React.FC = () => {
  const { t, locale, formatCurrency } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1); 
  // 1: Sport, 2: Venue, 3: Date/Time/Duration, 4: Checkout/Confirm
  
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [selectedCourtName, setSelectedCourtName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'venue'>('pix');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    setStep(2);
  };

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setStep(3);
  };

  const handleSlotSelect = (slot: string, courtId: string, courtName: string) => {
    setSelectedSlot(slot);
    setSelectedCourt(courtId);
    setSelectedCourtName(courtName);
    setStep(4);
  };

  const handleBack = () => {
    setStep(prev => (prev > 1 ? prev - 1 : 1) as Step);
  };

  const handleBooking = async () => {
    if (!selectedVenue || !selectedCourt || !selectedSlot || !selectedSport) return;
    
    setLoading(true);
    try {
      await Api.bookVenue(
        selectedVenue.id,
        selectedCourt,
        selectedDate,
        selectedSlot,
        selectedSport
      );
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mock slots generator
  const getSlots = () => {
    if (!selectedVenue || !selectedSport) return [];
    const sportCourts = selectedVenue.courts.filter(c => c.sport === selectedSport);
    const slots = [];
    const startHour = 8;
    const endHour = 22;

    for (let h = startHour; h < endHour; h++) {
      // Randomly assign availability and court
      if (Math.random() > 0.3 && sportCourts.length > 0) {
        const court = sportCourts[Math.floor(Math.random() * sportCourts.length)];
        slots.push({
          time: `${h}:00 - ${h + 1}:00`,
          courtId: court.id,
          courtName: court.name,
          price: selectedVenue.pricePerHour
        });
      }
    }
    return slots;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
          <IconSuccess size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.success}</h1>
        <p className="text-gray-500 mb-8">{t.confirmBooking}</p>
        
        <div className="space-y-3 w-full max-w-xs">
          <Link to="/" className="block w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all">
            {t.home}
          </Link>
          <Link to="/profile" className="block w-full py-4 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
            {t.myBookings}
          </Link>
        </div>
      </div>
    );
  }

  // --- Step 1: Select Sport ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
          <Link to="/" className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
             <IconChevronLeft />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{t.selectSport}</h1>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {SPORTS.map(sport => {
            const SportIcon = sport.icon;
            return (
              <button
                key={sport.id}
                onClick={() => handleSportSelect(sport.id)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center aspect-square hover:border-primary-200 hover:shadow-md transition-all group active:scale-95"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                  <SportIcon size={32} className="text-gray-700 group-hover:text-primary-600" />
                </div>
                <span className="font-bold text-gray-900">{locale === 'pt-BR' ? sport.namePt : sport.nameEn}</span>
              </button>
            )
          })}
        </div>
      </div>
    );
  }

  // --- Step 2: Select Venue ---
  if (step === 2) {
    const filteredVenues = MOCK_VENUES.filter(v => v.sports.includes(selectedSport || ''));
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
          <button onClick={handleBack} className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
             <IconChevronLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t.selectVenue}</h1>
        </div>
        
        <div className="p-6 space-y-4">
           {filteredVenues.length === 0 ? (
             <div className="text-center py-10 text-gray-400">{t.noData}</div>
           ) : (
             filteredVenues.map(venue => (
                <button 
                  key={venue.id}
                  onClick={() => handleVenueSelect(venue)}
                  className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 text-left group hover:border-primary-200 transition-all active:scale-[0.99]"
                >
                  <div className="h-32 w-full relative">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
                      <IconStar size={14} className="text-yellow-500 mr-1" filled /> {venue.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{venue.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                       <IconMapPin size={16} className="mr-1 text-gray-400"/> 
                       <span className="truncate">{venue.address}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                      <div className="text-xs text-gray-400 font-medium">
                        {venue.distanceKm} {t.distance}
                      </div>
                      <div className="text-primary-600 font-bold">
                        {formatCurrency(venue.pricePerHour)}<span className="text-xs text-gray-400 font-normal">{t.perHour}</span>
                      </div>
                    </div>
                  </div>
                </button>
             ))
           )}
        </div>
      </div>
    );
  }

  // --- Step 3: Select Date & Slot ---
  if (step === 3 && selectedVenue) {
    const slots = getSlots();

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
          <button onClick={handleBack} className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
             <IconChevronLeft />
          </button>
          <div>
             <h1 className="text-lg font-bold text-gray-900 leading-tight">{selectedVenue.name}</h1>
             <p className="text-xs text-gray-500">{t.selectTime}</p>
          </div>
        </div>

        <div className="p-6">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.date}</label>
              <input 
                type="date" 
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-primary-100"
              />
           </div>

           <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                 <IconClock size={20} className="mr-2 text-gray-400" />
                 {t.slotsAvailable}
              </h3>
              
              {slots.length === 0 ? (
                 <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    {t.noSlotsAvailable}
                 </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                   {slots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSlotSelect(slot.time, slot.courtId, slot.courtName)}
                        className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-primary-500 hover:ring-1 hover:ring-primary-500 transition-all text-left group"
                      >
                         <div className="font-bold text-gray-900 group-hover:text-primary-700">{slot.time}</div>
                         <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                            <span>{slot.courtName}</span>
                         </div>
                      </button>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  // --- Step 4: Confirm ---
  if (step === 4 && selectedVenue) {
    return (
       <div className="min-h-screen bg-gray-50 pb-safe">
         <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
           <button onClick={handleBack} className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
              <IconChevronLeft />
           </button>
           <h1 className="text-xl font-bold text-gray-900">{t.checkout}</h1>
         </div>

         <div className="p-6 space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
               <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-50">
                  <img src={selectedVenue.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                     <h3 className="font-bold text-gray-900 leading-tight">{selectedVenue.name}</h3>
                     <p className="text-xs text-gray-500 mt-1">{selectedVenue.address}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500 flex items-center"><IconCalendar size={18} className="mr-2" /> {t.date}</span>
                     <span className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString(locale)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500 flex items-center"><IconClock size={18} className="mr-2" /> {t.time}</span>
                     <span className="font-bold text-gray-900">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500 flex items-center"><IconCourt size={18} className="mr-2" /> {t.court}</span>
                     <span className="font-bold text-gray-900">{selectedCourtName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50 mt-2">
                     <span className="text-gray-900 font-bold">{t.total}</span>
                     <span className="font-black text-xl text-primary-600">{formatCurrency(selectedVenue.pricePerHour)}</span>
                  </div>
               </div>
            </div>

            {/* Payment Method */}
            <div>
               <h3 className="font-bold text-gray-900 mb-3">{t.paymentMethod}</h3>
               <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-100 bg-white'}`}
                  >
                     <div className="flex items-center">
                        <IconQrCode size={24} className={paymentMethod === 'pix' ? 'text-primary-600' : 'text-gray-400'} />
                        <span className={`ml-3 font-bold ${paymentMethod === 'pix' ? 'text-primary-900' : 'text-gray-600'}`}>{t.pix}</span>
                     </div>
                     {paymentMethod === 'pix' && <IconCheck size={20} className="text-primary-600" />}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${paymentMethod === 'credit_card' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-100 bg-white'}`}
                  >
                     <div className="flex items-center">
                        <IconCreditCard size={24} className={paymentMethod === 'credit_card' ? 'text-primary-600' : 'text-gray-400'} />
                        <span className={`ml-3 font-bold ${paymentMethod === 'credit_card' ? 'text-primary-900' : 'text-gray-600'}`}>{t.creditCard}</span>
                     </div>
                     {paymentMethod === 'credit_card' && <IconCheck size={20} className="text-primary-600" />}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('venue')}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${paymentMethod === 'venue' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-100 bg-white'}`}
                  >
                     <div className="flex items-center">
                        <IconStore size={24} className={paymentMethod === 'venue' ? 'text-primary-600' : 'text-gray-400'} />
                        <span className={`ml-3 font-bold ${paymentMethod === 'venue' ? 'text-primary-900' : 'text-gray-600'}`}>{t.payAtVenue}</span>
                     </div>
                     {paymentMethod === 'venue' && <IconCheck size={20} className="text-primary-600" />}
                  </button>
               </div>
            </div>

            <div className="pt-4 pb-20">
               <button
                 onClick={handleBooking}
                 disabled={loading}
                 className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-200 active:scale-[0.98] transition-all flex justify-center items-center text-lg"
               >
                 {loading ? <IconLoader /> : t.confirmBooking}
               </button>
            </div>
         </div>
       </div>
    );
  }

  return null;
};

export default BookPage;
