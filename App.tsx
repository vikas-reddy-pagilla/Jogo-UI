import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { TRANSLATIONS } from './constants';
import { Locale, Translation, User } from './types';
import { Home, Calendar, Trophy, User as UserIcon, PlusCircle, LayoutDashboard, CheckSquare, MessageCircle } from 'lucide-react';

// Pages
import HomePage from './pages/Home';
import BookPage from './pages/Book';
import EventsPage from './pages/Events';
import ProfilePage from './pages/Profile';
import AuthPage from './pages/Auth';
import HostGamePage from './pages/HostGame';
import OwnerDashboardPage from './pages/OwnerDashboard';
import ChatPage from './pages/Chat';

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
                   <Route path="/host" element={<RequireAuth><HostGamePage /></RequireAuth>} />
                   <Route path="/chat/:eventId" element={<RequireAuth><ChatPage /></RequireAuth>} />
                 </>
               )}

               {/* Owner Routes */}
               {user?.role === 'owner' && (
                 <>
                   <Route path="/" element={<RequireAuth><Layout><OwnerDashboardPage /></Layout></RequireAuth>} />
                   <Route path="/requests" element={<RequireAuth><Layout><OwnerDashboardPage /></Layout></RequireAuth>} />
                   <Route path="/profile" element={<RequireAuth><Layout><ProfilePage /></Layout></RequireAuth>} />
                 </>
               )}

               <Route path="*" element={<Navigate to="/" />} />
             </Routes>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

// --- Helper Components ---

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" />;
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

  const playerNav = [
    { path: '/', icon: Home, label: t.home },
    { path: '/book', icon: Calendar, label: t.book },
    { path: '/events', icon: Trophy, label: t.events },
    { path: '/profile', icon: UserIcon, label: t.profile },
  ];

  const ownerNav = [
    { path: '/', icon: LayoutDashboard, label: t.dashboard },
    { path: '/requests', icon: CheckSquare, label: t.requests },
    { path: '/profile', icon: UserIcon, label: t.profile },
  ];

  const navItems = user?.role === 'owner' ? ownerNav : playerNav;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-gray-50">
        {children}
      </main>

      {/* Floating Action Button (Host Game) - Only for Players */}
      {showFab && user?.role !== 'owner' && (
        <div className="fixed bottom-24 right-6 z-40 max-w-md mx-auto pointer-events-none w-full flex justify-end pr-4 md:pr-0">
           <Link
             to="/host"
             className="pointer-events-auto group bg-primary-600 text-white p-4 rounded-full shadow-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center border-4 border-gray-50"
           >
             <PlusCircle size={32} strokeWidth={2} />
           </Link>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-md mx-auto pb-safe">
        <div className="flex justify-around items-center h-16 pb-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary-50' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;