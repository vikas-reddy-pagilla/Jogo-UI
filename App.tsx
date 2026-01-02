import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { TRANSLATIONS } from './constants';
import { Locale, Translation, User } from './types';
import { 
  IconHome, 
  IconBook, 
  IconEvents, 
  IconProfile, 
  IconPlusCircle, 
  IconDashboard, 
  IconRequests 
} from './components/AppIcons';

// Pages
import HomePage from './pages/Home';
import BookPage from './pages/Book';
import EventsPage from './pages/Events';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import HostGamePage from './pages/HostGame';
import OwnerDashboardPage from './pages/OwnerDashboard';
import ChatPage from './pages/Chat';
import EditProfilePage from './pages/EditProfile';
import ManageVenuesPage from './pages/ManageVenues';

// --- Localization Context ---
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
  formatCurrency: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};

// --- Main App Component ---

const App: React.FC = () => {
  // Locale State
  const [locale, setLocaleState] = useState<Locale>('pt-BR');

  useEffect(() => {
    const savedLocale = localStorage.getItem('app_locale') as Locale;
    if (savedLocale && (savedLocale === 'pt-BR' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app_locale', newLocale);
  };

  const t = TRANSLATIONS[locale];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'pt-BR' ? 'BRL' : 'USD',
    }).format(value);
  };

  // Auth State
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, formatCurrency }}>
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
        <HashRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 md:pb-0 font-sans">
             <Routes>
               <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
               
               {/* Player Routes */}
               {user?.role !== 'owner' && (
                 <>
                   <Route path="/" element={<RequireAuth><Layout showFab><HomePage /></Layout></RequireAuth>} />
                   <Route path="/book" element={<RequireAuth><Layout><BookPage /></Layout></RequireAuth>} />
                   <Route path="/events" element={<RequireAuth><Layout showFab><EventsPage /></Layout></RequireAuth>} />
                   <Route path="/profile" element={<RequireAuth><Layout><ProfilePage /></Layout></RequireAuth>} />
                   <Route path="/profile/edit" element={<RequireAuth><EditProfilePage /></RequireAuth>} />
                   <Route path="/host" element={<RequireAuth><HostGamePage /></RequireAuth>} />
                   <Route path="/chat/:eventId" element={<RequireAuth><ChatPage /></RequireAuth>} />
                 </>
               )}

               {/* Owner Routes */}
               {user?.role === 'owner' && (
                 <>
                   <Route path="/" element={<RequireAuth><Layout><OwnerDashboardPage /></Layout></RequireAuth>} />
                   <Route path="/venues/manage" element={<RequireAuth><Layout><ManageVenuesPage /></Layout></RequireAuth>} />
                   <Route path="/profile" element={<RequireAuth><Layout><ProfilePage /></Layout></RequireAuth>} />
                   <Route path="/profile/edit" element={<RequireAuth><EditProfilePage /></RequireAuth>} />
                 </>
               )}

               <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
             </Routes>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

// --- Helper Components ---

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

interface LayoutProps {
  children: ReactNode;
  showFab?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  
  const isOwner = user?.role === 'owner';

  return (
    <>
      <div className="min-h-screen">
        {children}
      </div>

      {/* Floating Action Button for Host Game (Players only) */}
      {showFab && !isOwner && (
        <Link 
          to="/host"
          className="fixed bottom-24 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white/20"
        >
          <IconPlusCircle size={32} />
        </Link>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="flex justify-around items-center h-16 md:h-20 max-w-lg mx-auto">
          
          {!isOwner ? (
            <>
              <NavLink to="/" icon={IconHome} label={t.home} active={location.pathname === '/'} />
              <NavLink to="/book" icon={IconBook} label={t.book} active={location.pathname === '/book'} />
              <NavLink to="/events" icon={IconEvents} label={t.events} active={location.pathname === '/events'} />
              <NavLink to="/profile" icon={IconProfile} label={t.profile} active={location.pathname === '/profile'} />
            </>
          ) : (
            <>
              <NavLink to="/" icon={IconDashboard} label={t.dashboard} active={location.pathname === '/'} />
              <NavLink to="/venues/manage" icon={IconRequests} label="Venues" active={location.pathname === '/venues/manage'} />
              <NavLink to="/profile" icon={IconProfile} label={t.profile} active={location.pathname === '/profile'} />
            </>
          )}

        </div>
      </nav>
    </>
  );
};

const NavLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${active ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
    <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-primary-50 transform -translate-y-1' : ''}`}>
      <Icon size={24} filled={active} />
      {active && <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>}
    </div>
    <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-0 scale-0'} transition-all duration-300 origin-top`}>
      {label}
    </span>
  </Link>
);

export default App;