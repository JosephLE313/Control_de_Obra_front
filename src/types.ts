export type IncidentStatus = 'Pendiente' | 'En proceso' | 'Resuelto';
export type IncidentSeverity = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type IncidentType = 
  | 'Seguridad / SST'
  | 'Calidad / No Conformidad'
  | 'Retraso por Clima'
  | 'Desabastecimiento Material'
  | 'Falla de Maquinaria'
  | 'Modificación de Proyecto / Plano'
  | 'Interferencia en Terreno'
  | 'Otro';

export type WorkerRole = 
  | 'Ingeniero Residente'
  | 'Ingeniero Supervisor'
  | 'Asistente de Control'
  | 'Maestro de Obra'
  | 'Topógrafo'
  | 'Capataz'
  | 'Operario'
  | 'Oficial'
  | 'Peón'
  | 'Operador de Maquinaria'
  | 'Prevencionista SST';

export type WorkerSpecialty = 
  | 'Estructuras / Encofrado'
  | 'Fierrería / Armado'
  | 'Concreto / Vaciado'
  | 'Albañilería'
  | 'Instalaciones Sanitarias'
  | 'Instalaciones Eléctricas'
  | 'Movimiento de Tierras'
  | 'Topografía'
  | 'Acabados / Drywall'
  | 'Seguridad y Salud (SST)'
  | 'General';

export interface ProjectInfo {
  id: string;
  nombre: string;
  codigo: string;
  cliente: string;
  contratista: string;
  supervisor: string;
  residente: string;
  asistente: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  presupuestoContractual: number;
  moneda: string;
  frentesTrabajo: string[];
}

export interface Partida {
  id: string;
  codigo: string; // ej: 01.02.03
  descripcion: string;
  categoria?: string; // ej: Movimiento de tierras, Estructuras, etc.
  unidad: string; // m3, m2, ml, kg, und, pza, glb, etc.
  metradoContractual: number;
  metradoAcumulado: number;
  metradoDia: number;
  porcentajeAvance: number; // calculated: (metradoAcumulado / metradoContractual) * 100
  frentePredeterminado?: string;
  precioUnitario?: number;
}

export interface DailyReport {
  id: string;
  fecha: string; // YYYY-MM-DD
  obraId: string;
  obraNombre: string;
  frente: string;
  partidaId: string;
  partidaCodigo: string;
  partidaDescripcion: string;
  descripcionActividad: string;
  metradoEjecutado: number;
  unidad: string;
  numTrabajadores: number;
  equiposUtilizados: string; // textual or list summary
  materialesUtilizados: string; // textual or list summary
  porcentajeAvance: number; // % progress of this activity or overall partida
  observaciones: string;
  fotografias: string[]; // URLs or base64
  responsable: string;
  clima?: 'Soleado' | 'Nublado' | 'Lluvia Ligera' | 'Lluvia Fuerte' | 'Viento Fuerte';
  turno?: 'Diurno' | 'Nocturno' | 'Mixto';
}

export interface WorkerPersonnel {
  id: string;
  nombre: string;
  dni?: string;
  cargo: WorkerRole;
  especialidad: WorkerSpecialty;
  frente: string;
  horasTrabajadas: number;
  fecha: string;
  estado: 'Presente' | 'Descanso' | 'Permiso' | 'Falta';
}

export interface MaterialUsage {
  id: string;
  material: string;
  unidad: string;
  cantidadUtilizada: number;
  fecha: string;
  partidaId?: string;
  partidaCodigo?: string;
  partidaDescripcion?: string;
  guiaRemision?: string;
  observaciones?: string;
  stockDisponible?: number;
}

export interface EquipmentUsage {
  id: string;
  equipo: string;
  codigo: string;
  horasTrabajadas: number;
  operador: string;
  partidaId?: string;
  partidaCodigo?: string;
  partidaDescripcion?: string;
  estado: 'Operativo' | 'En Mantenimiento' | 'En Espera / Standby' | 'Averiado';
  fecha: string;
  observaciones?: string;
}

export interface Incident {
  id: string;
  fecha: string;
  tipo: IncidentType;
  descripcion: string;
  ubicacion: string;
  responsable: string;
  estado: IncidentStatus;
  severidad: IncidentSeverity;
  fotografia?: string;
  observaciones?: string;
  fechaSolucion?: string;
  accionTomada?: string;
}

export interface PhotoEvidence {
  id: string;
  url: string;
  fecha: string;
  descripcion: string;
  ubicacion: string;
  frente?: string;
  partidaId?: string;
  partidaCodigo?: string;
  partidaDescripcion?: string;
  reporteId?: string;
  incidenciaId?: string;
  responsable: string;
  etiquetas?: string[];
}

export interface FoundationActivity {
  id: string;
  codigo: string;
  fase: 'Mov. Tierras y Solados' | 'Acero e Instalaciones' | 'Encofrados y Liberación' | 'Vaciado y Curado';
  titulo: string;
  descripcion: string;
  normaCalidad?: string;
  partidaCodigoSugerida?: string;
  unidadSugerida?: string;
  metradoEstimado?: number;
  criticidad?: 'Alta' | 'Media' | 'Obligatoria';
}

export interface FoundationActivityCheck {
  activityId: string;
  hecho: boolean;
  horaRegistro?: string;
  metradoEjecutado?: number;
  unidad?: string;
  observaciones?: string;
  responsable?: string;
  frente?: string;
}

export interface FoundationDailyState {
  [date: string]: {
    [activityId: string]: FoundationActivityCheck;
  };
}

export interface DailyInspectionItem {
  id: string;
  codigo: string;
  categoria: 'SST & Seguridad' | 'Calidad Estructural' | 'Maquinaria y Equipos' | 'Materiales y Abastecimiento' | 'Condiciones Ambientales';
  titulo: string;
  criterioAceptacion: string;
  responsableSugerido: string;
  criticidad: 'Alta' | 'Media' | 'Crítica';
}

export type InspectionStatus = 'conforme' | 'no_conforme' | 'pendiente' | 'no_aplica';

export interface DailyInspectionCheck {
  itemId: string;
  estado: InspectionStatus;
  observaciones: string;
  accionCorrectiva?: string;
  horaRegistro?: string;
  responsableVerificador?: string;
  esIncidenciaRegistrada?: boolean;
}

export interface DailyInspectionState {
  [date: string]: {
    [itemId: string]: DailyInspectionCheck;
  };
}

export interface ScheduleTask {
  id: string;
  codigo: string;
  wbs: string;
  fase: 'Movimiento de Tierras' | 'Obras de Concreto Simple' | 'Armadura y Encofrado' | 'Concreto Estructural' | 'Cierre y Curado';
  nombre: string;
  descripcion: string;
  fechaInicioProgramada: string;
  fechaFinProgramada: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  duracionDias: number;
  avanceProgramado: number; // 0 - 100
  avanceReal: number; // 0 - 100
  metradoTotal: number;
  metradoEjecutado: number;
  unidad: string;
  predecesoras?: string[];
  esRutaCritica: boolean;
  responsable: string;
  estado: 'No Iniciada' | 'En Proceso' | 'Completada' | 'Retrasada';
}

export interface ScheduleMilestone {
  id: string;
  codigo: string;
  nombre: string;
  fechaProgramada: string;
  fechaReal?: string;
  completado: boolean;
  criterioLiberacion: string;
  responsable: string;
}

export type UserCargo = 
  | 'Administrador'
  | 'Residente de obra'
  | 'Supervisor'
  | 'Asistente de obra'
  | 'Ingeniero'
  | 'Usuario';

export interface UserProfile {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  correo?: string;
  telefono: string;
  cargo: UserCargo;
  empresa: string;
  fotoPerfil?: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  ultimaConexion: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'reportes-diarios'
  | 'daily-reports'
  | 'partidas'
  | 'cronograma'
  | 'cronograma-cimentacion'
  | 'personal'
  | 'personnel'
  | 'materiales'
  | 'materials'
  | 'equipos'
  | 'equipment'
  | 'incidencias'
  | 'incidents'
  | 'evidencias'
  | 'photos'
  | 'analisis-reportes'
  | 'reports'
  | 'configuracion'
  | 'perfil';


