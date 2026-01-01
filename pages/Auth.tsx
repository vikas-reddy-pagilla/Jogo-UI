import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { Loader2, User as UserIcon, Building2, Mail, Lock, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

type AuthStep = 'form' | 'verify';

const AuthPage: React.FC = () => {
  const { t, locale, setLocale } = useLanguage();
  const { login } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<AuthStep>('form');
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [error, setError] = useState('');

  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    // Simulate sending OTP
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setStep('verify');
    }, 1000);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock code check
    if (verificationCode !== '1234') {
        setError(t.invalidCode);
        return;
    }

    setLoading(true);
    try {
        const user = await Api.register(name, email, phone, role);
        login(user);
    } catch (err) {
        setError(t.error);
    } finally {
        setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const user = await Api.login(email, role); 
        login(user);
    } catch (err) {
        setError(t.error);
    } finally {
        setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setStep('form');
    setError('');
    setConfirmPassword('');
    setName('');
    setPhone('');
  };

  const LanguageSwitcher = () => (
    <div className="absolute top-6 right-6 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex bg-black/20 rounded-full p-1 backdrop-blur-md border border-white/10">
        <button 
          onClick={() => setLocale('pt-BR')} 
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'pt-BR' ? 'bg-white text-primary-600 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
        >
          PT
        </button>
        <button 
          onClick={() => setLocale('en')} 
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'en' ? 'bg-white text-primary-600 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
        >
          EN
        </button>
      </div>
    </div>
  );

  if (step === 'verify') {
      return (
        <div className="min-h-screen bg-primary-600 flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto relative">
             <LanguageSwitcher />
             <div className="w-full bg-white rounded-3xl p-8 shadow-2xl text-gray-900 transition-all duration-300 relative">
                <button onClick={() => setStep('form')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                
                <div className="text-center mb-6 mt-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.verifyTitle}</h2>
                    <p className="text-sm text-gray-500 mt-2">{t.codeSentTo}</p>
                    <p className="text-sm font-bold text-gray-800">{email}</p>
                    <p className="text-sm font-bold text-gray-800">{phone}</p>
                </div>

                <form onSubmit={handleVerification} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 text-center">{t.enterCode}</label>
                        <input
                            type="text"
                            maxLength={4}
                            required
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full px-4 py-4 text-center text-3xl tracking-[1em] font-black rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none uppercase"
                            placeholder="0000"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg animate-pulse">
                        {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t.verify}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button className="text-sm font-bold text-gray-400 hover:text-primary-600 transition-colors">
                        {t.resendCode}
                    </button>
                </div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-primary-600 flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto relative">
      <LanguageSwitcher />

      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-5xl font-black italic tracking-tighter mb-2">JOGO</h1>
        <p className="text-primary-100 text-lg opacity-80">{t.welcome}</p>
      </div>

      <div className="w-full bg-white rounded-3xl p-8 shadow-2xl text-gray-900 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-900">
          {isRegistering ? t.createAccount : t.login}
        </h2>
        
        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('player')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
              role === 'player' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon size={16} className="mr-2" />
            {t.player}
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
              role === 'owner' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 size={16} className="mr-2" />
            {t.courtOwner}
          </button>
        </div>

        <form onSubmit={isRegistering ? handleRegisterStep1 : handleLogin} className="space-y-4">
          
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.name}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-medium"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.email}</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-medium"
                placeholder="user@example.com"
              />
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
          </div>
          
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.phone}</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-medium"
                  placeholder="(11) 99999-9999"
                />
                <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.password}</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-medium"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          {isRegistering && (
             <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.confirmPassword}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3.5 pl-11 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-medium ${
                    error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-primary-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center text-lg mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? t.register : t.login)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={toggleMode}
            className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            {isRegistering ? t.alreadyHaveAccount : t.register}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;