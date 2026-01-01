import React, { useState } from 'react';
import { useLanguage } from '../App';
import { MOCK_VENUES, MOCK_BOOKINGS } from '../services/mockData';
import { Api } from '../services/api';
import { CheckCircle, Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { SPORTS } from '../constants';
import { Venue } from '../types';
import { Link } from 'react-router-dom';

const BookPage: React.FC = () => {
  const { t, locale, formatCurrency } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); 
  // 1: Sport, 2: Venue, 3: Date/Time/Duration, 4: Confirm
  
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(1); // 1 = 1h, 1.5 = 1h30, 2 = 2h
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter venues by sport
  const filteredVenues = selectedSport 
    ? MOCK_VENUES.filter(v => v.sports.includes(selectedSport))
    : MOCK_VENUES;

  // Expanded start times for a full day
  const startTimes = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
    '19:00', '20:00', '21:00', '22:00'
  ];
  
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      weekday: d.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString(locale, { month: 'short' })
    };
  });

  const getEndTime = (start: string, durationHours: number) => {
    const [h, m] = start.split(':').map(Number);
    const totalMinutes = h * 60 + m + (durationHours * 60);
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const isSlotBooked = (venueId: string, courtName: string, dateIso: string, startTime: string, durationHours: number) => {
    // Convert time string to minutes for comparison
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const startMin = toMinutes(startTime);
    const endMin = startMin + (durationHours * 60);

    return MOCK_BOOKINGS.some(b => {
      if (b.venueId !== venueId) return false;
      if (b.courtName !== courtName) return false;
      // Compare dates (assuming bookings are ISO strings)
      if (b.date.split('T')[0] !== dateIso) return false;

      // Check time overlap
      const [bStartStr, bEndStr] = b.slot.split(' - ');
      const bStartMin = toMinutes(bStartStr);
      const bEndMin = toMinutes(bEndStr);

      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return startMin < bEndMin && endMin > bStartMin;
    });
  };

  const handleBook = async () => {
    if (!selectedVenue || !selectedDate || !selectedSlot || !selectedCourt || !selectedSport) return;
    setBookingLoading(true);
    // In real app, pass duration/endTime
    await Api.bookVenue(selectedVenue.id, selectedCourt, selectedDate, selectedSlot, selectedSport);
    setBookingLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="h-full min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce border-4 border-green-100">
          <CheckCircle className="text-green-600 w-12 h-12" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.success}</h2>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">{t.confirmBooking}</p>
        <Link to="/" className="w-full block bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-200 hover:shadow-primary-300 transition-all transform hover:-translate-y-1">
          {t.home}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Custom Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-20 border-b border-gray-100/50 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between mb-4">
           {step > 1 && (
             <button onClick={() => setStep(prev => prev - 1 as any)} className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100">
               <ChevronLeft />
             </button>
           )}
           <h1 className="text-lg font-bold text-gray-900 flex-1 text-center pr-8">{t.book}</h1>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
               <div 
                 className={`h-full bg-primary-600 transition-all duration-500 ease-out ${step >= i ? 'w-full' : 'w-0'}`}
               />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-w-lg mx-auto w-full">
        
        {/* Step 1: Select Sport */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.selectSport}</h2>
            <div className="grid grid-cols-2 gap-4">
              {SPORTS.map(sport => (
                <button
                  key={sport.id}
                  onClick={() => { setSelectedSport(sport.id); setStep(2); }}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center aspect-square"
                >
                  <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{sport.icon}</span>
                  <span className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">{locale === 'pt-BR' ? sport.namePt : sport.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Venue */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-900">{t.selectVenue}</h2>
               <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                 {SPORTS.find(s => s.id === selectedSport)?.nameEn}
               </span>
            </div>
            
            <div className="space-y-4">
              {filteredVenues.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVenue(v); setStep(3); setSelectedDate(dates[0].iso); }}
                  className="w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 active:scale-[0.98] transition-transform hover:shadow-md text-left"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={v.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{v.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                       <MapPin size={14} className="mr-1 text-gray-400"/> {v.address}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                       <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                         {v.distanceKm} {t.distance}
                       </span>
                       <div className="text-primary-600 font-bold">
                         {formatCurrency(v.pricePerHour)}<span className="text-xs text-gray-400 font-normal">{t.perHour}</span>
                       </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time & Duration */}
        {step === 3 && selectedVenue && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">{selectedVenue.name}</h2>
                  <p className="text-xs text-gray-500">{selectedVenue.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{formatCurrency(selectedVenue.pricePerHour)}</p>
                  <p className="text-[10px] text-gray-400">per hour</p>
                </div>
             </div>

             {/* Duration Selector */}
             <div className="mb-8">
               <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                 <Clock size={16} className="mr-2 text-primary-600"/> Duração
               </label>
               <div className="flex bg-gray-100 p-1 rounded-xl">
                 {[1, 1.5, 2].map(hrs => (
                   <button
                     key={hrs}
                     onClick={() => { setDuration(hrs); setSelectedSlot(null); }}
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                       duration === hrs 
                         ? 'bg-white text-primary-600 shadow-sm' 
                         : 'text-gray-500 hover:text-gray-700'
                     }`}
                   >
                     {hrs === 1 ? '60 min' : hrs === 1.5 ? '90 min' : '120 min'}
                   </button>
                 ))}
               </div>
             </div>
             
             {/* Date Picker */}
             <div className="mb-8">
                <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
                   <CalendarIcon size={16} className="mr-2 text-primary-600"/> {t.date}
                </label>
                <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
                  {dates.map(d => (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`flex-shrink-0 w-[4.5rem] h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                        selectedDate === d.iso
                          ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200 scale-105'
                          : 'bg-white text-gray-500 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-80">{d.weekday}</span>
                      <span className="text-xl font-bold">{d.day}</span>
                      <span className="text-[9px] font-medium opacity-60">{d.month}</span>
                    </button>
                  ))}
                </div>
             </div>

             {/* Courts & Slots */}
             <div className="space-y-8">
                {selectedVenue.courts.filter(c => c.sport === selectedSport).map(court => (
                   <div key={court.id}>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center pl-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
                         {court.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {startTimes.map(startTime => {
                          const endTime = getEndTime(startTime, duration);
                          const isBooked = isSlotBooked(selectedVenue.id, court.name, selectedDate!, startTime, duration);
                          const isSelected = selectedSlot === startTime && selectedCourt === court.id;
                          
                          return (
                            <button
                              key={startTime}
                              disabled={isBooked}
                              onClick={() => { setSelectedSlot(startTime); setSelectedCourt(court.id); }}
                              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-100 scale-[1.02]' 
                                  : isBooked
                                    ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed decoration-slice'
                                    : 'bg-white text-gray-700 border-gray-100 hover:border-primary-200 hover:shadow-sm'
                              }`}
                            >
                               {startTime} - {endTime}
                               {isBooked && <span className="ml-2 text-[10px] bg-gray-200 px-1 rounded text-gray-500 font-normal">Booked</span>}
                            </button>
                          );
                        })}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Floating Footer Step 3 */}
        {step === 3 && selectedSlot && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 max-w-md mx-auto">
             <div className="flex justify-between items-center mb-3 px-1">
                <div>
                   <p className="text-xs text-gray-500 font-medium">{t.total}</p>
                   <p className="text-xl font-bold text-gray-900">{formatCurrency((selectedVenue?.pricePerHour || 0) * duration)}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500 font-medium">{t.time}</p>
                   <p className="text-sm font-bold text-gray-900">{selectedSlot} - {getEndTime(selectedSlot!, duration)}</p>
                </div>
             </div>
             <button 
               onClick={() => setStep(4)}
               className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98] transition-all"
             >
               {t.submit}
             </button>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && selectedVenue && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.confirmBooking}</h2>
             
             <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 mb-6">
                <div className="flex items-center space-x-4 border-b border-gray-50 pb-6 mb-6">
                   <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                      <img src={selectedVenue.imageUrl} className="w-full h-full object-cover" alt=""/>
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 text-lg">{selectedVenue.name}</h3>
                      <p className="text-sm text-gray-500">{selectedVenue.address}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 text-gray-400"><CalendarIcon size={14}/></div>
                         {t.date}
                      </div>
                      <span className="font-bold text-gray-900">{new Date(selectedDate!).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long'})}</span>
                   </div>
                   
                   <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 text-gray-400"><Clock size={14}/></div>
                         {t.time}
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-gray-900 block">{selectedSlot} - {getEndTime(selectedSlot!, duration)}</span>
                         <span className="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-full">{duration === 1 ? '60 min' : duration === 1.5 ? '90 min' : '120 min'}</span>
                      </div>
                   </div>

                   <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 text-gray-400"><Info size={14}/></div>
                         {t.court}
                      </div>
                      <span className="font-bold text-gray-900">{selectedVenue.courts.find(c => c.id === selectedCourt)?.name}</span>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                   <div className="flex justify-between items-end">
                      <span className="text-gray-500 font-medium">{t.total}</span>
                      <span className="text-3xl font-bold text-primary-600 tracking-tight">{formatCurrency(selectedVenue.pricePerHour * duration)}</span>
                   </div>
                </div>
             </div>
             
             <button 
               onClick={handleBook}
               disabled={bookingLoading}
               className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98] transition-all flex items-center justify-center text-lg"
             >
               {bookingLoading ? t.loading : t.confirmBooking}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;