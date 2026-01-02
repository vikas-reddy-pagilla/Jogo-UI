
import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  IconChevronLeft, 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconLoader, 
  IconShield 
} from '../components/AppIcons';

const EditProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'edit' | 'verify'>('edit');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If sensitive data changed, require OTP
    if (email !== user.email || phone !== user.phoneNumber) {
      setLoading(true);
      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        setStep('verify');
      }, 1000);
    } else {
      // Just update name/avatar
      setLoading(true);
      try {
        const updatedUser = { ...user, name };
        await Api.updateUser(updatedUser);
        login(updatedUser);
        navigate('/profile');
      } catch (e) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== '1234') {
      setError(t.invalidCode);
      return;
    }

    setLoading(true);
    try {
      const updatedUser = { ...user, name, email, phoneNumber: phone };
      await Api.updateUser(updatedUser);
      login(updatedUser);
      navigate('/profile');
    } catch (e) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
          <button onClick={() => setStep('edit')} className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
            <IconChevronLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t.verifyContact}</h1>
        </div>
        
        <div className="p-6 flex-1 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                <IconShield size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t.verifyTitle}</h2>
            <p className="text-sm text-gray-500 mb-6">{t.codeSentTo} {email}</p>
            
            <form onSubmit={handleVerify} className="space-y-6">
               <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 text-center text-3xl tracking-[1em] font-black rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                  placeholder="0000"
               />
               
               {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</div>}
               
               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
               >
                  {loading ? <IconLoader /> : t.verify}
               </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-safe">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
        <Link to="/profile" className="mr-4 p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
           <IconChevronLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{t.personalDetails}</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <form onSubmit={handleSave} className="space-y-5">
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.name}</label>
                 <div className="relative">
                   <input
                     type="text"
                     required
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-medium transition-all"
                   />
                   <div className="absolute left-4 top-3.5 text-gray-400">
                     <IconUser size={20} />
                   </div>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.email}</label>
                 <div className="relative">
                   <input
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-medium transition-all"
                   />
                   <div className="absolute left-4 top-3.5 text-gray-400">
                     <IconMail size={20} />
                   </div>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.phone}</label>
                 <div className="relative">
                   <input
                     type="tel"
                     required
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-medium transition-all"
                   />
                   <div className="absolute left-4 top-3.5 text-gray-400">
                     <IconPhone size={20} />
                   </div>
                 </div>
              </div>

              {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-4"
              >
                {loading ? <IconLoader /> : t.saveChanges}
              </button>
           </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6 px-4">
          {t.verifyTitle}
        </p>
      </div>
    </div>
  );
};

export default EditProfilePage;
