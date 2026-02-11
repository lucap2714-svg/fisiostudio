
import { UserRole, Student, ClassSession, AppSettings, BillingStatus } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  checkInWindowMinutes: 20,
  defaultCapacity: 8,
  kioskWindowBeforeMinutes: 30,
  kioskWindowAfterMinutes: 60,
  kioskExitPin: '1234',
  kioskQrTimeoutSeconds: 15,
  kioskRefreshIntervalSeconds: 45,
};

export const MOCK_PROFESSIONALS = [
  {
    id: 'prof-1',
    name: 'Alina Holanda',
    email: 'alina@fisiostudio.com',
    role: UserRole.PROFESSIONAL,
    crefito: '18/352245-F'
  },
  {
    id: 'prof-2',
    name: 'Yara Cavalcante',
    email: 'yara@fisiostudio.com',
    role: UserRole.PROFESSIONAL,
    crefito: '18/339104-F'
  },
  {
    id: 'prof-3',
    name: 'Bárbara de Farias',
    email: 'barbara@fisiostudio.com',
    role: UserRole.PROFESSIONAL,
    crefito: '339371-.F'
  }
];

export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// SEED OFICIAL - 62 ALUNOS (Sincronização Forçada)
export const MOCK_STUDENTS: Student[] = [
  { id: 's-1', name: 'Rafaela Camila R Da Silva', phone: '92 993215720', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '16:00'}, {day: 'Quinta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-2', name: 'Ana Carolina Mendes', phone: '69993894785', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quarta', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '16:00'}, {day: 'Quarta', time: '16:00'}, {day: 'Quinta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-3', name: 'Renato Antonio', phone: '35 988327096', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-4', name: 'Katrielly Dos Reis', phone: '69 999826539', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Terça', 'Quinta'], weeklySchedule: [{day: 'Segunda', time: '19:00'}, {day: 'Terça', time: '19:00'}, {day: 'Quinta', time: '19:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-5', name: 'Mario Marcos Da Silva', phone: '69 99304 9197', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-6', name: 'Pamela Rodrigues', phone: '69 99225 0273', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-7', name: 'Claudenice Adrisen', phone: '69 99218 7872', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-8', name: 'Elizabet Braga Nunes', phone: '69 99239 4013', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-9', name: 'Raiza Emanuelle Ramalho', phone: '69 99236 6293', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '17:00'}, {day: 'Quinta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-10', name: 'Izabel Ferreira De Jesus', phone: '69 99945 2049', studentType: 'Avulso', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-11', name: 'Elessandra Souza Nascimento', phone: '69 99919 1813', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-12', name: 'Vanuza Alvez', phone: '69 99351 5622', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-13', name: 'Elizabete Ladislau', phone: '69 99244 7672', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-14', name: 'Giovanna Rufini De Andrade', phone: '69 99224 2760', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-15', name: 'Catia Augusta', phone: '69 999711771', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-16', name: 'Ester Alvez De Souza', phone: '69 99608-9391', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-17', name: 'Barbara Rosa', phone: '31 99779-1112', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '17:00'}, {day: 'Quarta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-18', name: 'Andre Luiz', phone: '69 99229-8320', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '17:00'}, {day: 'Quarta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-19', name: 'Manoel Marques', phone: '69 9995-24387', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '16:00'}, {day: 'Quarta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-20', name: 'Lizianne De Matos', phone: '69 992378639', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta', 'Quinta'], weeklySchedule: [{day: 'Segunda', time: '16:00'}, {day: 'Quarta', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-21', name: 'Sara Gabriely', phone: '69 9982-2541', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-22', name: 'Joao Gabriel', phone: '69993778367', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-23', name: 'Ana Luicia Mortari', phone: '43 99678-8889', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-24', name: 'Vanuza Alvez Diogo Oliveira', phone: '69 99244-7672', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda'], weeklySchedule: [{day: 'Segunda', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-25', name: 'Nayara Dos Santos', phone: '69 99351-5895', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Sábado'], weeklySchedule: [{day: 'Sábado', time: '10:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-26', name: 'Ana Carolina Siqueira', phone: '69 98155-7857', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-27', name: 'Elson Rodrigues Lima', phone: '69 99289-5965', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Sábado'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Sábado', time: '09:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-28', name: 'Maria Leiliane De Albuquerque', phone: '69 99358 9144', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '16:00'}, {day: 'Quarta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-29', name: 'Giovanni Correia Vieira', phone: '69 99344-5427', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-30', name: 'Paolla Kerry Martinatti', phone: '69 99245 9385', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quinta', 'Sexta'], weeklySchedule: [{day: 'Quinta', time: '19:00'}, {day: 'Sexta', time: '07:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-31', name: 'Eduardo Alvez Rodrigues', phone: '69984790363', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-32', name: 'Joserene Zalenski', phone: '69993510100', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quinta'], weeklySchedule: [{day: 'Segunda', time: '16:00'}, {day: 'Quinta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-33', name: 'Raissa Fonseca', phone: '69981195612', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-34', name: 'Leticia Pagotto Zoni', phone: '69993540350', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-35', name: 'Andreza P Mendonça', phone: '69 993328-0404', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-36', name: 'Sabrina Felix Santana', phone: '69984422092', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-37', name: 'Edeli Diogo', phone: '69 999202138', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-38', name: 'Regiane De Oliveira Santos', phone: '69 98151-1323', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '18:00'}, {day: 'Quinta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-39', name: 'Kamilla Marcelli Peixe', phone: '6999277 6609', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-40', name: 'Roberta Barbosa', phone: '33 98881-6032', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-41', name: 'Grieco Da Costa', phone: '69 99303 7153', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '16:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-42', name: 'Isabella Santos Nascimento', phone: '21 970390032', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta', 'Sexta'], weeklySchedule: [{day: 'Segunda', time: '17:00'}, {day: 'Quarta', time: '17:00'}, {day: 'Sexta', time: '07:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-43', name: 'Ellen Lindaise', phone: '69 99221 1563', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-44', name: 'Elza Paula Silva', phone: '69 981192289', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-45', name: 'Jania Maria De Paula', phone: '69 984184418', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta', 'Sexta'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Quarta', time: '18:00'}, {day: 'Sexta', time: '08:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-46', name: 'Rosangela Da Silva', phone: '69 99207 9961', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '17:00'}, {day: 'Quarta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-47', name: 'Ana Caroline Mezzarobra', phone: '6998453 8626', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-48', name: 'Renan Sotero', phone: '69 993090603', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-49', name: 'Aladia', phone: '69 99929 5645', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-50', name: 'Lucimeire', phone: '69 99202 8647', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-51', name: 'Maria Aparecida', phone: '69996039388', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-52', name: 'Rosely Tavares', phone: '69984431603', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-53', name: 'Paty Mara', phone: '69 984431603', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-54', name: 'Isabel Ferreira De Jesus', phone: '69999191813', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Terça', 'Quinta'], weeklySchedule: [{day: 'Terça', time: '17:00'}, {day: 'Quinta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-55', name: 'Marcos Vinícius Palma', phone: '69 993049197', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Sábado'], weeklySchedule: [{day: 'Sábado', time: '10:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-56', name: 'Janieli Feliciano', phone: '69992011579', studentType: 'Wellhub', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-57', name: 'Caroline Horsth', phone: '69993037444', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '08:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-58', name: 'Josinane Mattias', phone: '69993309640', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '19:00'}, {day: 'Quarta', time: '19:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-59', name: 'Marcelos Alves', phone: '69663309640', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '19:00'}, {day: 'Quarta', time: '19:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-60', name: 'Marlene Peixer', phone: '69992776609', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: [], weeklySchedule: [], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-61', name: 'Flávia Regina Stur', phone: '69 99908 4479', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Segunda', 'Quarta'], weeklySchedule: [{day: 'Segunda', time: '18:00'}, {day: 'Quarta', time: '18:00'}], billingStatus: BillingStatus.SEM_INFO },
  { id: 's-62', name: 'Luiza', phone: '69992270342', studentType: 'Fixo', active: true, role: UserRole.STUDENT, weeklyDays: ['Quarta'], weeklySchedule: [{day: 'Quarta', time: '17:00'}], billingStatus: BillingStatus.SEM_INFO },
];

export const MOCK_CLASSES: ClassSession[] = [];
