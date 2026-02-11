
import React, { useState, useEffect } from 'react';
import { User, BillingStatus } from '../types';
import StudentsList from './StudentsList';
import ClassesList from './ClassesList';
import ClassDetail from './ClassDetail';
import StudentProfile from './StudentProfile';
import TrainingPlanView from './TrainingPlanView';
import AssessmentFormView from './AssessmentFormView';
import ReportsView from './ReportsView';
import SettingsView from './SettingsView';
import KioskMode from './KioskMode';
import { db } from '../services/db';

interface ProfessionalDashboardProps {
  user: User;
  onLogout: () => void;
}

enum View {
  HOME,
  STUDENTS,
  STUDENT_DETAIL,
  TRAINING_PLAN,
  CLASSES,
  CLASS_DETAIL,
  REPORTS,
  SETTINGS,
  KIOSK,
  ASSESSMENT
}

const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Tablet: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>,
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  Fullscreen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Sync: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
};

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1280);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ activeStudents: 0, classesToday: 0, overdue: 0, emDia: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Build ID para verificação de atualização de deploy
  const BUILD_VERSION = `Build: 2025-05-25 11:30 — Hash: recovery_sync_v15`;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await db.runBackup('AUTO');
    await fetchStats();
    setSyncing(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [students, classes] = await Promise.all([
        db.getStudents(),
        db.getClasses()
      ]);
      setStats({
        activeStudents: students.filter(s => s.active).length,
        classesToday: classes.filter(c => c.date === db.getLocalDateString()).length,
        overdue: students.filter(s => s.billingStatus === BillingStatus.ATRASADO).length,
        emDia: students.filter(s => s.billingStatus === BillingStatus.EM_DIA).length
      });
    } catch (e) {
      console.error("Erro ao carregar estatísticas.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (currentView === View.HOME) fetchStats();
  }, [currentView]);

  const changeView = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl) mainEl.scrollTop = 0;
  };

  const navigateToStudent = (id: string) => {
    setSelectedStudentId(id);
    changeView(View.ASSESSMENT);
  };

  const menuItems = [
    { v: View.HOME, l: 'Início', i: Icons.Home },
    { v: View.STUDENTS, l: 'Alunos', i: Icons.Users },
    { v: View.CLASSES, l: 'Agenda', i: Icons.Calendar },
    { v: View.KIOSK, l: 'Quiosque', i: Icons.Tablet },
    { v: View.REPORTS, l: 'Relatórios', i: Icons.Chart },
    { v: View.SETTINGS, l: 'Configurações', i: Icons.Settings }
  ];

  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <div className="space-y-6 md:space-y-12 animate-in pb-12">
            <header className="px-4 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-tight">
                  Olá, <span className="text-brand-primary">{user.name.split(' ')[0]}!</span>
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-2">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button 
                onClick={handleSync} 
                disabled={syncing}
                className="bg-white px-6 py-3 rounded-2xl shadow-premium border border-brand-light/20 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:text-brand-primary flex items-center gap-3 transition-all active:scale-95"
              >
                <span className={syncing ? 'animate-spin' : ''}><Icons.Sync /></span>
                {syncing ? 'Sincronizando...' : 'Sincronizar Dados'}
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-0">
              {[
                { label: 'Alunos Ativos', val: stats.activeStudents, icon: Icons.Users, color: 'text-slate-800' },
                { label: 'Aulas Hoje', val: stats.classesToday, icon: Icons.Calendar, color: 'text-brand-primary' },
                { label: 'Atrasados', val: stats.overdue, icon: Icons.Alert, color: 'text-red-500' },
                { label: 'Em Dia', val: stats.emDia, icon: Icons.Alert, color: 'text-emerald-500' }
              ].map((s, i) => (
                <div key={i} className={`bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-premium hover:shadow-glow transition-all border border-brand-light/20 flex flex-col justify-between min-h-[140px] md:min-h-[180px] ${loadingStats ? 'opacity-50' : ''}`}>
                  <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <p className={`text-4xl md:text-6xl font-black ${s.color} tracking-tighter leading-none`}>
                      {loadingStats ? '--' : s.val}
                    </p>
                    <span className={`${s.color} opacity-20`}><s.icon /></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 md:p-14 rounded-3xl md:rounded-[4rem] shadow-premium border border-brand-light/10 mx-4 md:mx-0">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 md:mb-12 tracking-tight">Atalhos</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                {menuItems.slice(1, 5).map((item, i) => (
                  <button key={i} onClick={() => changeView(item.v)} className="bg-brand-bg/50 p-6 md:p-12 rounded-3xl md:rounded-[3.5rem] transition-all hover:bg-brand-primary hover:text-white group flex flex-col items-center gap-4 md:gap-6 border border-transparent hover:border-brand-primary/20">
                    <span className="text-brand-primary group-hover:text-white group-hover:scale-110 md:group-hover:scale-125 transition-all duration-300"><item.i /></span>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-center">{item.l}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case View.STUDENTS: return <StudentsList onOpenAssessment={navigateToStudent} onOpenTrainingPlan={id => { setSelectedStudentId(id); changeView(View.TRAINING_PLAN); }} />;
      case View.CLASSES: return <ClassesList onSelectClass={id => { setSelectedClassId(id); changeView(View.CLASS_DETAIL); }} onOpenStudentProfile={navigateToStudent} onOpenTrainingPlan={id => { setSelectedStudentId(id); changeView(View.TRAINING_PLAN); }} />;
      case View.CLASS_DETAIL: return <ClassDetail classId={selectedClassId!} onBack={() => changeView(View.CLASSES)} onOpenStudent={navigateToStudent} onShowQR={() => {}} currentUser={user} />;
      case View.STUDENT_DETAIL: return <StudentProfile studentId={selectedStudentId!} onBack={() => changeView(View.STUDENTS)} currentUser={user} />;
      case View.ASSESSMENT: return <AssessmentFormView studentId={selectedStudentId!} onBack={() => changeView(View.STUDENTS)} currentUser={user} />;
      case View.TRAINING_PLAN: return <TrainingPlanView studentId={selectedStudentId!} onBack={() => changeView(View.STUDENTS)} currentUser={user} />;
      case View.REPORTS: return <ReportsView />;
      case View.SETTINGS: return <SettingsView />;
      case View.KIOSK: return <KioskMode onExit={() => changeView(View.HOME)} />;
      default: return null;
    }
  };

  return (
    <div className="app-container no-print h-full w-full flex bg-brand-bg overflow-hidden">
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <aside className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col p-8 transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl overflow-hidden flex items-center justify-center">
                <img src="https://i.postimg.cc/WpmNkxhk/1000225330.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">FisioStudio</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-4 -mr-2 transition-transform active:scale-90"><Icons.X /></button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button key={item.v} onClick={() => changeView(item.v)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-black transition-all ${currentView === item.v ? 'bg-brand-primary text-white shadow-glow' : 'text-slate-400 hover:bg-brand-bg hover:text-slate-800'}`}>
                <item.i /> <span className="text-sm tracking-wide">{item.l}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>

      <aside className={`hidden lg:flex flex-col h-full bg-white border-r border-brand-light/30 transition-all duration-300 z-[100] shrink-0 ${isSidebarOpen ? 'w-72 shadow-2xl' : 'w-24 shadow-lg'}`}>
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className={`flex items-center gap-4 mb-14 shrink-0 h-12 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-12 h-12 bg-brand-primary rounded-2xl overflow-hidden shadow-glow border-2 border-white flex items-center justify-center shrink-0">
              <img src="https://i.postimg.cc/WpmNkxhk/1000225330.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            {isSidebarOpen && <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase whitespace-nowrap">FisioStudio</h1>}
          </div>
          <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
            {menuItems.map(item => (
              <button key={item.v} onClick={() => changeView(item.v)} className={`w-full flex items-center gap-5 px-4 py-4 rounded-2xl font-black transition-all group ${currentView === item.v ? 'bg-brand-primary text-white shadow-glow' : 'text-slate-400 hover:bg-brand-bg hover:text-slate-800'}`}>
                <span className={`w-6 flex justify-center shrink-0 ${isSidebarOpen ? '' : 'mx-auto'}`}><item.i /></span>
                {isSidebarOpen && <span className="text-sm tracking-wide whitespace-nowrap overflow-hidden">{item.l}</span>}
              </button>
            ))}
          </nav>
          <div className="pt-8 space-y-2 border-t border-brand-bg">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-full flex items-center gap-5 px-4 py-4 rounded-2xl font-black text-slate-400 hover:bg-brand-bg transition-all ${isSidebarOpen ? '' : 'justify-center'}`}>
              <span className={`transition-transform duration-500 ${!isSidebarOpen ? 'rotate-180' : ''}`}><Icons.ChevronLeft /></span>
              {isSidebarOpen && <span className="text-sm">Recolher</span>}
            </button>
            <button onClick={onLogout} className={`w-full flex items-center gap-5 px-4 py-4 rounded-2xl font-black text-red-400 hover:bg-red-50 transition-all ${isSidebarOpen ? '' : 'justify-center'}`}>
              <span><Icons.Logout /></span>
              {isSidebarOpen && <span className="text-sm">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 md:h-24 bg-brand-bg/80 backdrop-blur-3xl border-b border-brand-light/30 flex items-center px-6 md:px-14 shrink-0 z-[90]">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white shadow-premium rounded-xl text-brand-primary mr-4 shrink-0 hover:bg-brand-bg transition-colors"><Icons.Menu /></button>
          
          <div className="flex items-center gap-4 sm:gap-6 ml-auto shrink-0">
            <button 
              onClick={toggleFullscreen} 
              className="p-3 bg-white shadow-premium rounded-xl text-brand-dark hover:text-brand-primary transition-all active:scale-95 border border-brand-light/20"
              title="Tela Cheia"
            >
              <Icons.Fullscreen />
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm md:text-base font-black text-slate-800 tracking-tight leading-none mb-1">{user.name}</p>
              <p className="text-[9px] md:text-[10px] font-black uppercase text-brand-dark tracking-widest opacity-60">
                CREFITO {user.crefito}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary shadow-glow border-2 border-white overflow-hidden shrink-0">
               <img src="https://i.postimg.cc/WpmNkxhk/1000225330.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main id="main-scroll-container" className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-brand-bg relative">
          <div className="max-w-[1600px] mx-auto w-full min-h-full">
            {renderContent()}
          </div>
          
          <footer className="absolute bottom-2 right-4 pointer-events-none">
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{BUILD_VERSION}</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
