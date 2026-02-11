
import { 
  Student, ClassSession, Booking, Evolution, Addendum, AuditLog, AppSettings,
  EvolutionStatus, AttendanceStatus, TrainingPlan, Assessment, BillingEvent, BillingStatus,
  Attachment, BackupRecord, SyncLog
} from '../types';
import { INITIAL_SETTINGS, MOCK_STUDENTS } from '../constants';

const DB_NAME = 'FisioStudioDB_v5'; // Versão incrementada para garantir nova estrutura
const STORE_NAME = 'master_store';
const DB_VERSION = 5; 
const STORAGE_MIRROR_KEY = 'fisiostudio_data_v5_mirror';
const DB_VERSION_KEY = 'fisiostudio_db_sync_stable_v5';
const CURRENT_SYNC_VERSION = '2024.05.25.05_PERSISTENCE_LOCKED';

const syncChannel = new BroadcastChannel('fisiostudio_sync');

export const DateUtils = {
  normalize: (date: Date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  getNowTime: () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  },
  getDayName: (date: Date = new Date()) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  },
  getCurrentMonthString: () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
};

class Database {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private operationQueue: Promise<any> = Promise.resolve();

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      
      request.onsuccess = async (event: any) => {
        this.db = event.target.result;
        try {
          await this.ensureInitialData();
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
    
    return this.initPromise;
  }

  /**
   * GARANTIA DE PERSISTÊNCIA:
   * Carrega os mocks apenas se o banco estiver vazio ou versão for incompatível.
   * Prioriza SEMPRE o que já está no banco para não perder edições de horários.
   */
  private async ensureInitialData() {
    const savedVersion = localStorage.getItem(DB_VERSION_KEY);
    const currentData = await this.getRawDataInternal();
    
    // Se já existem dados e a versão é a mesma, NÃO FAZ NADA. Protege edições manuais.
    if (currentData && savedVersion === CURRENT_SYNC_VERSION) {
      console.log("[Database] Dados persistidos carregados com sucesso.");
      return;
    }

    console.warn(`[Database] Aplicando carga inicial/migração: ${CURRENT_SYNC_VERSION}`);
    
    const initial: any = currentData || {
        students: [],
        classes: [],
        bookings: [],
        evolutions: [],
        assessments: {},
        trainingPlans: {},
        syncLogs: [],
        settings: INITIAL_SETTINGS,
        logs: [],
        billingEvents: [],
        updatedAt: Date.now(),
        version: 1
    };

    // Só adiciona os mocks se a lista de alunos estiver vazia
    if (initial.students.length === 0) {
      MOCK_STUDENTS.forEach(mock => {
        initial.students.push({ ...mock, name: this.normalizeName(mock.name) });
      });
    }

    await this.saveRawDataInternal(initial);
    localStorage.setItem(DB_VERSION_KEY, CURRENT_SYNC_VERSION);
    this.notifyUpdate();
  }

  public normalizeName(name: string): string {
    return name.trim().toLowerCase().split(' ').map(w => {
      if (['de','da','do','dos','das','e'].includes(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  private async getRawDataInternal(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve(null);
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('main');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async saveRawDataInternal(data: any): Promise<void> {
    data.updatedAt = Date.now();
    data.version = (data.version || 0) + 1;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("DB not init");
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, 'main');
      transaction.oncomplete = () => {
        localStorage.setItem(STORAGE_MIRROR_KEY, JSON.stringify(data));
        this.notifyUpdate();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  private async enqueueOperation<T>(op: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(op);
    this.operationQueue = result.catch(() => {});
    return result;
  }

  private notifyUpdate() {
    syncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
  }

  public onUpdate(callback: () => void) {
    const handler = (msg: MessageEvent) => {
      if (msg.data?.type === 'DATA_UPDATED') callback();
    };
    syncChannel.addEventListener('message', handler);
    return () => syncChannel.removeEventListener('message', handler);
  }

  // MÉTODOS PÚBLICOS DE ACESSO
  async getStudents(): Promise<Student[]> {
    const data = await this.getRawDataInternal();
    return data?.students || [];
  }

  async saveStudent(student: Student): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const index = data.students.findIndex((s: any) => s.id === student.id);
      if (index >= 0) data.students[index] = student;
      else data.students.push(student);
      await this.saveRawDataInternal(data);
    });
  }

  // Adiciona método syncStudents para corrigir erro em SettingsView
  public async syncStudents(mockStudents: Student[]): Promise<number> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      let addedCount = 0;
      mockStudents.forEach(mock => {
        const exists = data.students.some((s: Student) => s.id === mock.id);
        if (!exists) {
          data.students.push({ ...mock, name: this.normalizeName(mock.name) });
          addedCount++;
        }
      });
      if (addedCount > 0) {
        await this.saveRawDataInternal(data);
      }
      return addedCount;
    });
  }

  async getClasses(): Promise<ClassSession[]> { 
    const data = await this.getRawDataInternal(); 
    return data?.classes || []; 
  }

  async saveClass(c: ClassSession): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const index = data.classes.findIndex((x: any) => x.id === c.id);
      if (index >= 0) data.classes[index] = c;
      else data.classes.push(c);
      await this.saveRawDataInternal(data);
    });
  }

  async getBookings(): Promise<Booking[]> { 
    const data = await this.getRawDataInternal(); 
    return data?.bookings || []; 
  }

  async saveBooking(b: Booking): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const index = data.bookings.findIndex((x: any) => x.id === b.id);
      if (index >= 0) data.bookings[index] = b;
      else data.bookings.push(b);
      await this.saveRawDataInternal(data);
    });
  }

  async deleteBooking(id: string): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      data.bookings = (data.bookings || []).filter((b: any) => b.id !== id);
      await this.saveRawDataInternal(data);
    });
  }

  async markPresent(id: string, method: 'QR' | 'MANUAL'): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const b = data.bookings.find((x: any) => x.id === id);
      if (b) {
        b.status = AttendanceStatus.PRESENT;
        b.checkInMethod = method;
        b.checkInTime = new Date().toISOString();
        await this.saveRawDataInternal(data);
      }
    });
  }

  async markAbsent(id: string, justification: string, userId: string): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const b = data.bookings.find((x: any) => x.id === id);
      if (b) {
        b.status = AttendanceStatus.ABSENT;
        b.manualJustification = justification;
        await this.saveRawDataInternal(data);
      }
    });
  }

  async getSettings(): Promise<AppSettings> { 
    const data = await this.getRawDataInternal(); 
    return data?.settings || INITIAL_SETTINGS; 
  }

  async saveSettings(s: AppSettings): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      data.settings = s;
      await this.saveRawDataInternal(data);
    });
  }

  getLocalDateString(date: Date = new Date()): string {
    return DateUtils.normalize(date);
  }

  getCurrentMonthString(): string {
    return DateUtils.getCurrentMonthString();
  }

  async getLogs(): Promise<AuditLog[]> { 
    const data = await this.getRawDataInternal(); 
    return data?.logs || []; 
  }

  async getSyncLogs(): Promise<SyncLog[]> {
    const data = await this.getRawDataInternal();
    return data?.syncLogs || [];
  }

  async getBillingEvents(): Promise<BillingEvent[]> {
    const data = await this.getRawDataInternal();
    return data?.billingEvents || [];
  }

  async getBackups(): Promise<BackupRecord[]> {
    const data = await this.getRawDataInternal();
    return data?.backups || [];
  }

  async runBackup(type: 'AUTO' | 'MANUAL' = 'MANUAL'): Promise<BackupRecord> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const backup: BackupRecord = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        size: JSON.stringify(data).length,
        status: 'SUCCESS',
        type
      };
      if (!data.backups) data.backups = [];
      data.backups.unshift(backup);
      await this.saveRawDataInternal(data);
      return backup;
    });
  }

  public generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
  }

  async getExportData() {
    return await this.getRawDataInternal();
  }

  async getAssessment(studentId: string): Promise<any> {
    const data = await this.getRawDataInternal();
    return data?.assessments?.[studentId] || null;
  }

  async saveAssessment(a: any): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      if (!data.assessments) data.assessments = {};
      data.assessments[a.studentId] = a;
      await this.saveRawDataInternal(data);
    });
  }

  async getTrainingPlan(studentId: string): Promise<any> {
    const data = await this.getRawDataInternal();
    return data?.trainingPlans?.[studentId] || null;
  }

  async saveTrainingPlan(p: any): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      if (!data.trainingPlans) data.trainingPlans = {};
      data.trainingPlans[p.studentId] = p;
      await this.saveRawDataInternal(data);
    });
  }

  async promoteStudentManual(bookingId: string): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      const b = data.bookings.find((x: any) => x.id === bookingId);
      if (b) {
        b.status = AttendanceStatus.AWAITING;
        await this.saveRawDataInternal(data);
      }
    });
  }

  async logAction(userId: string, action: string, entityType: string, entityId: string, details: string, studentId?: string): Promise<void> {
    return this.enqueueOperation(async () => {
      const data = await this.getRawDataInternal();
      if (!data.logs) data.logs = [];
      const log: AuditLog = { 
        id: this.generateId(), 
        timestamp: new Date().toISOString(), 
        userId, action, entityType, entityId, studentId, details 
      };
      data.logs.unshift(log);
      if (data.logs.length > 5000) data.logs.pop();
      await this.saveRawDataInternal(data);
    });
  }
}

export const db = new Database();
