
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AppSettings, BackupRecord } from '../types';
import { INITIAL_SETTINGS, MOCK_STUDENTS } from '../constants';

const Icons = {
  Backup: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
};

export default function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [backupRunning, setBackupRunning] = useState(false);
  const [syncRunning, setSyncRunning] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const [s, b] = await Promise.all([db.getSettings(), db.getBackups()]);
      setSettings(s);
      setBackups(b);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await db.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleManualBackup = async () => {
    setBackupRunning(true);
    await db.runBackup('MANUAL');
    const b = await db.getBackups();
    setBackups(b);
    setTimeout(() => setBackupRunning(false), 1000);
  };

  const handleSyncStudents = async () => {
    if (!confirm("Deseja sincronizar o cadastro de alunos com a lista oficial? Isso corrigirá a contagem para 62 alunos.")) return;
    setSyncRunning(true);
    try {
      const added = await db.syncStudents(MOCK_STUDENTS);
      alert(`Sincronização concluída! O sistema agora possui os 62 alunos da lista oficial.`);
    } catch (e) {
      alert("Erro na sincronização.");
    } finally {
      setSyncRunning(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Carregando...</div>;

  return (
    <div className="max-w-4xl space-y-10 animate-in pb-20 px-4 md:px-0">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Configurações</h2>
        <p className="text-brand-dark font-bold uppercase tracking-widest text-[10px]">Ajustes do Estúdio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] shadow-premium border border-brand-light/30 p-10 space-y-8">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-3"><span className="w-1.5 h-6 bg-brand-primary rounded-full"></span> Quiosque</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-brand-dark uppercase tracking-widest">PIN de Saída</label>
              <input type="password" value={settings.kioskExitPin} onChange={e => setSettings({...settings, kioskExitPin: e.target.value})} className="w-full px-5 py-4 border-2 border-brand-bg rounded-2xl font-bold tracking-[1em]" maxLength={4} />
            </div>
          </div>
          <button onClick={handleSave} className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-glow">Salvar Alterações</button>
        </div>

        <div className="bg-white rounded-[3rem] shadow-premium border border-brand-light/30 p-10 space-y-8 flex flex-col">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-3"><span className="w-1.5 h-6 bg-brand-primary rounded-full"></span> Banco de Dados</h3>
           
           <div className="space-y-4">
              <button 
                onClick={handleSyncStudents} 
                disabled={syncRunning}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-glow transition-all active:scale-95"
              >
                <Icons.Users /> {syncRunning ? 'SINCRONIZANDO...' : 'Sincronizar Alunos (62)'}
              </button>

              <button onClick={handleManualBackup} disabled={backupRunning} className="w-full bg-slate-800 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
                <Icons.Backup /> {backupRunning ? 'SALVANDO...' : 'Backup Local Agora'}
              </button>
           </div>

           <div className="flex-1 space-y-3 overflow-y-auto max-h-[160px] pr-2 mt-4 custom-scrollbar">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Histórico de Backups</p>
              {backups.map(b => (
                <div key={b.id} className="p-3 bg-brand-bg/20 rounded-xl border border-white flex justify-between items-center">
                  <div className="text-[9px] font-black text-slate-700">{new Date(b.timestamp).toLocaleString('pt-BR')}</div>
                  <Icons.Check />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
