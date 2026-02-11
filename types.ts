
export enum UserRole {
  PROFESSIONAL = 'PROFESSIONAL',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  AWAITING = 'AWAITING',
  WAITLISTED = 'WAITLISTED',
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  CANCELLED = 'CANCELLED'
}

export enum EvolutionStatus {
  NOT_STARTED = 'NOT_STARTED',
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED'
}

export enum BillingStatus {
  EM_DIA = 'EM_DIA',
  ATRASADO = 'ATRASADO',
  SEM_INFO = 'SEM_INFO'
}

export type StudentType = 'Fixo' | 'Avulso' | 'Wellhub';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone?: string;
  crefito?: string;
}

export interface StudentSchedule {
  day: string;
  time: string;
  calendarEventId?: string; // Vínculo com Google Calendar
}

export interface Student extends User {
  active: boolean;
  studentType: StudentType;
  birthDate?: string;
  weeklyDays: string[]; 
  weeklySchedule: StudentSchedule[]; 
  billingStatus: BillingStatus;
  billingNotes?: string;
  fixedMonthlyFee?: number;
  fixedDueDay?: number;
  fixedLastPaidMonth?: string; 
  avulsoPricePerSession?: number;
  avulsoSessionCredits?: number;
  wellhubEligibilityStatus?: 'ATIVO' | 'INATIVO';
  lastPaymentDate?: string;
}

export interface ClassSession {
  id: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  instructorId: string;
  calendarEventId?: string; // ID único do Google Calendar
  lastSyncedAt?: string;
}

export interface Booking {
  id: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkInMethod?: 'QR' | 'MANUAL';
  manualJustification?: string;
  createdAt: string;
  calendarEventId?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  userId: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  calendarEventId?: string;
  status: 'SUCCESS' | 'ERROR';
  message: string;
}

// Interface Evolution para Ficha de Evolução
export interface Evolution {
  id: string;
  studentId: string;
  date: string;
  content: {
    complaint: string;
    intercurrences: string;
    exercises: string;
  };
  status: EvolutionStatus;
  finalizedAt?: string;
  updatedBy?: string;
}

// Interface Addendum para registros adicionais
export interface Addendum {
  id: string;
  evolutionId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

// Interface Attachment para anexos de alunos
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Outras interfaces permanecem iguais...
export interface TrainingPlan {
  id: string;
  studentId: string;
  sessions: TrainingSessionRecord[];
  status: EvolutionStatus;
  updatedAt: string;
  updatedBy: string;
  prescribedBy?: string;
  prescribedByCrefito?: string;
}

export interface TrainingSessionRecord {
  id: string;
  date: string;
  objectives: string[];
  regions: string[];
  equipment: string[];
  arrival: string;
  departure: string;
  observations: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  registrationNumber?: string;
  assessmentDate: string;
  prescribedBy?: string;
  prescribedByCrefito?: string;
  birthDate?: string;
  profession?: string;
  phone?: string;
  practicedPilates?: boolean;
  pilatesTime?: string;
  mainComplaint?: string;
  hda?: string;
  hpp?: string;
  conditions: {
    diabetes: boolean; hypertension: boolean; heartProblem: boolean; lesion: boolean;
    lesionDetail: string; surgery: boolean; labyrinthitis: boolean; reflux: boolean;
  };
  medications?: string;
  exams?: string;
  physicalActivity?: boolean;
  activityDetail?: string;
  initialDifficulties?: string;
  goals: {
    posture: boolean; stress: boolean; stretching: boolean; pain: boolean;
    fitness: boolean; strengthening: boolean; others: boolean; othersDetail: string;
  };
  status?: EvolutionStatus;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName?: string;
  userCrefito?: string;
  action: string; 
  entityType: string; 
  entityId: string;
  studentId?: string;
  details: string;
  metadata?: any;
}

export interface AppSettings {
  checkInWindowMinutes: number;
  defaultCapacity: number;
  kioskWindowBeforeMinutes: number;
  kioskWindowAfterMinutes: number;
  kioskExitPin: string;
  kioskQrTimeoutSeconds: number;
  kioskRefreshIntervalSeconds: number;
  googleCalendarId?: string;
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  size: number;
  status: 'SUCCESS' | 'FAILED';
  type: 'AUTO' | 'MANUAL';
}

export interface BillingEvent {
  id: string;
  studentId: string;
  type: 'MENSALIDADE' | 'PACOTE_AVULSO' | 'WELLHUB_REGISTRO' | 'AJUSTE';
  amount: number;
  date: string;
  status: 'CONFIRMADO' | 'PENDENTE';
  referenceMonth?: string; 
  notes?: string;
  createdBy: string;
  timestamp: string;
}
