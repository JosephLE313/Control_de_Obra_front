import { getSupabaseClient, SUPABASE_TABLES, getStoredSupabaseConfig } from '../lib/supabase';
import {
  ProjectInfo,
  Partida,
  DailyReport,
  WorkerPersonnel,
  MaterialUsage,
  EquipmentUsage,
  Incident,
  PhotoEvidence,
  DailyInspectionState,
  DailyInspectionCheck,
  ScheduleTask,
  ScheduleMilestone,
  FoundationDailyState,
  FoundationActivityCheck
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
import { INITIAL_FOUNDATION_STATE } from '../data/foundationActivities';
import { INITIAL_DAILY_INSPECTIONS_STATE } from '../data/dailyInspectionData';
import { FOUNDATION_SCHEDULE_TASKS, FOUNDATION_SCHEDULE_MILESTONES } from '../data/foundationScheduleData';

// A failed API response must never be reported as a persisted write.
export async function assertSupabaseWrite<T extends { error: unknown }>(result: PromiseLike<T>): Promise<T> {
  const response = await result;
  if (response.error) throw response.error;
  return response;
}

export interface SupabaseTestResult {
  success: boolean;
  documentId: string;
  tableName: string;
  timestamp: string;
  latencyMs: number;
  readBackConfirmed?: boolean;
  dataWritten?: Record<string, any>;
  error?: string;
  errorDetails?: string;
  projectUrl?: string;
  requiresTableCreation?: boolean;
}

// --- TEST CONNECTION SERVICE ---
export const supabaseTestService = {
  async runTest(metadata?: { projectName?: string; projectCode?: string }): Promise<SupabaseTestResult> {
    const startTime = performance.now();
    const config = getStoredSupabaseConfig();
    const client = getSupabaseClient();
    const timestamp = new Date().toISOString();
    const testId = `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const base = { documentId: testId, tableName: SUPABASE_TABLES.TEST_CONNECTION, timestamp, projectUrl: config.url };
    if (!client) return { ...base, success: false, readBackConfirmed: false, latencyMs: 0, error: 'Supabase no está configurado con una clave pública válida.' };
    const payload = { id: testId, timestamp, message: 'Prueba de Control de Obra', metadata: metadata || {} };
    try {
      const { error } = await assertSupabaseWrite(client.from(SUPABASE_TABLES.TEST_CONNECTION).upsert({ id: testId, data: payload, created_at: timestamp }));
      if (error) throw error;
      const { data, error: readError } = await client.from(SUPABASE_TABLES.TEST_CONNECTION).select('*').eq('id', testId).single();
      if (readError) throw readError;
      if (!data) throw new Error('No se confirmó la lectura del registro.');
      return { ...base, success: true, readBackConfirmed: true, dataWritten: payload, latencyMs: Math.round(performance.now() - startTime) };
    } catch {
      return { ...base, success: false, readBackConfirmed: false, latencyMs: Math.round(performance.now() - startTime), error: 'No se confirmó la conexión. Revisa configuración, red y permisos de la base de datos.' };
    }
  },

  async getRecentTests(limit = 4): Promise<any[]> {
    let localTests: any[] = [];
    try {
      localTests = JSON.parse(localStorage.getItem('control_obra_supabase_tests') || '[]');
    } catch {
      localTests = [];
    }

    const client = getSupabaseClient();
    if (!client) return localTests.slice(0, limit);

    try {
      const { data, error } = await client
        .from(SUPABASE_TABLES.TEST_CONNECTION)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data) {
        return localTests.slice(0, limit);
      }

      const remoteTests = data.map(item => item.data || item);
      const merged = [...localTests, ...remoteTests];
      const seen = new Set();
      const unique = merged.filter(item => {
        const id = item.id || item.timestamp;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      return unique.slice(0, limit);
    } catch {
      return localTests.slice(0, limit);
    }
  }
};

// --- DATA SEED & SYNC SERVICE ---
export const supabaseDataService = {
  async seedInitialDataIfEmpty(): Promise<{ seeded: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { seeded: false, message: 'Supabase no está configurado.' };
    }

    try {
      // Check if project exists
      const { data: existingProjects, error: checkError } = await client
        .from(SUPABASE_TABLES.PROJECTS)
        .select('id')
        .limit(1);

      if (checkError) {
        if (checkError.message?.toLowerCase().includes('relation') || checkError.code === '42P01') {
          return {
            seeded: false,
            message: 'Tablas no encontradas en Supabase. Por favor ejecuta el Script SQL en tu SQL Editor.'
          };
        }
        return { seeded: false, message: `Error al consultar Supabase: ${checkError.message}` };
      }

      if (existingProjects && existingProjects.length > 0) {
        return { seeded: false, message: 'La base de datos de Supabase ya contiene datos de obra.' };
      }

      // Populate initial data
      console.log('[Supabase] Poblando datos iniciales de obra en Supabase...');

      // 1. Project
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.PROJECTS).upsert({
        id: INITIAL_PROJECT.id || 'proj-001',
        data: INITIAL_PROJECT
      }));

      // 2. Partidas
      const partidaRows = INITIAL_PARTIDAS.map(p => ({ id: p.id, data: p }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.PARTIDAS).upsert(partidaRows));

      // 3. Daily reports
      const reportRows = INITIAL_DAILY_REPORTS.map(r => ({ id: r.id, fecha: r.fecha, data: r }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.DAILY_REPORTS).upsert(reportRows));

      // 4. Workers
      const workerRows = INITIAL_PERSONNEL.map(w => ({ id: w.id, data: w }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.WORKERS).upsert(workerRows));

      // 5. Materials
      const materialRows = INITIAL_MATERIALS.map(m => ({ id: m.id, data: m }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.MATERIALS).upsert(materialRows));

      // 6. Equipment
      const equipmentRows = INITIAL_EQUIPMENT.map(e => ({ id: e.id, data: e }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.EQUIPMENT).upsert(equipmentRows));

      // 7. Incidents
      const incidentRows = INITIAL_INCIDENTS.map(i => ({ id: i.id, fecha: i.fecha, data: i }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.INCIDENTS).upsert(incidentRows));

      // 8. Photos
      const photoRows = INITIAL_PHOTOS.map(ph => ({ id: ph.id, fecha: ph.fecha, data: ph }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.PHOTO_EVIDENCE).upsert(photoRows));

      // 9. Foundation tasks
      const taskRows = FOUNDATION_SCHEDULE_TASKS.map(t => ({ id: t.id, data: t }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_SCHEDULE).upsert(taskRows));

      // 10. Foundation milestones
      const milestoneRows = FOUNDATION_SCHEDULE_MILESTONES.map(m => ({ id: m.id, data: m }));
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_MILESTONES).upsert(milestoneRows));

      // 11. Daily inspections
      const inspectionRows: any[] = [];
      Object.entries(INITIAL_DAILY_INSPECTIONS_STATE).forEach(([date, items]) => {
        Object.entries(items).forEach(([itemId, check]) => {
          const id = `${date}__${itemId}`;
          inspectionRows.push({
            id,
            fecha: date,
            data: { id, fecha: date, itemId, ...check }
          });
        });
      });
      if (inspectionRows.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.DAILY_INSPECTIONS).upsert(inspectionRows));
      }

      // 12. Foundation checks
      const foundationCheckRows: any[] = [];
      Object.entries(INITIAL_FOUNDATION_STATE).forEach(([date, acts]) => {
        Object.entries(acts).forEach(([activityId, check]) => {
          const id = `${date}__${activityId}`;
          foundationCheckRows.push({
            id,
            fecha: date,
            data: { id, fecha: date, activityId, ...check }
          });
        });
      });
      if (foundationCheckRows.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_CHECKS).upsert(foundationCheckRows));
      }

      return { seeded: true, message: 'Datos iniciales poblados exitosamente en Supabase.' };
    } catch (err: any) {
      console.error('[Supabase] Error al sembrar datos:', err);
      return { seeded: false, message: `Error: ${err?.message || String(err)}` };
    }
  },

  async syncAllCurrentData(dataset: {
    project: ProjectInfo;
    partidas: Partida[];
    dailyReports: DailyReport[];
    personnel: WorkerPersonnel[];
    materials: MaterialUsage[];
    equipment: EquipmentUsage[];
    incidents: Incident[];
    photos: PhotoEvidence[];
    dailyInspectionState: DailyInspectionState;
    foundationScheduleTasks: ScheduleTask[];
    foundationMilestones: ScheduleMilestone[];
    foundationState: FoundationDailyState;
  }): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase no está configurado.' };
    }

    try {
      // 1. Project
      await assertSupabaseWrite(client.from(SUPABASE_TABLES.PROJECTS).upsert({
        id: dataset.project.id || 'proj-001',
        data: dataset.project
      }));

      // 2. Partidas
      if (dataset.partidas.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.PARTIDAS).upsert(
          dataset.partidas.map(p => ({ id: p.id, data: p }))
        ));
      }

      // 3. Daily Reports
      if (dataset.dailyReports.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.DAILY_REPORTS).upsert(
          dataset.dailyReports.map(r => ({ id: r.id, fecha: r.fecha, data: r }))
        ));
      }

      // 4. Personnel
      if (dataset.personnel.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.WORKERS).upsert(
          dataset.personnel.map(w => ({ id: w.id, data: w }))
        ));
      }

      // 5. Materials
      if (dataset.materials.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.MATERIALS).upsert(
          dataset.materials.map(m => ({ id: m.id, data: m }))
        ));
      }

      // 6. Equipment
      if (dataset.equipment.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.EQUIPMENT).upsert(
          dataset.equipment.map(e => ({ id: e.id, data: e }))
        ));
      }

      // 7. Incidents
      if (dataset.incidents.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.INCIDENTS).upsert(
          dataset.incidents.map(i => ({ id: i.id, fecha: i.fecha, data: i }))
        ));
      }

      // 8. Photos
      if (dataset.photos.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.PHOTO_EVIDENCE).upsert(
          dataset.photos.map(ph => ({ id: ph.id, fecha: ph.fecha, data: ph }))
        ));
      }

      // 9. Schedule Tasks & Milestones
      if (dataset.foundationScheduleTasks.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_SCHEDULE).upsert(
          dataset.foundationScheduleTasks.map(t => ({ id: t.id, data: t }))
        ));
      }
      if (dataset.foundationMilestones.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_MILESTONES).upsert(
          dataset.foundationMilestones.map(m => ({ id: m.id, data: m }))
        ));
      }

      // 10. Daily Inspections
      const inspectionRows: any[] = [];
      Object.entries(dataset.dailyInspectionState).forEach(([date, items]) => {
        Object.entries(items).forEach(([itemId, check]) => {
          const id = `${date}__${itemId}`;
          inspectionRows.push({
            id,
            fecha: date,
            data: { id, fecha: date, itemId, ...check }
          });
        });
      });
      if (inspectionRows.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.DAILY_INSPECTIONS).upsert(inspectionRows));
      }

      // 11. Foundation Checks
      const checkRows: any[] = [];
      Object.entries(dataset.foundationState).forEach(([date, acts]) => {
        Object.entries(acts).forEach(([activityId, check]) => {
          const id = `${date}__${activityId}`;
          checkRows.push({
            id,
            fecha: date,
            data: { id, fecha: date, activityId, ...check }
          });
        });
      });
      if (checkRows.length > 0) {
        await assertSupabaseWrite(client.from(SUPABASE_TABLES.FOUNDATION_CHECKS).upsert(checkRows));
      }

      return { success: true, message: 'Todos los datos fueron sincronizados con Supabase correctamente.' };
    } catch (err: any) {
      console.error('[Supabase] Error en syncAllCurrentData:', err);
      return { success: false, message: `Error al sincronizar: ${err?.message || String(err)}` };
    }
  }
};

// Generic CRUD helpers for individual collections
export const supabaseEntityService = {
  async fetchAll<T>(tableName: string): Promise<T[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from(tableName).select('*');
      if (error || !data) return [];
      return data.map(item => (item.data || item) as T);
    } catch (err) {
      console.warn(`[Supabase] Error fetching ${tableName}:`, err);
      return [];
    }
  },

  async upsert(tableName: string, id: string, data: any, extraFields?: Record<string, any>): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const payload: Record<string, any> = { id, data, ...(extraFields || {}) };
      const { error } = await assertSupabaseWrite(client.from(tableName).upsert(payload));
      if (error) {
        console.warn(`[Supabase] Error upserting ${tableName}/${id}:`, error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`[Supabase] Exception upserting ${tableName}/${id}:`, err);
      return false;
    }
  },

  async remove(tableName: string, id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from(tableName).delete().eq('id', id);
      if (error) {
        console.warn(`[Supabase] Error deleting ${tableName}/${id}:`, error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`[Supabase] Exception deleting ${tableName}/${id}:`, err);
      return false;
    }
  },

  subscribe(tableName: string, onUpdate: () => void) {
    const client = getSupabaseClient();
    if (!client) return () => {};

    try {
      const channel = client
        .channel(`public:${tableName}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
          onUpdate();
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (e) {
      console.warn(`[Supabase] Realtime subscribe error for ${tableName}:`, e);
      return () => {};
    }
  }
};

// --- SPECIFIC SUPABASE ENTITY SERVICES ---
export const supabaseProjectService = {
  async save(project: ProjectInfo) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.PROJECTS, project.id || 'proj-001', project);
  }
};

export const supabasePartidasService = {
  async save(partida: Partida) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.PARTIDAS, partida.id, partida);
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.PARTIDAS, id);
  }
};

export const supabaseReportsService = {
  async save(report: DailyReport) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.DAILY_REPORTS, report.id, report, { fecha: report.fecha });
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.DAILY_REPORTS, id);
  }
};

export const supabaseWorkersService = {
  async save(worker: WorkerPersonnel) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.WORKERS, worker.id, worker);
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.WORKERS, id);
  }
};

export const supabaseMaterialsService = {
  async save(material: MaterialUsage) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.MATERIALS, material.id, material);
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.MATERIALS, id);
  }
};

export const supabaseEquipmentService = {
  async save(equipment: EquipmentUsage) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.EQUIPMENT, equipment.id, equipment);
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.EQUIPMENT, id);
  }
};

export const supabaseIncidentsService = {
  async save(incident: Incident) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.INCIDENTS, incident.id, incident, { fecha: incident.fecha });
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.INCIDENTS, id);
  }
};

export const supabasePhotosService = {
  async save(photo: PhotoEvidence) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.PHOTO_EVIDENCE, photo.id, photo, { fecha: photo.fecha });
  },
  async remove(id: string) {
    return supabaseEntityService.remove(SUPABASE_TABLES.PHOTO_EVIDENCE, id);
  }
};

export const supabaseInspectionsService = {
  async saveCheck(date: string, itemId: string, check: Partial<DailyInspectionCheck>) {
    const id = `${date}__${itemId}`;
    return supabaseEntityService.upsert(SUPABASE_TABLES.DAILY_INSPECTIONS, id, {
      id,
      fecha: date,
      itemId,
      ...check
    }, { fecha: date });
  },
  async resetDay(date: string) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.from(SUPABASE_TABLES.DAILY_INSPECTIONS).delete().eq('fecha', date);
    } catch (e) {
      console.warn('[Supabase] Error resetting inspection day:', e);
    }
  }
};

export const supabaseScheduleService = {
  async saveTask(task: ScheduleTask) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.FOUNDATION_SCHEDULE, task.id, task);
  },
  async saveMilestone(milestone: ScheduleMilestone) {
    return supabaseEntityService.upsert(SUPABASE_TABLES.FOUNDATION_MILESTONES, milestone.id, milestone);
  }
};

export const supabaseChecksService = {
  async saveCheck(date: string, activityId: string, check: Partial<FoundationActivityCheck>) {
    const id = `${date}__${activityId}`;
    return supabaseEntityService.upsert(SUPABASE_TABLES.FOUNDATION_CHECKS, id, {
      id,
      fecha: date,
      activityId,
      ...check
    }, { fecha: date });
  },
  async resetDay(date: string) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.from(SUPABASE_TABLES.FOUNDATION_CHECKS).delete().eq('fecha', date);
    } catch (e) {
      console.warn('[Supabase] Error resetting checks day:', e);
    }
  }
};

