import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { Student, TrainingPlan, TrainingSessionRecord, User, EvolutionStatus } from '../types';

interface TrainingPlanViewProps {
  studentId: string;
  onBack: () => void;
  currentUser: User;
}

const OBJ_OPTIONS = ['Mobilidade', 'Estabilidade', 'Alongamento', 'Fortalecimento'];
const REG_OPTIONS = ['Cintura escapular', 'Tronco / coluna', 'Quadril', 'MMSS', 'MMII'];
const APA_OPTIONS = ['Reformer', 'Chair', 'Barrel', 'Cadillac', 'Solo'];

const Icons = {
  Back: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const DotCheckbox: React.FC<{ label: string, checked: boolean, onChange: (v: boolean) => void, disabled: boolean }> = ({ label, checked, onChange, disabled }) => (
  <div 
    className={`flex items-center gap-2 cursor-pointer transition-all ${disabled ? 'opacity-80 pointer-events-none' : ''}`}
    onClick={() => !disabled && onChange(!checked)}
  >
    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${checked ? 'bg-brand-primary border-brand-primary' : 'bg-white border-slate-300'}`}>
       {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
    </div>
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
  </div>
);

const SessionBlock: React.FC<{ session: TrainingSessionRecord, onChange: (s: TrainingSessionRecord) => void, disabled: boolean }> = ({ session, onChange, disabled }) => {
  const toggleItem = (field: 'objectives' | 'regions' | 'equipment', val: string) => {
    if (disabled) return;
    const current = session[field] || [];
    if (current.includes(val)) {
        onChange({ ...session, [field]: current.filter(v => v !== val) });
    } else {
        onChange({ ...session, [field]: [...current, val] });
    }
  };

  return (
    <div className="border-[3px] border-slate-100 rounded-2xl overflow-hidden bg-white print:break-inside-avoid shadow-sm mb-10">
       <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex justify-between items-center">
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">SESSÃO</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DATA:</span>
            <input 
              type="date" 
              disabled={disabled}
              value={session.date} 
              onChange={e => onChange({...session, date: e.target.value})} 
              className="bg-transparent border-none outline-none font-black text-slate-800 text-[11px] focus:ring-0"
            />
          </div>
       </div>
       
       <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-4">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">OBJETIVO</h4>
             <div className="grid grid-cols-1 gap-2.5">
               {OBJ_OPTIONS.map(opt => <DotCheckbox key={opt} label={opt} checked={session.objectives.includes(opt)} onChange={() => toggleItem('objectives', opt)} disabled={disabled} />)}
             </div>
          </div>
          <div className="space-y-4">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">REGIÃO TRABALHADA</h4>
             <div className="grid grid-cols-1 gap-2.5">
               {REG_OPTIONS.map(opt => <DotCheckbox key={opt} label={opt} checked={session.regions.includes(opt)} onChange={() => toggleItem('regions', opt)} disabled={disabled} />)}
             </div>
          </div>
          <div className="space-y-4">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">APARELHO</h4>
             <div className="grid grid-cols-1 gap-2.5">
               {APA_OPTIONS.map(opt => <DotCheckbox key={opt} label={opt} checked={session.equipment.includes(opt)} onChange={() => toggleItem('equipment', opt)} disabled={disabled} />)}
             </div>
          </div>
       </div>

       <div className="px-6 pb-6 space-y-5">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Como o paciente chegou:</label>
             <textarea 
               disabled={disabled}
               value={session.arrival} 
               onChange={e => onChange({...session, arrival: e.target.value})}
               className="w-full bg-slate-50 border-none rounded-xl p-4 text-[11px] font-bold text-slate-700 min-h-[60px] resize-none focus:ring-1 focus:ring-brand-primary outline-none"
             />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Como o paciente saiu:</label>
             <textarea 
               disabled={disabled}
               value={session.departure} 
               onChange={e => onChange({...session, departure: e.target.value})}
               className="w-full bg-slate-50 border-none rounded-xl p-4 text-[11px] font-bold text-slate-700 min-h-[60px] resize-none focus:ring-1 focus:ring-brand-primary outline-none"
             />
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Observação:</label>
             <textarea 
               disabled={disabled}
               value={session.observations} 
               onChange={e => onChange({...session, observations: e.target.value})}
               className="w-full bg-slate-50 border-none rounded-xl p-4 text-[11px] font-bold text-slate-700 min-h-[60px] resize-none focus:ring-1 focus:ring-brand-primary outline-none"
             />
          </div>
       </div>
    </div>
  );
};

export default function TrainingPlanView({ studentId, onBack, currentUser }: TrainingPlanViewProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const createEmptySession = (): TrainingSessionRecord => ({
    id: db.generateId(),
    date: db.getLocalDateString(),
    objectives: [], regions: [], equipment: [],
    arrival: '', departure: '', observations: ''
  });

  const loadData = async () => {
    const [students, p] = await Promise.all([db.getStudents(), db.getTrainingPlan(studentId)]);
    const s = students.find(x => x.id === studentId);
    if (s) setStudent(s);
    
    if (p) {
      setPlan(p);
    } else {
      setPlan({
        id: db.generateId(), 
        studentId, 
        sessions: [createEmptySession()], 
        status: EvolutionStatus.DRAFT,
        updatedAt: new Date().toISOString(), 
        updatedBy: currentUser.id,
        prescribedBy: currentUser.name,
        prescribedByCrefito: currentUser.crefito
      });
    }
  };

  useEffect(() => { loadData(); }, [studentId]);

  const handleUpdateSession = (idx: number, updated: TrainingSessionRecord) => {
    if (!plan || plan.status === EvolutionStatus.FINALIZED) return;
    const newSessions = [...plan.sessions];
    newSessions[idx] = updated;
    setPlan({ ...plan, sessions: newSessions });
  };

  const handleSave = async (final: boolean = false) => {
    if (!plan || !student) return;
    if (final && !confirm("Deseja FINALIZAR este plano de tratamento? Ele se tornará IMUTÁVEL e auditado.")) return;

    setIsSaving(true);
    try {
        const payload: TrainingPlan = { 
          ...plan, 
          status: final ? EvolutionStatus.FINALIZED : plan.status,
          updatedAt: new Date().toISOString(),
          prescribedBy: plan.prescribedBy || currentUser.name,
          prescribedByCrefito: plan.prescribedByCrefito || currentUser.crefito
        };
        await db.saveTrainingPlan(payload);
        await db.logAction(currentUser.id, final ? 'EVOLUTION_FINALIZED' : 'EVOLUTION_SAVED', 'EVOLUCAO', payload.id, 
          `${final ? 'Finalização' : 'Salvamento'} de Ficha de Evolução para ${student.name}`, student.id);
        await loadData();
        if (final) alert("Ficha de Evolução finalizada com sucesso!");
    } catch (e) {
        alert("Erro ao salvar.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formRef.current || !student) return;
    setIsExporting(true);
    
    const elementToExport = formRef.current;

    // 1. Diagnóstico de Layout (Logs)
    console.group("[PDF Export Diagnosis]");
    console.log("window.scrollY:", window.scrollY);
    console.log("window.scrollX:", window.scrollX);
    console.log("window.devicePixelRatio:", window.devicePixelRatio);
    const rect = elementToExport.getBoundingClientRect();
    console.log("element.getBoundingClientRect():", { top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    console.log("element.scrollSize:", { width: elementToExport.scrollWidth, height: elementToExport.scrollHeight });
    const computedStyle = window.getComputedStyle(elementToExport);
    console.log("computedStyle transform:", computedStyle.transform);
    // Use getPropertyValue for non-standard CSS properties like 'zoom' to avoid TS errors
    console.log("computedStyle zoom:", computedStyle.getPropertyValue('zoom'));
    console.groupEnd();

    // 2. Implementação de Ambiente Isolado
    // Criamos um container temporário fora do fluxo visual e de scroll para garantir captura limpa
    const isolationWrapper = document.createElement('div');
    isolationWrapper.style.position = 'fixed';
    isolationWrapper.style.top = '0';
    isolationWrapper.style.left = '-10000px';
    isolationWrapper.style.width = '210mm'; // Largura exata A4
    isolationWrapper.style.zIndex = '-9999';
    isolationWrapper.style.backgroundColor = '#FFFFFF';
    document.body.appendChild(isolationWrapper);

    // Clonamos o conteúdo
    const clone = elementToExport.cloneNode(true) as HTMLElement;
    
    // 3. Reset de Estilos de Impressão no Clone
    clone.style.width = '210mm';
    clone.style.margin = '0';
    clone.style.padding = '15mm'; // Margens internas consistentes
    clone.style.transform = 'none';
    // Use setProperty for non-standard CSS properties like 'zoom' to avoid TS errors
    clone.style.setProperty('zoom', '1');
    clone.style.position = 'relative';
    clone.style.boxSizing = 'border-box';
    clone.style.overflow = 'visible';
    clone.style.maxHeight = 'none';
    clone.style.height = 'auto';

    isolationWrapper.appendChild(clone);

    const opt = {
      margin: 0, // A margem já foi aplicada no padding do clone para maior controle
      filename: `Evolucao_${student.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 1024, // Viewport virtual estável
        backgroundColor: '#FFFFFF'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await window.html2pdf().from(clone).set(opt).save();
    } catch (e) {
      console.error("Erro na exportação do PDF:", e);
      alert("Erro ao gerar PDF.");
    } finally {
      // 4. Limpeza
      document.body.removeChild(isolationWrapper);
      setIsExporting(false);
    }
  };

  if (!student || !plan) return <div className="p-20 text-center animate-pulse">Carregando...</div>;

  const isFinalized = plan.status === EvolutionStatus.FINALIZED;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-20 px-4 md:px-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <button onClick={onBack} className="p-3 bg-white shadow-premium rounded-xl transition-transform active:scale-90 border border-brand-light/30"><Icons.Back /></button>
        <div className="flex gap-3 w-full sm:w-auto">
          {isFinalized && (
            <div className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-black text-[9px] uppercase tracking-widest shadow-sm">
               <Icons.Lock /> Ficha Finalizada
            </div>
          )}
          <button onClick={handleDownloadPDF} disabled={isExporting} className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-brand-light text-slate-700 font-black rounded-xl text-[10px] uppercase transition-all hover:bg-slate-50 active:scale-95 flex items-center justify-center gap-2">
            <Icons.Download /> {isExporting ? 'Processando...' : 'Exportar PDF'}
          </button>
          {!isFinalized && (
            <>
              <button onClick={() => handleSave(false)} className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary font-black rounded-xl text-[10px] uppercase transition-all hover:bg-brand-bg active:scale-95">Rascunho</button>
              <button onClick={() => handleSave(true)} className="flex-1 sm:flex-none px-8 py-3 bg-brand-primary text-white font-black rounded-xl shadow-glow text-[10px] uppercase transition-all hover:bg-brand-dark active:scale-95">Salvar Definitivo</button>
            </>
          )}
        </div>
      </header>

      {/* Interface Visual da Ficha (Ref para Exportação) */}
      <div 
        ref={formRef} 
        className="bg-white p-10 md:p-14 shadow-premium border border-slate-100 space-y-12 relative overflow-hidden print:shadow-none print:border-none" 
        style={{ 
          minHeight: '297mm', 
          width: '100%', 
          maxWidth: '210mm', 
          margin: '0 auto',
          transform: 'none',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Marca d'água de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none z-0">
          <img src="https://i.postimg.cc/WpmNkxhk/1000225330.jpg" alt="" className="w-full max-w-lg h-auto" />
        </div>

        <header className="flex justify-between items-start gap-8 z-10 relative">
          <div className="flex items-center gap-5">
            <img src="https://i.postimg.cc/WpmNkxhk/1000225330.jpg" alt="Logo" className="w-16 h-16 object-contain grayscale" />
            <div>
              <h1 className="text-2xl font-light text-slate-400 tracking-[0.2em] leading-none mb-1">FISIOSTUDIO</h1>
              <p className="text-[8px] font-bold text-slate-400 tracking-[0.3em] uppercase">Pilates e Fisioterapia</p>
            </div>
          </div>
          <div className="bg-slate-800 px-8 py-3 rounded-lg">
             <h2 className="text-white font-black text-[14px] uppercase tracking-widest">Ficha de Evolução</h2>
          </div>
        </header>

        <div className="z-10 relative space-y-6 pt-6 border-t border-slate-100">
           <div className="flex items-baseline gap-3 border-b border-slate-100 pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NOME DO ALUNO:</span>
              <p className="text-[13px] font-black text-slate-800 uppercase">{student.name}</p>
           </div>
           <div className="flex items-baseline gap-3 border-b border-slate-100 pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FISIOTERAPEUTA RESPONSÁVEL:</span>
              <p className="text-[12px] font-black text-brand-dark uppercase">
                {plan.prescribedBy || currentUser.name} — CREFITO {plan.prescribedByCrefito || currentUser.crefito}
              </p>
           </div>
        </div>

        <div className="z-10 relative space-y-10">
           <div className="flex items-center justify-between border-b-2 border-brand-primary/20 pb-2">
              <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.2em]">SESSÃO DE TRATAMENTO</h3>
           </div>

           <div className="grid grid-cols-1 gap-2">
              {plan.sessions.length > 0 && (
                <SessionBlock 
                  key={plan.sessions[0].id} 
                  session={plan.sessions[0]} 
                  disabled={isFinalized}
                  onChange={(s) => handleUpdateSession(0, s)} 
                />
              )}
           </div>
        </div>

        <footer className="z-10 relative mt-auto pt-10 flex justify-between items-center text-[7px] text-slate-300 font-bold tracking-[0.3em] border-t border-slate-100">
           <span>FISIOSTUDIO • EXCELÊNCIA EM PILATES CLÍNICO</span>
           <span className="uppercase">Página gerada em {new Date().toLocaleDateString('pt-BR')}</span>
        </footer>
      </div>
    </div>
  );
}
