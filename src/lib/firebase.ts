import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy,
  Firestore
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId || undefined
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with Local Persistence
export const auth: Auth = getAuth(app);

// Explicitly set browserLocalPersistence to guarantee session continuity across page reloads and browser restarts
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Firebase Auth] Persistence initialization notice:', err);
  });
}

// Initialize Firestore (with designated custom databaseId if configured)
export const db: Firestore = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Collection Names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  PARTIDAS: 'partidas',
  DAILY_REPORTS: 'daily_reports',
  WORKERS: 'workers',
  MATERIALS: 'materials',
  EQUIPMENT: 'equipment',
  INCIDENTS: 'incidents',
  PHOTO_EVIDENCE: 'photo_evidence',
  DAILY_INSPECTIONS: 'daily_inspections',
  FOUNDATION_SCHEDULE: 'foundation_schedule_tasks',
  FOUNDATION_MILESTONES: 'foundation_milestones',
  FOUNDATION_CHECKS: 'foundation_checks',
  TEST_CONNECTION: 'test_connection',
  USUARIOS: 'usuarios'
} as const;

export {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy,
  // Auth exports
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
};
export type { FirebaseUser };

