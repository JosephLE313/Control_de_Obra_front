import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ProjectInfo,
  Partida,
  DailyReport,
  WorkerPersonnel,
  MaterialUsage,
  EquipmentUsage,
  Incident,
  PhotoEvidence,
  ActiveTab,
  FoundationActivity,
  FoundationActivityCheck,
  FoundationDailyState,
  DailyInspectionItem,
  DailyInspectionCheck,
  DailyInspectionState,
  InspectionStatus,
  ScheduleTask,
  ScheduleMilestone
} from '../types';
import {
  INITIAL_PROJECT,
  INITIAL_PARTIDAS,
  INITIAL_DAILY_REPORTS,
  INITIAL_PERSONNEL,
  INITIAL_MATERIALS,
  INITIAL_EQUIPMENT,
  INITIAL_INCIDENTS,
  INITIAL_PHOTOS
} from '../data/initialData';
import {
  FOUNDATION_ACTIVITIES,
  INITIAL_FOUNDATION_STATE
} from '../data/foundationActivities';
import {
  DAILY_INSPECTION_ITEMS,
  INITIAL_DAILY_INSPECTIONS_STATE
} from '../data/dailyInspectionData';
import {
  FOUNDATION_SCHEDULE_TASKS,
  FOUNDATION_SCHEDULE_MILESTONES
} from '../data/foundationScheduleData';
import {
  supabaseDataService,
  supabaseProjectService,
  supabasePartidasService,
  supabaseReportsService,
  supabaseWorkersService,
  supabaseMaterialsService,
  supabaseEquipmentService,
  supabaseIncidentsService,
  supabasePhotosService,
  supabaseInspectionsService,
  supabaseScheduleService,
  supabaseChecksService
} from '../services/supabaseService';
import { getStoredSupabaseConfig, getSupabaseClient } from '../lib/supabase';

interface ConstructionContextType {
  // Supabase Database Sync State
  isSupabaseConnected: boolean;
  isFirestoreConnected: boolean; // Backwards-compatible alias
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncDataToSupabase: () => Promise<void>;
  syncDataToFirestore: () => Promise<void>; // Backwards-compatible alias

  // States
  project: ProjectInfo;
  partidas: Partida[];
  dailyReports: DailyReport[];
  personnel: WorkerPersonnel[];
  materials: MaterialUsage[];
  equipment: EquipmentUsage[];
  incidents: Incident[];
  photos: PhotoEvidence[];
  selectedDate: string;
  activeTab: ActiveTab;
  currentView: ActiveTab;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  editingItem: any | null;
  officialReportDate: string | null;

  // Foundation activities state
  foundationActivities: FoundationActivity[];
  foundationState: FoundationDailyState;
  currentDayFoundationChecks: { [activityId: string]: FoundationActivityCheck };
  currentDayFoundationCheckedCount: number;
  currentDayFoundationTotalCount: number;
  currentDayFoundationPercentage: number;

  // Daily Inspection Protocol & Incidents Checklist
  dailyInspectionItems: DailyInspectionItem[];
  dailyInspectionState: DailyInspectionState;
  currentDayInspections: { [itemId: string]: DailyInspectionCheck };
  inspectionsConformeCount: number;
  inspectionsNoConformeCount: number;
  inspectionsPendienteCount: number;

  // Foundation Schedule state
  foundationScheduleTasks: ScheduleTask[];
  foundationMilestones: ScheduleMilestone[];
  foundationScheduleOverallRealProgress: number;
  foundationSchedulePlannedProgress: number;

  // State setters
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentView: (tab: ActiveTab) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null, editingItem?: any) => void;
  setOfficialReportDate: (date: string | null) => void;

  // Foundation checklist actions
  toggleFoundationActivity: (activityId: string, hecho?: boolean, extraData?: Partial<FoundationActivityCheck>) => void;
  updateFoundationActivityDetails: (activityId: string, details: Partial<FoundationActivityCheck>) => void;
  batchSetFoundationActivities: (activityIds: string[], hecho: boolean) => void;
  resetFoundationDay: (date?: string) => void;

  // Daily Inspection actions
  setDailyInspectionStatus: (itemId: string, status: InspectionStatus) => void;
  updateDailyInspectionObs: (itemId: string, observaciones: string, accionCorrectiva?: string) => void;
  convertInspectionToIncident: (itemId: string) => void;
  resetDailyInspections: (date?: string) => void;

  // Foundation Schedule actions
  updateScheduleTask: (taskId: string, updates: Partial<ScheduleTask>) => void;
  toggleMilestone: (milestoneId: string) => void;
  resetFoundationSchedule: () => void;

  // Computed & Aggregations
  overallProgress: number;
  todayReports: DailyReport[];
  todayPersonnel: WorkerPersonnel[];
  todayMaterials: MaterialUsage[];
  todayEquipment: EquipmentUsage[];
  todayIncidents: Incident[];
  pendingIncidentsCount: number;
  inProgressIncidentsCount: number;
  resolvedIncidentsCount: number;
  todayWorkersCount: number;
  todayTotalHours: number;

  // CRUD Actions
  updateProjectInfo: (info: Partial<ProjectInfo>) => void;
  addDailyReport: (report: Omit<DailyReport, 'id'>) => void;
  updateDailyReport: (id: string, report: Partial<DailyReport>) => void;
  deleteDailyReport: (id: string) => void;

  addPartida: (partida: Omit<Partida, 'id' | 'porcentajeAvance'>) => void;
  updatePartida: (id: string, partida: Partial<Partida>) => void;
  deletePartida: (id: string) => void;
  quickAddMetradoToPartida: (partidaId: string, metrado: number, date?: string) => void;

  addWorker: (worker: Omit<WorkerPersonnel, 'id'>) => void;
  updateWorker: (id: string, worker: Partial<WorkerPersonnel>) => void;
  deleteWorker: (id: string) => void;

  addMaterial: (material: Omit<MaterialUsage, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<MaterialUsage>) => void;
  deleteMaterial: (id: string) => void;

  addEquipment: (equipment: Omit<EquipmentUsage, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<EquipmentUsage>) => void;
  deleteEquipment: (id: string) => void;

  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  addPhoto: (photo: Omit<PhotoEvidence, 'id'>) => void;
  deletePhoto: (id: string) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonData: string) => boolean;
}

const ConstructionContext = createContext<ConstructionContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECT: 'cdo_project_info_v2',
  PARTIDAS: 'cdo_partidas_list_v2',
  REPORTS: 'cdo_daily_reports_v2',
  PERSONNEL: 'cdo_personnel_list_v2',
  MATERIALS: 'cdo_materials_list_v2',
  EQUIPMENT: 'cdo_equipment_list_v2',
  INCIDENTS: 'cdo_incidents_list_v2',
  PHOTOS: 'cdo_photos_list_v2',
  SELECTED_DATE: 'cdo_selected_date_v2',
  FOUNDATION: 'cdo_foundation_state_v2',
  INSPECTIONS: 'cdo_inspections_state_v2',
  SCHEDULE_TASKS: 'cdo_schedule_tasks_v2',
  MILESTONES: 'cdo_milestones_v2'
};

export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync Status (Supabase)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => {
    return getStoredSupabaseConfig().isConfigured;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());

  // Main Entities State
  const [project, setProject] = useState<ProjectInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECT);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT;
    } catch {
      return INITIAL_PROJECT;
    }
  });

  const [partidas, setPartidas] = useState<Partida[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTIDAS);
      return saved ? JSON.parse(saved) : INITIAL_PARTIDAS;
    } catch {
      return INITIAL_PARTIDAS;
    }
  });

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_REPORTS;
    } catch {
      return INITIAL_DAILY_REPORTS;
    }
  });

  const [personnel, setPersonnel] = useState<WorkerPersonnel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
      return saved ? JSON.parse(saved) : INITIAL_PERSONNEL;
    } catch {
      return INITIAL_PERSONNEL;
    }
  });

  const [materials, setMaterials] = useState<MaterialUsage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [equipment, setEquipment] = useState<EquipmentUsage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [photos, setPhotos] = useState<PhotoEvidence[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch {
      return INITIAL_PHOTOS;
    }
  });

  const [foundationState, setFoundationState] = useState<FoundationDailyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOUNDATION);
      return saved ? JSON.parse(saved) : INITIAL_FOUNDATION_STATE;
    } catch {
      return INITIAL_FOUNDATION_STATE;
    }
  });

  const [dailyInspectionState, setDailyInspectionState] = useState<DailyInspectionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_INSPECTIONS_STATE;
    } catch {
      return INITIAL_DAILY_INSPECTIONS_STATE;
    }
  });

  const [foundationScheduleTasks, setFoundationScheduleTasks] = useState<ScheduleTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE_TASKS);
      return saved ? JSON.parse(saved) : FOUNDATION_SCHEDULE_TASKS;
    } catch {
      return FOUNDATION_SCHEDULE_TASKS;
    }
  });

  const [foundationMilestones, setFoundationMilestones] = useState<ScheduleMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      return saved ? JSON.parse(saved) : FOUNDATION_SCHEDULE_MILESTONES;
    } catch {
      return FOUNDATION_SCHEDULE_MILESTONES;
    }
  });

  const [selectedDate, setSelectedDateState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);
      return saved || '2026-08-26';
    } catch {
      return '2026-08-26';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModalState] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [officialReportDate, setOfficialReportDate] = useState<string | null>(null);

  // Sync to local storage as durable client-cache
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project)); }, [project]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PARTIDAS, JSON.stringify(partidas)); }, [partidas]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(dailyReports)); }, [dailyReports]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(personnel)); }, [personnel]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents)); }, [incidents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos)); }, [photos]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FOUNDATION, JSON.stringify(foundationState)); }, [foundationState]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(dailyInspectionState)); }, [dailyInspectionState]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SCHEDULE_TASKS, JSON.stringify(foundationScheduleTasks)); }, [foundationScheduleTasks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(foundationMilestones)); }, [foundationMilestones]);

  // --- SUPABASE REAL-TIME SUBSCRIPTION & AUTO-SEEDING ---
  useEffect(() => {
    let isSubscribed = true;

    async function initializeSupabase() {
      const config = getStoredSupabaseConfig();
      if (!config.isConfigured) {
        setIsSupabaseConnected(false);
        return;
      }

      setIsSyncing(true);
      try {
        await supabaseDataService.seedInitialDataIfEmpty();
        if (isSubscribed) {
          setIsSupabaseConnected(true);
          setLastSyncTime(new Date());
        }
      } catch (err) {
        console.warn('[Supabase] Auto-seed warning:', err);
      } finally {
        if (isSubscribed) setIsSyncing(false);
      }
    }

    initializeSupabase();

    const client = getSupabaseClient();
    if (!client) return;

    try {
      const channel = client
        .channel('public:db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          if (isSubscribed) {
            setLastSyncTime(new Date());
          }
        })
        .subscribe();

      return () => {
        isSubscribed = false;
        if (client) client.removeChannel(channel);
      };
    } catch (e) {
      console.warn('[Supabase] Subscription error:', e);
    }
  }, []);

  const syncDataToSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await supabaseDataService.syncAllCurrentData({
        project,
        partidas,
        dailyReports,
        personnel,
        materials,
        equipment,
        incidents,
        photos,
        dailyInspectionState,
        foundationScheduleTasks,
        foundationMilestones,
        foundationState
      });
      if (res.success) {
        setIsSupabaseConnected(true);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Manual Supabase sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncDataToFirestore = syncDataToSupabase;

  const setSelectedDate = (date: string) => {
    setSelectedDateState(date);
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, date);
  };

  const setActiveModal = (modal: string | null, item?: any) => {
    setActiveModalState(modal);
    setEditingItem(item || null);
  };

  // Foundation activities computed for current selectedDate
  const currentDayFoundationChecks = useMemo(() => {
    return foundationState[selectedDate] || {};
  }, [foundationState, selectedDate]);

  const currentDayFoundationCheckedCount = useMemo(() => {
    const dayChecks = currentDayFoundationChecks;
    return FOUNDATION_ACTIVITIES.filter(act => dayChecks[act.id]?.hecho).length;
  }, [currentDayFoundationChecks]);

  const currentDayFoundationTotalCount = FOUNDATION_ACTIVITIES.length;

  const currentDayFoundationPercentage = useMemo(() => {
    if (currentDayFoundationTotalCount === 0) return 0;
    return Math.round((currentDayFoundationCheckedCount / currentDayFoundationTotalCount) * 100);
  }, [currentDayFoundationCheckedCount, currentDayFoundationTotalCount]);

  // Foundation Actions
  const toggleFoundationActivity = (
    activityId: string,
    hechoOverride?: boolean,
    extraData?: Partial<FoundationActivityCheck>
  ) => {
    const dayData = { ...(foundationState[selectedDate] || {}) };
    const current = dayData[activityId];
    const newHecho = hechoOverride !== undefined ? hechoOverride : !current?.hecho;

    const activityDef = FOUNDATION_ACTIVITIES.find(a => a.id === activityId);

    const updatedCheck: FoundationActivityCheck = {
      activityId,
      hecho: newHecho,
      horaRegistro: newHecho ? (current?.horaRegistro || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : undefined,
      metradoEjecutado: extraData?.metradoEjecutado ?? current?.metradoEjecutado ?? activityDef?.metradoEstimado,
      unidad: extraData?.unidad ?? current?.unidad ?? activityDef?.unidadSugerida,
      observaciones: extraData?.observaciones ?? current?.observaciones ?? '',
      responsable: extraData?.responsable ?? current?.responsable ?? 'Residente / Supervisor de Campo',
      frente: extraData?.frente ?? current?.frente ?? 'Frente 01 - Cimentaciones y Muros de Contención'
    };

    setFoundationState(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [activityId]: updatedCheck
      }
    }));

    supabaseChecksService.saveCheck(selectedDate, activityId, updatedCheck).catch(err => {
      console.warn('[Supabase] Error saving foundation check:', err);
    });
  };

  const updateFoundationActivityDetails = (activityId: string, details: Partial<FoundationActivityCheck>) => {
    const dayData = { ...(foundationState[selectedDate] || {}) };
    const current = dayData[activityId] || { activityId, hecho: true };

    const merged = {
      ...current,
      ...details
    };

    setFoundationState(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [activityId]: merged
      }
    }));

    supabaseChecksService.saveCheck(selectedDate, activityId, merged).catch(err => {
      console.warn('[Supabase] Error updating foundation check:', err);
    });
  };

  const batchSetFoundationActivities = (activityIds: string[], hecho: boolean) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayData = { ...(foundationState[selectedDate] || {}) };

    activityIds.forEach(id => {
      const activityDef = FOUNDATION_ACTIVITIES.find(a => a.id === id);
      const current = dayData[id];
      const check: FoundationActivityCheck = {
        activityId: id,
        hecho,
        horaRegistro: hecho ? (current?.horaRegistro || nowTime) : undefined,
        metradoEjecutado: current?.metradoEjecutado ?? activityDef?.metradoEstimado,
        unidad: current?.unidad ?? activityDef?.unidadSugerida,
        observaciones: current?.observaciones ?? '',
        responsable: current?.responsable ?? 'Residente / Supervisor de Campo',
        frente: current?.frente ?? 'Frente 01 - Cimentaciones y Muros de Contención'
      };
      dayData[id] = check;
      supabaseChecksService.saveCheck(selectedDate, id, check).catch(console.warn);
    });

    setFoundationState(prev => ({
      ...prev,
      [selectedDate]: dayData
    }));
  };

  const resetFoundationDay = (date?: string) => {
    const targetDate = date || selectedDate;
    setFoundationState(prev => {
      const next = { ...prev };
      delete next[targetDate];
      return next;
    });
    supabaseChecksService.resetDay(targetDate).catch(console.warn);
  };

  // Daily Inspection Protocol State & Actions
  const currentDayInspections = useMemo(() => {
    return dailyInspectionState[selectedDate] || {};
  }, [dailyInspectionState, selectedDate]);

  const inspectionsConformeCount = useMemo(() => {
    const checks = currentDayInspections;
    return DAILY_INSPECTION_ITEMS.filter(item => checks[item.id]?.estado === 'conforme').length;
  }, [currentDayInspections]);

  const inspectionsNoConformeCount = useMemo(() => {
    const checks = currentDayInspections;
    return DAILY_INSPECTION_ITEMS.filter(item => checks[item.id]?.estado === 'no_conforme').length;
  }, [currentDayInspections]);

  const inspectionsPendienteCount = useMemo(() => {
    const checks = currentDayInspections;
    return DAILY_INSPECTION_ITEMS.filter(item => !checks[item.id] || checks[item.id]?.estado === 'pendiente').length;
  }, [currentDayInspections]);

  const setDailyInspectionStatus = (itemId: string, status: InspectionStatus) => {
    const current = currentDayInspections[itemId] || {
      itemId,
      estado: 'pendiente',
      observaciones: '',
      horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responsableVerificador: 'Ing. Residente / Inspector SST'
    };

    const updated: DailyInspectionCheck = {
      ...current,
      estado: status,
      horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDailyInspectionState(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [itemId]: updated
      }
    }));

    supabaseInspectionsService.saveCheck(selectedDate, itemId, updated).catch(console.warn);
  };

  const updateDailyInspectionObs = (itemId: string, observaciones: string, accionCorrectiva?: string) => {
    const current = currentDayInspections[itemId] || {
      itemId,
      estado: 'pendiente',
      observaciones: '',
      horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responsableVerificador: 'Ing. Residente / Inspector SST'
    };

    const updated: DailyInspectionCheck = {
      ...current,
      observaciones,
      ...(accionCorrectiva !== undefined ? { accionCorrectiva } : {})
    };

    setDailyInspectionState(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [itemId]: updated
      }
    }));

    supabaseInspectionsService.saveCheck(selectedDate, itemId, updated).catch(console.warn);
  };

  const convertInspectionToIncident = (itemId: string) => {
    const itemDef = DAILY_INSPECTION_ITEMS.find(i => i.id === itemId);
    if (!itemDef) return;

    const inspectionCheck = currentDayInspections[itemId];
    const obs = inspectionCheck?.observaciones || `Observación en punto de control: ${itemDef.titulo}`;
    const accion = inspectionCheck?.accionCorrectiva || 'Requiere inspección y medida correctiva inmediata en obra.';

    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      fecha: selectedDate,
      tipo: itemDef.categoria === 'SST & Seguridad' 
        ? 'Seguridad / SST' 
        : itemDef.categoria === 'Calidad Estructural' 
        ? 'Calidad / No Conformidad' 
        : itemDef.categoria === 'Maquinaria y Equipos' 
        ? 'Falla de Maquinaria' 
        : itemDef.categoria === 'Condiciones Ambientales' 
        ? 'Retraso por Clima' 
        : 'Otro',
      descripcion: `[${itemDef.codigo}] ${itemDef.titulo}: ${obs}`,
      ubicacion: 'Frente 01 - Cimentaciones y Zapatas',
      responsable: inspectionCheck?.responsableVerificador || itemDef.responsableSugerido,
      estado: 'Pendiente',
      severidad: itemDef.criticidad === 'Crítica' ? 'Crítica' : itemDef.criticidad === 'Alta' ? 'Alta' : 'Media',
      accionTomada: accion,
      observaciones: `Detectado durante inspección diaria del ${selectedDate}.`
    };

    // Add to incidents & Supabase
    setIncidents(prev => [newInc, ...prev]);
    supabaseIncidentsService.save(newInc).catch(console.warn);

    // Mark in inspection state
    const updatedInspection: DailyInspectionCheck = {
      ...(inspectionCheck || {
        itemId,
        observaciones: obs,
        horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responsableVerificador: itemDef.responsableSugerido
      }),
      estado: 'no_conforme',
      esIncidenciaRegistrada: true
    };

    setDailyInspectionState(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [itemId]: updatedInspection
      }
    }));

    supabaseInspectionsService.saveCheck(selectedDate, itemId, updatedInspection).catch(console.warn);
  };

  const resetDailyInspections = (date?: string) => {
    const targetDate = date || selectedDate;
    setDailyInspectionState(prev => {
      const next = { ...prev };
      delete next[targetDate];
      return next;
    });
    supabaseInspectionsService.resetDay(targetDate).catch(console.warn);
  };

  // Foundation Schedule Actions & Computations
  const updateScheduleTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    let targetUpdatedTask: ScheduleTask | null = null;
    setFoundationScheduleTasks(prev => {
      return prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          if (updated.avanceReal >= 100) {
            updated.estado = 'Completada';
            if (!updated.fechaFinReal) updated.fechaFinReal = selectedDate;
          } else if (updated.avanceReal > 0) {
            updated.estado = 'En Proceso';
            if (!updated.fechaInicioReal) updated.fechaInicioReal = selectedDate;
          }
          targetUpdatedTask = updated;
          return updated;
        }
        return t;
      });
    });

    if (targetUpdatedTask) {
      supabaseScheduleService.saveTask(targetUpdatedTask).catch(console.warn);
    }
  };

  const toggleMilestone = (milestoneId: string) => {
    let targetUpdatedMilestone: ScheduleMilestone | null = null;
    setFoundationMilestones(prev => {
      return prev.map(m => {
        if (m.id === milestoneId) {
          const newStatus = !m.completado;
          const updated = {
            ...m,
            completado: newStatus,
            fechaReal: newStatus ? selectedDate : undefined
          };
          targetUpdatedMilestone = updated;
          return updated;
        }
        return m;
      });
    });

    if (targetUpdatedMilestone) {
      supabaseScheduleService.saveMilestone(targetUpdatedMilestone).catch(console.warn);
    }
  };

  const resetFoundationSchedule = () => {
    setFoundationScheduleTasks(FOUNDATION_SCHEDULE_TASKS);
    setFoundationMilestones(FOUNDATION_SCHEDULE_MILESTONES);
    FOUNDATION_SCHEDULE_TASKS.forEach(t => supabaseScheduleService.saveTask(t).catch(console.warn));
    FOUNDATION_SCHEDULE_MILESTONES.forEach(m => supabaseScheduleService.saveMilestone(m).catch(console.warn));
  };

  const foundationScheduleOverallRealProgress = useMemo(() => {
    if (foundationScheduleTasks.length === 0) return 0;
    const totalDuration = foundationScheduleTasks.reduce((acc, t) => acc + t.duracionDias, 0);
    if (totalDuration === 0) return 0;
    const weightedProgress = foundationScheduleTasks.reduce((acc, t) => acc + (t.avanceReal * t.duracionDias), 0);
    return Math.round((weightedProgress / totalDuration) * 10) / 10;
  }, [foundationScheduleTasks]);

  const foundationSchedulePlannedProgress = useMemo(() => {
    if (foundationScheduleTasks.length === 0) return 0;
    const totalDuration = foundationScheduleTasks.reduce((acc, t) => acc + t.duracionDias, 0);
    if (totalDuration === 0) return 0;
    const weightedProgress = foundationScheduleTasks.reduce((acc, t) => acc + (t.avanceProgramado * t.duracionDias), 0);
    return Math.round((weightedProgress / totalDuration) * 10) / 10;
  }, [foundationScheduleTasks]);

  // Computations
  const overallProgress = useMemo(() => {
    if (!partidas.length) return 0;
    let totalContractualCost = 0;
    let totalAccumulatedCost = 0;

    let hasPrices = false;
    partidas.forEach(p => {
      if (p.precioUnitario && p.precioUnitario > 0) {
        hasPrices = true;
        totalContractualCost += p.metradoContractual * p.precioUnitario;
        totalAccumulatedCost += Math.min(p.metradoAcumulado, p.metradoContractual) * p.precioUnitario;
      }
    });

    if (hasPrices && totalContractualCost > 0) {
      return Math.round((totalAccumulatedCost / totalContractualCost) * 10000) / 100;
    }

    const sumPercentage = partidas.reduce((acc, p) => acc + Math.min(p.porcentajeAvance, 100), 0);
    return Math.round((sumPercentage / partidas.length) * 100) / 100;
  }, [partidas]);

  const todayReports = useMemo(() => {
    return dailyReports.filter(r => r.fecha === selectedDate);
  }, [dailyReports, selectedDate]);

  const todayPersonnel = useMemo(() => {
    return personnel.filter(p => p.fecha === selectedDate && p.estado === 'Presente');
  }, [personnel, selectedDate]);

  const todayMaterials = useMemo(() => {
    return materials.filter(m => m.fecha === selectedDate);
  }, [materials, selectedDate]);

  const todayEquipment = useMemo(() => {
    return equipment.filter(e => e.fecha === selectedDate);
  }, [equipment, selectedDate]);

  const todayIncidents = useMemo(() => {
    return incidents.filter(i => i.fecha === selectedDate);
  }, [incidents, selectedDate]);

  const pendingIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.estado === 'Pendiente').length;
  }, [incidents]);

  const inProgressIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.estado === 'En proceso').length;
  }, [incidents]);

  const resolvedIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.estado === 'Resuelto').length;
  }, [incidents]);

  const todayWorkersCount = useMemo(() => {
    return todayPersonnel.length;
  }, [todayPersonnel]);

  const todayTotalHours = useMemo(() => {
    return todayPersonnel.reduce((acc, p) => acc + (p.horasTrabajadas || 0), 0);
  }, [todayPersonnel]);

  // Project Info
  const updateProjectInfo = (info: Partial<ProjectInfo>) => {
    const updated = { ...project, ...info };
    setProject(updated);
    supabaseProjectService.save(updated).catch(console.warn);
  };

  // Daily Reports CRUD
  const addDailyReport = (reportData: Omit<DailyReport, 'id'>) => {
    const newId = `rep-${Date.now()}`;
    const newReport: DailyReport = {
      ...reportData,
      id: newId
    };

    setDailyReports(prev => [newReport, ...prev]);
    supabaseReportsService.save(newReport).catch(console.warn);

    // Automatically update matching Partida's accumulated and daily metrado
    if (reportData.partidaId) {
      setPartidas(prev => prev.map(p => {
        if (p.id === reportData.partidaId) {
          const newAcumulado = Number(p.metradoAcumulado || 0) + Number(reportData.metradoEjecutado || 0);
          const newPorcentaje = p.metradoContractual > 0 
            ? Math.round((newAcumulado / p.metradoContractual) * 10000) / 100 
            : 0;
          const updatedPartida: Partida = {
            ...p,
            metradoAcumulado: newAcumulado,
            metradoDia: Number(reportData.metradoEjecutado || 0),
            porcentajeAvance: newPorcentaje
          };
          supabasePartidasService.save(updatedPartida).catch(console.warn);
          return updatedPartida;
        }
        return p;
      }));
    }

    // Photo evidence sync
    if (reportData.fotografias && reportData.fotografias.length > 0) {
      reportData.fotografias.forEach((url, idx) => {
        const photo: PhotoEvidence = {
          id: `pho-${Date.now()}-${idx}`,
          url,
          fecha: reportData.fecha,
          descripcion: `${reportData.partidaCodigo} - ${reportData.descripcionActividad.substring(0, 80)}...`,
          ubicacion: reportData.frente,
          frente: reportData.frente,
          partidaId: reportData.partidaId,
          partidaCodigo: reportData.partidaCodigo,
          partidaDescripcion: reportData.partidaDescripcion,
          reporteId: newId,
          responsable: reportData.responsable
        };
        setPhotos(prev => [photo, ...prev]);
        supabasePhotosService.save(photo).catch(console.warn);
      });
    }
  };

  const updateDailyReport = (id: string, updated: Partial<DailyReport>) => {
    setDailyReports(prev => prev.map(r => {
      if (r.id === id) {
        const merged = { ...r, ...updated };
        supabaseReportsService.save(merged).catch(console.warn);
        return merged;
      }
      return r;
    }));
  };

  const deleteDailyReport = (id: string) => {
    setDailyReports(prev => prev.filter(r => r.id !== id));
    supabaseReportsService.remove(id).catch(console.warn);
  };

  // Partidas CRUD
  const addPartida = (partidaData: Omit<Partida, 'id' | 'porcentajeAvance'>) => {
    const metradoAcumulado = Number(partidaData.metradoAcumulado) || 0;
    const metradoContractual = Number(partidaData.metradoContractual) || 1;
    const porcentajeAvance = Math.round((metradoAcumulado / metradoContractual) * 10000) / 100;

    const newPartida: Partida = {
      ...partidaData,
      id: `par-${Date.now()}`,
      metradoAcumulado,
      metradoContractual,
      metradoDia: Number(partidaData.metradoDia) || 0,
      porcentajeAvance
    };

    setPartidas(prev => [...prev, newPartida]);
    supabasePartidasService.save(newPartida).catch(console.warn);
  };

  const updatePartida = (id: string, updated: Partial<Partida>) => {
    setPartidas(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updated };
        const contractual = Number(merged.metradoContractual) || 1;
        const acumulado = Number(merged.metradoAcumulado) || 0;
        merged.porcentajeAvance = Math.round((acumulado / contractual) * 10000) / 100;
        supabasePartidasService.save(merged).catch(console.warn);
        return merged;
      }
      return p;
    }));
  };

  const deletePartida = (id: string) => {
    setPartidas(prev => prev.filter(p => p.id !== id));
    supabasePartidasService.remove(id).catch(console.warn);
  };

  const quickAddMetradoToPartida = (partidaId: string, additionalMetrado: number, _date = selectedDate) => {
    setPartidas(prev => prev.map(p => {
      if (p.id === partidaId) {
        const newAcumulado = Number(p.metradoAcumulado) + Number(additionalMetrado);
        const contractual = Number(p.metradoContractual) || 1;
        const newPct = Math.round((newAcumulado / contractual) * 10000) / 100;
        const updated: Partida = {
          ...p,
          metradoAcumulado: newAcumulado,
          metradoDia: Number(additionalMetrado),
          porcentajeAvance: newPct
        };
        supabasePartidasService.save(updated).catch(console.warn);
        return updated;
      }
      return p;
    }));
  };

  // Personnel CRUD
  const addWorker = (workerData: Omit<WorkerPersonnel, 'id'>) => {
    const newWorker: WorkerPersonnel = {
      ...workerData,
      id: `per-${Date.now()}`
    };
    setPersonnel(prev => [newWorker, ...prev]);
    supabaseWorkersService.save(newWorker).catch(console.warn);
  };

  const updateWorker = (id: string, updated: Partial<WorkerPersonnel>) => {
    setPersonnel(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updated };
        supabaseWorkersService.save(merged).catch(console.warn);
        return merged;
      }
      return p;
    }));
  };

  const deleteWorker = (id: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== id));
    supabaseWorkersService.remove(id).catch(console.warn);
  };

  // Materials CRUD
  const addMaterial = (matData: Omit<MaterialUsage, 'id'>) => {
    const newMat: MaterialUsage = {
      ...matData,
      id: `mat-${Date.now()}`
    };
    setMaterials(prev => [newMat, ...prev]);
    supabaseMaterialsService.save(newMat).catch(console.warn);
  };

  const updateMaterial = (id: string, updated: Partial<MaterialUsage>) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const merged = { ...m, ...updated };
        supabaseMaterialsService.save(merged).catch(console.warn);
        return merged;
      }
      return m;
    }));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    supabaseMaterialsService.remove(id).catch(console.warn);
  };

  // Equipment CRUD
  const addEquipment = (eqData: Omit<EquipmentUsage, 'id'>) => {
    const newEq: EquipmentUsage = {
      ...eqData,
      id: `eq-${Date.now()}`
    };
    setEquipment(prev => [newEq, ...prev]);
    supabaseEquipmentService.save(newEq).catch(console.warn);
  };

  const updateEquipment = (id: string, updated: Partial<EquipmentUsage>) => {
    setEquipment(prev => prev.map(e => {
      if (e.id === id) {
        const merged = { ...e, ...updated };
        supabaseEquipmentService.save(merged).catch(console.warn);
        return merged;
      }
      return e;
    }));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
    supabaseEquipmentService.remove(id).catch(console.warn);
  };

  // Incidents CRUD
  const addIncident = (incData: Omit<Incident, 'id'>) => {
    const newInc: Incident = {
      ...incData,
      id: `inc-${Date.now()}`
    };
    setIncidents(prev => [newInc, ...prev]);
    supabaseIncidentsService.save(newInc).catch(console.warn);

    if (incData.fotografia) {
      const photo: PhotoEvidence = {
        id: `pho-${Date.now()}`,
        url: incData.fotografia!,
        fecha: incData.fecha,
        descripcion: `Incidencia: ${incData.tipo} - ${incData.descripcion.substring(0, 80)}`,
        ubicacion: incData.ubicacion,
        incidenciaId: newInc.id,
        responsable: incData.responsable
      };
      setPhotos(prev => [photo, ...prev]);
      supabasePhotosService.save(photo).catch(console.warn);
    }
  };

  const updateIncident = (id: string, updated: Partial<Incident>) => {
    setIncidents(prev => prev.map(i => {
      if (i.id === id) {
        const merged = { ...i, ...updated };
        supabaseIncidentsService.save(merged).catch(console.warn);
        return merged;
      }
      return i;
    }));
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
    supabaseIncidentsService.remove(id).catch(console.warn);
  };

  // Photos CRUD
  const addPhoto = (photoData: Omit<PhotoEvidence, 'id'>) => {
    const newPhoto: PhotoEvidence = {
      ...photoData,
      id: `pho-${Date.now()}`
    };
    setPhotos(prev => [newPhoto, ...prev]);
    supabasePhotosService.save(newPhoto).catch(console.warn);
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    supabasePhotosService.remove(id).catch(console.warn);
  };

  // System Actions
  const resetToDefaults = () => {
    setProject(INITIAL_PROJECT);
    setPartidas(INITIAL_PARTIDAS);
    setDailyReports(INITIAL_DAILY_REPORTS);
    setPersonnel(INITIAL_PERSONNEL);
    setMaterials(INITIAL_MATERIALS);
    setEquipment(INITIAL_EQUIPMENT);
    setIncidents(INITIAL_INCIDENTS);
    setPhotos(INITIAL_PHOTOS);
    setSelectedDate('2026-08-26');
    supabaseProjectService.save(INITIAL_PROJECT).catch(console.warn);
    INITIAL_PARTIDAS.forEach(p => supabasePartidasService.save(p).catch(console.warn));
  };

  const exportBackupJSON = () => {
    const backupData = {
      version: '3.0-supabase',
      exportedAt: new Date().toISOString(),
      project,
      partidas,
      dailyReports,
      personnel,
      materials,
      equipment,
      incidents,
      photos,
      dailyInspectionState,
      foundationScheduleTasks,
      foundationMilestones,
      foundationState
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Control_Obra_Supabase_Backup_${project.codigo || 'OBRA'}_${selectedDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.project) {
        setProject(parsed.project);
        supabaseProjectService.save(parsed.project).catch(console.warn);
      }
      if (parsed.partidas) {
        setPartidas(parsed.partidas);
        parsed.partidas.forEach((p: Partida) => supabasePartidasService.save(p).catch(console.warn));
      }
      if (parsed.dailyReports) {
        setDailyReports(parsed.dailyReports);
        parsed.dailyReports.forEach((r: DailyReport) => supabaseReportsService.save(r).catch(console.warn));
      }
      if (parsed.personnel) {
        setPersonnel(parsed.personnel);
        parsed.personnel.forEach((w: WorkerPersonnel) => supabaseWorkersService.save(w).catch(console.warn));
      }
      if (parsed.materials) {
        setMaterials(parsed.materials);
        parsed.materials.forEach((m: MaterialUsage) => supabaseMaterialsService.save(m).catch(console.warn));
      }
      if (parsed.equipment) {
        setEquipment(parsed.equipment);
        parsed.equipment.forEach((e: EquipmentUsage) => supabaseEquipmentService.save(e).catch(console.warn));
      }
      if (parsed.incidents) {
        setIncidents(parsed.incidents);
        parsed.incidents.forEach((inc: Incident) => supabaseIncidentsService.save(inc).catch(console.warn));
      }
      if (parsed.photos) {
        setPhotos(parsed.photos);
        parsed.photos.forEach((ph: PhotoEvidence) => supabasePhotosService.save(ph).catch(console.warn));
      }
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  };

  return (
    <ConstructionContext.Provider
      value={{
        isSupabaseConnected,
        isFirestoreConnected: isSupabaseConnected,
        isSyncing,
        lastSyncTime,
        syncDataToSupabase,
        syncDataToFirestore: syncDataToSupabase,
        project,
        partidas,
        dailyReports,
        personnel,
        materials,
        equipment,
        incidents,
        photos,
        selectedDate,
        activeTab,
        currentView: activeTab,
        isMobileMenuOpen,
        activeModal,
        editingItem,
        officialReportDate,
        foundationActivities: FOUNDATION_ACTIVITIES,
        foundationState,
        currentDayFoundationChecks,
        currentDayFoundationCheckedCount,
        currentDayFoundationTotalCount,
        currentDayFoundationPercentage,
        dailyInspectionItems: DAILY_INSPECTION_ITEMS,
        dailyInspectionState,
        currentDayInspections,
        inspectionsConformeCount,
        inspectionsNoConformeCount,
        inspectionsPendienteCount,
        foundationScheduleTasks,
        foundationMilestones,
        foundationScheduleOverallRealProgress,
        foundationSchedulePlannedProgress,
        setSelectedDate,
        setActiveTab,
        setCurrentView: setActiveTab,
        setIsMobileMenuOpen,
        setActiveModal,
        setOfficialReportDate,
        toggleFoundationActivity,
        updateFoundationActivityDetails,
        batchSetFoundationActivities,
        resetFoundationDay,
        setDailyInspectionStatus,
        updateDailyInspectionObs,
        convertInspectionToIncident,
        resetDailyInspections,
        updateScheduleTask,
        toggleMilestone,
        resetFoundationSchedule,
        overallProgress,
        todayReports,
        todayPersonnel,
        todayMaterials,
        todayEquipment,
        todayIncidents,
        pendingIncidentsCount,
        inProgressIncidentsCount,
        resolvedIncidentsCount,
        todayWorkersCount,
        todayTotalHours,
        updateProjectInfo,
        addDailyReport,
        updateDailyReport,
        deleteDailyReport,
        addPartida,
        updatePartida,
        deletePartida,
        quickAddMetradoToPartida,
        addWorker,
        updateWorker,
        deleteWorker,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addIncident,
        updateIncident,
        deleteIncident,
        addPhoto,
        deletePhoto,
        resetToDefaults,
        exportBackupJSON,
        importBackupJSON
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};

export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context) {
    throw new Error('useConstruction must be used within a ConstructionProvider');
  }
  return context;
};
