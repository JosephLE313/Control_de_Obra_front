import {
  db,
  COLLECTIONS,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch
} from '../lib/firebase';
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
  FoundationActivityCheck,
  UserProfile
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
  INITIAL_FOUNDATION_STATE
} from '../data/foundationActivities';
import {
  INITIAL_DAILY_INSPECTIONS_STATE
} from '../data/dailyInspectionData';
import {
  FOUNDATION_SCHEDULE_TASKS,
  FOUNDATION_SCHEDULE_MILESTONES
} from '../data/foundationScheduleData';

// --- SEEDING FUNCTION ---
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const projectDocRef = doc(db, COLLECTIONS.PROJECTS, INITIAL_PROJECT.id || 'proj-001');
    const projectSnap = await getDoc(projectDocRef);

    if (projectSnap.exists()) {
      return false; // Database already has data
    }

    console.log('[Firestore] Database is empty. Seeding initial construction datasets...');
    const batch = writeBatch(db);

    // 1. Project
    batch.set(projectDocRef, INITIAL_PROJECT);

    // 2. Partidas
    INITIAL_PARTIDAS.forEach(p => {
      batch.set(doc(db, COLLECTIONS.PARTIDAS, p.id), p);
    });

    // 3. Daily Reports
    INITIAL_DAILY_REPORTS.forEach(r => {
      batch.set(doc(db, COLLECTIONS.DAILY_REPORTS, r.id), r);
    });

    // 4. Personnel (Workers)
    INITIAL_PERSONNEL.forEach(w => {
      batch.set(doc(db, COLLECTIONS.WORKERS, w.id), w);
    });

    // 5. Materials
    INITIAL_MATERIALS.forEach(m => {
      batch.set(doc(db, COLLECTIONS.MATERIALS, m.id), m);
    });

    // 6. Equipment
    INITIAL_EQUIPMENT.forEach(e => {
      batch.set(doc(db, COLLECTIONS.EQUIPMENT, e.id), e);
    });

    // 7. Incidents
    INITIAL_INCIDENTS.forEach(inc => {
      batch.set(doc(db, COLLECTIONS.INCIDENTS, inc.id), inc);
    });

    // 8. Photos
    INITIAL_PHOTOS.forEach(ph => {
      batch.set(doc(db, COLLECTIONS.PHOTO_EVIDENCE, ph.id), ph);
    });

    // 9. Foundation Schedule Tasks
    FOUNDATION_SCHEDULE_TASKS.forEach(t => {
      batch.set(doc(db, COLLECTIONS.FOUNDATION_SCHEDULE, t.id), t);
    });

    // 10. Foundation Milestones
    FOUNDATION_SCHEDULE_MILESTONES.forEach(m => {
      batch.set(doc(db, COLLECTIONS.FOUNDATION_MILESTONES, m.id), m);
    });

    // 11. Daily Inspections
    Object.entries(INITIAL_DAILY_INSPECTIONS_STATE).forEach(([date, items]) => {
      Object.entries(items).forEach(([itemId, check]) => {
        const id = `${date}__${itemId}`;
        batch.set(doc(db, COLLECTIONS.DAILY_INSPECTIONS, id), {
          id,
          fecha: date,
          itemId,
          ...check
        });
      });
    });

    // 12. Foundation Checks
    Object.entries(INITIAL_FOUNDATION_STATE).forEach(([date, acts]) => {
      Object.entries(acts).forEach(([activityId, check]) => {
        const id = `${date}__${activityId}`;
        batch.set(doc(db, COLLECTIONS.FOUNDATION_CHECKS, id), {
          id,
          fecha: date,
          activityId,
          ...check
        });
      });
    });

    await batch.commit();
    console.log('[Firestore] Initial data successfully seeded to Cloud Firestore.');
    return true;
  } catch (error) {
    console.error('[Firestore] Error seeding initial data:', error);
    return false;
  }
}

// --- PROJECT SERVICE ---
export const projectService = {
  subscribe(callback: (project: ProjectInfo | null) => void) {
    const docRef = doc(db, COLLECTIONS.PROJECTS, INITIAL_PROJECT.id || 'proj-001');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as ProjectInfo);
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn('[Firestore] Project subscription error:', error);
    });
  },
  async update(project: ProjectInfo) {
    const docRef = doc(db, COLLECTIONS.PROJECTS, project.id || 'proj-001');
    await setDoc(docRef, project, { merge: true });
  }
};

// --- PARTIDAS SERVICE ---
export const partidasService = {
  subscribe(callback: (partidas: Partida[]) => void) {
    const colRef = collection(db, COLLECTIONS.PARTIDAS);
    return onSnapshot(colRef, (snapshot) => {
      const list: Partida[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Partida);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Partidas subscription error:', error);
    });
  },
  async save(partida: Partida) {
    const docRef = doc(db, COLLECTIONS.PARTIDAS, partida.id);
    await setDoc(docRef, partida, { merge: true });
  },
  async saveAll(partidas: Partida[]) {
    const batch = writeBatch(db);
    partidas.forEach(p => {
      const docRef = doc(db, COLLECTIONS.PARTIDAS, p.id);
      batch.set(docRef, p, { merge: true });
    });
    await batch.commit();
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.PARTIDAS, id));
  }
};

// --- DAILY REPORTS SERVICE ---
export const dailyReportsService = {
  subscribe(callback: (reports: DailyReport[]) => void) {
    const colRef = collection(db, COLLECTIONS.DAILY_REPORTS);
    return onSnapshot(colRef, (snapshot) => {
      const list: DailyReport[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as DailyReport);
      });
      // Sort by date desc
      list.sort((a, b) => b.fecha.localeCompare(a.fecha));
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Reports subscription error:', error);
    });
  },
  async save(report: DailyReport) {
    const docRef = doc(db, COLLECTIONS.DAILY_REPORTS, report.id);
    await setDoc(docRef, report, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.DAILY_REPORTS, id));
  }
};

// --- WORKERS (PERSONNEL) SERVICE ---
export const workersService = {
  subscribe(callback: (workers: WorkerPersonnel[]) => void) {
    const colRef = collection(db, COLLECTIONS.WORKERS);
    return onSnapshot(colRef, (snapshot) => {
      const list: WorkerPersonnel[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as WorkerPersonnel);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Workers subscription error:', error);
    });
  },
  async save(worker: WorkerPersonnel) {
    const docRef = doc(db, COLLECTIONS.WORKERS, worker.id);
    await setDoc(docRef, worker, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.WORKERS, id));
  }
};

// --- MATERIALS SERVICE ---
export const materialsService = {
  subscribe(callback: (materials: MaterialUsage[]) => void) {
    const colRef = collection(db, COLLECTIONS.MATERIALS);
    return onSnapshot(colRef, (snapshot) => {
      const list: MaterialUsage[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as MaterialUsage);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Materials subscription error:', error);
    });
  },
  async save(material: MaterialUsage) {
    const docRef = doc(db, COLLECTIONS.MATERIALS, material.id);
    await setDoc(docRef, material, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.MATERIALS, id));
  }
};

// --- EQUIPMENT SERVICE ---
export const equipmentService = {
  subscribe(callback: (equipment: EquipmentUsage[]) => void) {
    const colRef = collection(db, COLLECTIONS.EQUIPMENT);
    return onSnapshot(colRef, (snapshot) => {
      const list: EquipmentUsage[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as EquipmentUsage);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Equipment subscription error:', error);
    });
  },
  async save(equipment: EquipmentUsage) {
    const docRef = doc(db, COLLECTIONS.EQUIPMENT, equipment.id);
    await setDoc(docRef, equipment, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.EQUIPMENT, id));
  }
};

// --- INCIDENTS SERVICE ---
export const incidentsService = {
  subscribe(callback: (incidents: Incident[]) => void) {
    const colRef = collection(db, COLLECTIONS.INCIDENTS);
    return onSnapshot(colRef, (snapshot) => {
      const list: Incident[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Incident);
      });
      list.sort((a, b) => b.fecha.localeCompare(a.fecha));
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Incidents subscription error:', error);
    });
  },
  async save(incident: Incident) {
    const docRef = doc(db, COLLECTIONS.INCIDENTS, incident.id);
    await setDoc(docRef, incident, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.INCIDENTS, id));
  }
};

// --- PHOTO EVIDENCE SERVICE ---
export const photosService = {
  subscribe(callback: (photos: PhotoEvidence[]) => void) {
    const colRef = collection(db, COLLECTIONS.PHOTO_EVIDENCE);
    return onSnapshot(colRef, (snapshot) => {
      const list: PhotoEvidence[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as PhotoEvidence);
      });
      list.sort((a, b) => b.fecha.localeCompare(a.fecha));
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Photos subscription error:', error);
    });
  },
  async save(photo: PhotoEvidence) {
    const docRef = doc(db, COLLECTIONS.PHOTO_EVIDENCE, photo.id);
    await setDoc(docRef, photo, { merge: true });
  },
  async remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.PHOTO_EVIDENCE, id));
  }
};

// --- DAILY INSPECTIONS SERVICE ---
export const dailyInspectionsService = {
  subscribe(callback: (state: DailyInspectionState) => void) {
    const colRef = collection(db, COLLECTIONS.DAILY_INSPECTIONS);
    return onSnapshot(colRef, (snapshot) => {
      const state: DailyInspectionState = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as DailyInspectionCheck & { fecha: string; itemId: string };
        if (data.fecha && data.itemId) {
          if (!state[data.fecha]) state[data.fecha] = {};
          state[data.fecha][data.itemId] = {
            itemId: data.itemId,
            estado: data.estado,
            observaciones: data.observaciones || '',
            accionCorrectiva: data.accionCorrectiva,
            horaRegistro: data.horaRegistro,
            responsableVerificador: data.responsableVerificador,
            esIncidenciaRegistrada: data.esIncidenciaRegistrada
          };
        }
      });
      callback(state);
    }, (error) => {
      console.warn('[Firestore] Daily Inspections subscription error:', error);
    });
  },
  async saveCheck(date: string, itemId: string, check: Partial<DailyInspectionCheck>) {
    const id = `${date}__${itemId}`;
    const docRef = doc(db, COLLECTIONS.DAILY_INSPECTIONS, id);
    await setDoc(docRef, {
      id,
      fecha: date,
      itemId,
      ...check
    }, { merge: true });
  },
  async resetDay(date: string) {
    const colRef = collection(db, COLLECTIONS.DAILY_INSPECTIONS);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.fecha === date) {
        batch.delete(docSnap.ref);
      }
    });
    await batch.commit();
  }
};

// --- FOUNDATION SCHEDULE SERVICE ---
export const foundationScheduleService = {
  subscribeTasks(callback: (tasks: ScheduleTask[]) => void) {
    const colRef = collection(db, COLLECTIONS.FOUNDATION_SCHEDULE);
    return onSnapshot(colRef, (snapshot) => {
      const list: ScheduleTask[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as ScheduleTask);
      });
      list.sort((a, b) => a.wbs.localeCompare(b.wbs, undefined, { numeric: true }));
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Schedule tasks subscription error:', error);
    });
  },
  async saveTask(task: ScheduleTask) {
    const docRef = doc(db, COLLECTIONS.FOUNDATION_SCHEDULE, task.id);
    await setDoc(docRef, task, { merge: true });
  },
  async resetTasks() {
    const batch = writeBatch(db);
    FOUNDATION_SCHEDULE_TASKS.forEach(t => {
      const docRef = doc(db, COLLECTIONS.FOUNDATION_SCHEDULE, t.id);
      batch.set(docRef, t);
    });
    await batch.commit();
  },
  subscribeMilestones(callback: (milestones: ScheduleMilestone[]) => void) {
    const colRef = collection(db, COLLECTIONS.FOUNDATION_MILESTONES);
    return onSnapshot(colRef, (snapshot) => {
      const list: ScheduleMilestone[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as ScheduleMilestone);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firestore] Milestones subscription error:', error);
    });
  },
  async saveMilestone(milestone: ScheduleMilestone) {
    const docRef = doc(db, COLLECTIONS.FOUNDATION_MILESTONES, milestone.id);
    await setDoc(docRef, milestone, { merge: true });
  },
  async resetMilestones() {
    const batch = writeBatch(db);
    FOUNDATION_SCHEDULE_MILESTONES.forEach(m => {
      const docRef = doc(db, COLLECTIONS.FOUNDATION_MILESTONES, m.id);
      batch.set(docRef, m);
    });
    await batch.commit();
  }
};

// --- FOUNDATION DAILY CHECKS SERVICE ---
export const foundationChecksService = {
  subscribe(callback: (state: FoundationDailyState) => void) {
    const colRef = collection(db, COLLECTIONS.FOUNDATION_CHECKS);
    return onSnapshot(colRef, (snapshot) => {
      const state: FoundationDailyState = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as FoundationActivityCheck & { fecha: string; activityId: string };
        if (data.fecha && data.activityId) {
          if (!state[data.fecha]) state[data.fecha] = {};
          state[data.fecha][data.activityId] = {
            activityId: data.activityId,
            hecho: data.hecho,
            horaRegistro: data.horaRegistro,
            metradoEjecutado: data.metradoEjecutado,
            unidad: data.unidad,
            observaciones: data.observaciones,
            responsable: data.responsable,
            frente: data.frente
          };
        }
      });
      callback(state);
    }, (error) => {
      console.warn('[Firestore] Foundation checks subscription error:', error);
    });
  },
  async saveCheck(date: string, activityId: string, check: Partial<FoundationActivityCheck>) {
    const id = `${date}__${activityId}`;
    const docRef = doc(db, COLLECTIONS.FOUNDATION_CHECKS, id);
    await setDoc(docRef, {
      id,
      fecha: date,
      activityId,
      ...check
    }, { merge: true });
  },
  async resetDay(date: string) {
    const colRef = collection(db, COLLECTIONS.FOUNDATION_CHECKS);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.fecha === date) {
        batch.delete(docSnap.ref);
      }
    });
    await batch.commit();
  }
};

// --- TEST FIREBASE CONNECTION SERVICE ---
export interface TestConnectionResult {
  success: boolean;
  documentId: string;
  collectionName: string;
  timestamp: string;
  dataWritten?: Record<string, any>;
  latencyMs: number;
  readBackConfirmed?: boolean;
  error?: string;
  errorMessageDetails?: string;
}

export const testConnectionService = {
  async runTest(metadata?: { projectName?: string; projectCode?: string }): Promise<TestConnectionResult> {
    const startTime = performance.now();
    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    const testId = `test_${Date.now()}_${uniqueSuffix}`;
    const timestamp = new Date().toISOString();

    const payload = {
      id: testId,
      message: 'Prueba de conexión exitosa en Cloud Firestore desde Control de Obra',
      timestamp,
      status: 'success',
      testedBy: 'Control de Obra Applet Tester',
      clientTimestamp: new Date().toLocaleString(),
      appMetadata: {
        projectName: metadata?.projectName || 'Control de Obra',
        projectCode: metadata?.projectCode || 'OBRA-2026',
        source: 'TEST FIREBASE Button',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Web',
        online: typeof navigator !== 'undefined' ? navigator.onLine : true
      }
    };

    try {
      // 1. Write document to 'test_connection' collection
      const docRef = doc(db, COLLECTIONS.TEST_CONNECTION, testId);
      await setDoc(docRef, payload);

      // 2. Read back document to strictly verify read & write permissions
      const readSnap = await getDoc(docRef);
      const readBackConfirmed = readSnap.exists();

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      return {
        success: true,
        documentId: testId,
        collectionName: COLLECTIONS.TEST_CONNECTION,
        timestamp,
        dataWritten: payload,
        latencyMs,
        readBackConfirmed
      };
    } catch (err: any) {
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);
      console.error('[Firestore Test] Failed writing to test_connection:', err);

      return {
        success: false,
        documentId: testId,
        collectionName: COLLECTIONS.TEST_CONNECTION,
        timestamp,
        latencyMs,
        error: err?.message || String(err),
        errorMessageDetails: err?.stack || err?.code || 'Desconocido'
      };
    }
  },

  async getRecentTests(limitCount = 5): Promise<any[]> {
    try {
      const colRef = collection(db, COLLECTIONS.TEST_CONNECTION);
      const snapshot = await getDocs(colRef);
      const docs: any[] = [];
      snapshot.forEach(d => docs.push(d.data()));
      return docs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')).slice(0, limitCount);
    } catch (e) {
      console.warn('Error fetching recent tests:', e);
      return [];
    }
  }
};

// --- USER MANAGEMENT (CLOUD FIRESTORE) ---
export const userService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USUARIOS, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile & { correo?: string };
        return {
          ...data,
          email: data.email || data.correo || '',
          correo: data.correo || data.email || '',
          nombre: data.nombre || 'Usuario',
          apellido: data.apellido || '',
          cargo: data.cargo || 'Usuario',
          empresa: data.empresa || 'Constructora Principal',
          fotoPerfil: data.fotoPerfil || ''
        };
      }
      return null;
    } catch (error) {
      console.error('[UserService] Error getting user profile:', error);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USUARIOS, profile.uid);
    const payload = {
      ...profile,
      correo: profile.correo || profile.email,
      email: profile.email || profile.correo || '',
      fotoPerfil: profile.fotoPerfil || ''
    };
    await setDoc(docRef, payload, { merge: true });
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USUARIOS, uid);
    await updateDoc(docRef, updates);
  },

  async updateUserLastConnection(uid: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USUARIOS, uid);
      await updateDoc(docRef, {
        ultimaConexion: new Date().toISOString()
      });
    } catch (error) {
      console.warn('[UserService] Could not update last connection time:', error);
    }
  }
};

