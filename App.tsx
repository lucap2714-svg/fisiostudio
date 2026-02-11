
import React, { useState, useEffect } from 'react';
import { User } from './types';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import LoginPage from './components/LoginPage';
import KioskMode from './components/KioskMode';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isKioskForced, setIsKioskForced] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fisiostudio_user');
    const kioskLock = localStorage.getItem('fisiostudio_kiosk_locked');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (kioskLock === 'true') setIsKioskForced(true);
    
    setLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('fisiostudio_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fisiostudio_user');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>
  );

  // Prioridade 3.2: Forçar Quiosque se estiver travado (sobrevive ao F5)
  if (isKioskForced) {
    return <KioskMode onExit={() => setIsKioskForced(false)} />;
  }

  if (!currentUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <ProfessionalDashboard user={currentUser} onLogout={logout} />
    </div>
  );
};

export default App;
