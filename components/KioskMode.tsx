
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, DateUtils } from '../services/db';
import { Student, ClassSession, Booking, AttendanceStatus, AppSettings } from '../types';

interface KioskModeProps {
  onExit: () => void;
}

const Icons = {
  Tablet: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>,
  Fullscreen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
};

export default function KioskMode({ onExit }: KioskModeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCheckinItem, setActiveCheckinItem] = useState<{ 
    student: Student, 
    time: string, 
    booking: Booking | null 
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<{ 
    students: Student[], 
    classes: ClassSession[], 
    bookings: Booking[], 
    settings: AppSettings | null 
  }>({
    students: [], classes: [], bookings: [], settings: null
  });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const refreshData = async () => {
    try {
      const [students, classes, bookings, settings] = await Promise.all([
        db.getStudents(), db.getClasses(), db.getBookings(), db.getSettings()
      ]);
      setData({ students, classes, bookings, settings });
      const now = new Date();
      setCurrentTime(now);
      
      // LOG DE DEPURAÇÃO OBRIGATÓRIO
      const todayDayName = DateUtils.getDayName(now);
      const currentHour = now.getHours().toString().padStart(2, '0') + ':00';
      console.log(`[Kiosk Sync] Now: ${now.toLocaleTimeString()} | Slot Alvo: ${todayDayName} ${currentHour}`);
    } catch (e) { console.error("refresh_kiosk_data_error", e); }
  };

  useEffect(() => {
    localStorage.setItem('fisiostudio_kiosk_locked', 'true');
    refreshData();

    // Sincronização reativa via BroadcastChannel
    const unsubscribe = db.onUpdate(() => {
      console.log("[Kiosk] Sincronizando por atualização externa...");
      refreshData();
    });

    // Refresh automático por tempo (30s) para garantir troca de slot HH:00
    const autoRefreshInterval = setInterval(() => {
      refreshData();
    }, 30000);

    // Relógio suave para a UI (1s)
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(autoRefreshInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const currentStudentsList = useMemo(() => {
    const todayStr = DateUtils.normalize(currentTime);
    const todayDayName = DateUtils.getDayName(currentTime);
    const currentHourMins = currentTime.getHours() * 60; // Início da hora cheia atual
    
    // Regra oficial: sessão HH:00 é ativa de HH:00:00 até HH:59:59
    const isActiveSession = (startTime: string) => {
      const [h, m] = startTime.split(':').map(Number);
      const sessionMins = h * 60 + m;
      const nowTotalMins = currentTime.getHours() * 60 + currentTime.getMinutes();
      return nowTotalMins >= sessionMins && nowTotalMins < (sessionMins + 60);
    };

    // 1. Coleta de alunos de sessões explicitamente criadas na Agenda
    const explicitActiveStudents = data.bookings
      .filter(b => b.status !== AttendanceStatus.CANCELLED)
      .map(b => {
        const session = data.classes.find(c => c.id === b.classId && c.date === todayStr);
        if (!session) return null;
        
        if (isActiveSession(session.startTime)) {
          const student = data.students.find(s => s.id === b.studentId);
          if (student && student.active) {
            return { student, time: session.startTime, booking: b };
          }
        }
        return null;
      })
      .filter((x): x is { student: Student, time: string, booking: Booking } => !!x);

    // 2. Coleta de alunos da Grade Fixa (Recuperação automática)
    const fixedStudents = data.students
      .filter(s => s.active && s.studentType === 'Fixo')
      .flatMap(s => {
        return (s.weeklySchedule || [])
          .filter(sc => sc.day === todayDayName)
          .map(sc => {
            if (isActiveSession(sc.time)) {
              // Evita duplicar se já existir um booking criado para este horário
              if (explicitActiveStudents.some(e => e.student.id === s.id && e.time === sc.time)) return null;
              return { student: s, time: sc.time, booking: null };
            }
            return null;
          })
          .filter(x => !!x);
      })
      .filter((x): x is { student: Student, time: string, booking: Booking | null } => !!x);

    const combined = [...explicitActiveStudents, ...fixedStudents];
    
    const finalResult = combined.filter(item => 
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.student.name.localeCompare(b.student.name));

    // LOG DE RENDERIZAÇÃO
    if (finalResult.length > 0) {
      console.log(`[Kiosk Render] Sessão Ativa detectada. Alunos resolvidos: ${finalResult.length}`);
    }

    return finalResult;
  }, [data, searchTerm, currentTime]);

  const startCheckinFlow = (item: { student: Student, time: string, booking: Booking | null }) => {
    setActiveCheckinItem(item);
  };

  const handleFinalConfirm = async () => {
    if (!activeCheckinItem || isConfirming) return;

    setIsConfirming(true);
    let bookingToMark = activeCheckinItem.booking;
    
    try {
      // Se não existe booking, materializa a sessão e a reserva agora
      if (!bookingToMark) {
        const todayStr = DateUtils.normalize(new Date());
        let targetSession = data.classes.find(c => c.date === todayStr && c.startTime === activeCheckinItem.time);
        
        if (!targetSession) {
          const newSession: ClassSession = {
            id: db.generateId(),
            date: todayStr,
            startTime: activeCheckinItem.time,
            durationMinutes: 60,
            capacity: 8,
            status: 'SCHEDULED',
            instructorId: 'system'
          };
          await db.saveClass(newSession);
          targetSession = newSession;
        }

        const newBooking: Booking = {
          id: db.generateId(),
          classId: targetSession.id,
          studentId: activeCheckinItem.student.id,
          status: AttendanceStatus.AWAITING,
          createdAt: new Date().toISOString()
        };
        await db.saveBooking(newBooking);
        bookingToMark = newBooking;
      }

      if (bookingToMark.status === AttendanceStatus.WAITLISTED) {
        alert("Sua vaga está na lista de espera. Por favor, aguarde orientação.");
        setActiveCheckinItem(null);
        return;
      }

      await db.markPresent(bookingToMark.id, 'QR');
      await refreshData();
      setActiveCheckinItem(null);
      setSearchTerm('');
      console.log(`[Kiosk] Presença confirmada com sucesso para: ${activeCheckinItem.student.name}`);
    } catch (err: any) { 
      alert("Erro ao confirmar presença. Tente novamente."); 
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePinSubmit = () => {
    if (pinValue === (data.settings?.kioskExitPin || '1234')) {
      localStorage.removeItem('fisiostudio_kiosk_locked');
      onExit();
    } else {
      setPinValue('');
      alert("PIN Administrativo Incorreto.");
    }
  };

  // UI DO MODAL DE QR CODE / CONFIRMAÇÃO
  const renderCheckinModal = () => {
    if (!activeCheckinItem) return null;

    const today = new Date();
    const dateBR = today.toLocaleDateString('pt-BR');
    const dayName = DateUtils.getDayName(today);
    const customMessage = `Eu, ${activeCheckinItem.student.name}, confirmo minha presença no dia ${dayName} (${dateBR}) às ${activeCheckinItem.time}, no FisioStudio.`;
    const waLink = `https://wa.me/5569993856218?text=${encodeURIComponent(customMessage)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(waLink)}`;

    return (
      <div className="fixed inset-0 z-[500] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in">
        <div className="bg-white rounded-[4rem] p-10 md:p-14 max-w-xl w-full space-y-10 shadow-2xl border-8 border-brand-primary/20 relative">
           {/* BOTÃO X PARA CANCELAR */}
           <button 
             onClick={() => setActiveCheckinItem(null)} 
             className="absolute top-8 right-8 p-4 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
           >
             <Icons.X />
           </button>

           <header className="space-y-4 pt-4">
             <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Validar Presença</h2>
             <p className="text-xl text-brand-dark font-black uppercase tracking-widest leading-tight">{activeCheckinItem.student.name}</p>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sessão das {activeCheckinItem.time}</p>
           </header>
           
           <div className="bg-slate-50 p-8 rounded-[3rem] border-4 border-dashed border-brand-light/30 flex flex-col items-center gap-6">
             <img src={qrUrl} className="aspect-square w-full max-w-[240px]" alt="QR Code" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escaneie para validar sua sessão</p>
           </div>

           <div className="space-y-4 pt-4">
              <button 
                onClick={handleFinalConfirm} 
                disabled={isConfirming}
                className="w-full bg-brand-primary text-white py-8 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-glow hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50"
              >
                {isConfirming ? 'Registrando...' : 'CONFIRMAR PRESENÇA'}
              </button>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">A presença só será registrada ao clicar no botão acima.</p>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[400] bg-brand-bg flex flex-col overflow-hidden animate-in">
      <header className="bg-brand-primary p-6 md:p-10 flex justify-between items-center shadow-xl shrink-0">
        <div className="flex items-center gap-6 text-white">
           <Icons.Tablet />
           <div><h1 className="text-2xl font-black tracking-tighter uppercase">FisioStudio Quiosque</h1></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/20 px-6 py-4 rounded-2xl text-white font-black text-2xl shadow-inner tabular-nums">
             {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex gap-4">
            <button onClick={toggleFullscreen} className="p-4 bg-white/20 text-white rounded-2xl hidden sm:block transition-transform active:scale-90"><Icons.Fullscreen /></button>
            <button onClick={refreshData} className="p-4 bg-white/20 text-white rounded-2xl transition-transform active:scale-90"><Icons.Refresh /></button>
            <button onClick={() => setIsPinModalOpen(true)} className="bg-white/10 text-white p-4 rounded-2xl border border-white/20 transition-transform active:scale-90"><Icons.Lock /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-14 max-w-5xl mx-auto w-full flex flex-col overflow-hidden">
        <div className="relative mb-12">
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-brand-dark"><Icons.Search /></span>
          <input 
            type="text" 
            placeholder="Digite seu nome para confirmar..." 
            className="w-full pl-24 pr-10 py-12 rounded-[4rem] shadow-2xl text-3xl outline-none border-4 border-transparent focus:border-brand-primary bg-white font-black placeholder:text-slate-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
          {currentStudentsList.length === 0 ? (
            <div className="text-center py-28 bg-white/40 rounded-[4rem] border-4 border-dashed border-brand-light/30">
               <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xl">Aguardando sessão ativa...</p>
               <p className="text-slate-400 text-sm mt-4 font-bold uppercase tracking-widest opacity-60">Sessões iniciam em horários cheios (Ex: 08:00, 09:00).</p>
            </div>
          ) : (
            currentStudentsList.map(item => {
              const isPresent = item.booking?.status === AttendanceStatus.PRESENT;
              
              return (
                <button 
                  key={`${item.student.id}-${item.time}`} 
                  disabled={isPresent}
                  onClick={() => startCheckinFlow(item)} 
                  className={`w-full bg-white p-10 rounded-[4rem] shadow-premium hover:shadow-glow flex items-center justify-between transition-all border-4 ${isPresent ? 'opacity-50 border-emerald-500' : 'border-transparent active:scale-95 hover:border-brand-light/20'}`}
                >
                  <div className="flex items-center gap-10 text-left">
                     <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-3xl ${isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-bg text-brand-dark'}`}>
                      {item.student.name.charAt(0)}
                     </div>
                     <div>
                       <h4 className="text-3xl font-black text-slate-800 leading-tight">{item.student.name}</h4>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Horário agendado: {item.time}</p>
                     </div>
                  </div>
                  <div className={`${isPresent ? 'bg-emerald-500' : 'bg-brand-primary'} text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-glow`}>
                    {isPresent ? 'Presença Validada' : 'Confirmar Presença'}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </main>

      {renderCheckinModal()}

      {isPinModalOpen && (
        <div className="fixed inset-0 z-[600] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setIsPinModalOpen(false)}>
           <div className="bg-white w-full max-w-md rounded-[4rem] p-14 text-center border-8 border-brand-light/20 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-black text-slate-800 uppercase mb-12 tracking-tight">Sair do Quiosque</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Digite o PIN Administrativo</p>
              <input 
                type="password" 
                maxLength={4}
                className="w-full text-center text-6xl font-black py-10 bg-brand-bg rounded-[2rem] outline-none tracking-[0.5em] mb-10 border-4 border-transparent focus:border-brand-primary"
                value={pinValue}
                onChange={e => setPinValue(e.target.value)}
                autoFocus
              />
              <div className="flex gap-4">
                <button onClick={() => setIsPinModalOpen(false)} className="flex-1 py-6 bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
                <button onClick={handlePinSubmit} className="flex-1 py-6 bg-brand-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow">Confirmar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
