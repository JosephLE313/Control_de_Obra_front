/// <reference types="vite/client" />

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isValidPublicSupabaseConfig } from './publicCredentials';

const STORAGE_KEY_URL = 'control_obra_supabase_url';
const STORAGE_KEY_ANON_KEY = 'control_obra_supabase_anon_key';

export const SUPABASE_TABLES = {
  PROJECTS: 'projects',
  PARTIDAS: 'partidas',
  DAILY_REPORTS: 'daily_reports',
  WORKERS: 'workers',
  MATERIALS: 'materials',
  EQUIPMENT: 'equipment',
  INCIDENTS: 'incidents',
  PHOTO_EVIDENCE: 'photo_evidence',
  DAILY_INSPECTIONS: 'daily_inspections',
  FOUNDATION_SCHEDULE: 'foundation_schedule',
  FOUNDATION_MILESTONES: 'foundation_milestones',
  FOUNDATION_CHECKS: 'foundation_checks',
  TEST_CONNECTION: 'test_connection'
} as const;

export const DEFAULT_SUPABASE_URL = '';
export const DEFAULT_SUPABASE_ANON_KEY = '';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'storage' | 'default';
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
  const envKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

  let storageUrl = '';
  let storageKey = '';
  if (typeof window !== 'undefined') {
    try {
      storageUrl = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
      storageKey = (localStorage.getItem(STORAGE_KEY_ANON_KEY) || '').trim();
    } catch {
      // localStorage may fail in private mode
    }
  }

  // Never combine credentials from different sources or use bundled defaults.
  if (isValidPublicSupabaseConfig(storageUrl, storageKey)) {
    return { url: storageUrl, anonKey: storageKey, isConfigured: true, source: 'storage' };
  }
  // Purge invalid/privileged keys left by older versions.
  if (storageKey) {
    try { localStorage.removeItem(STORAGE_KEY_ANON_KEY); } catch { /* storage unavailable */ }
  }
  if (isValidPublicSupabaseConfig(envUrl, envKey)) {
    return { url: envUrl, anonKey: envKey, isConfigured: true, source: 'env' };
  }
  return { url: '', anonKey: '', isConfigured: false, source: 'default' };
}

let cachedClient: SupabaseClient | null = null;
let currentClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const key = `${config.url}:::${config.anonKey}`;
  if (cachedClient && currentClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    currentClientKey = key;
    return cachedClient;
  } catch (err) {
    console.warn('[Supabase] Error creating client:', err);
    return null;
  }
}

export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if ((cleanUrl || cleanKey) && !isValidPublicSupabaseConfig(cleanUrl, cleanKey)) return false;

    if (cleanUrl) {
      localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
    } else {
      localStorage.removeItem(STORAGE_KEY_URL);
    }

    if (cleanKey) {
      localStorage.setItem(STORAGE_KEY_ANON_KEY, cleanKey);
    } else {
      localStorage.removeItem(STORAGE_KEY_ANON_KEY);
    }

    cachedClient = null;
    currentClientKey = '';
    return true;
  } catch (e) {
    console.error('[Supabase] Failed to save config to localStorage:', e);
    return false;
  }
}

export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON_KEY);
    cachedClient = null;
    currentClientKey = '';
  } catch (e) {
    console.error('[Supabase] Failed to clear config:', e);
  }
}

/**
 * SQL Schema script for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- SCHEMA COMPLETO PARA CONTROL DE OBRA EN SUPABASE
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase (SQL Editor > New Query)

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Partidas y Metrados
CREATE TABLE IF NOT EXISTS public.partidas (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Reportes Diarios
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id TEXT PRIMARY KEY,
  fecha TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Personal y Cuadrillas
CREATE TABLE IF NOT EXISTS public.workers (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Materiales
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Equipos y Maquinarias
CREATE TABLE IF NOT EXISTS public.equipment (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Incidencias
CREATE TABLE IF NOT EXISTS public.incidents (
  id TEXT PRIMARY KEY,
  fecha TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabla de Evidencias Fotográficas
CREATE TABLE IF NOT EXISTS public.photo_evidence (
  id TEXT PRIMARY KEY,
  fecha TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabla de Protocolos e Inspecciones Diarias
CREATE TABLE IF NOT EXISTS public.daily_inspections (
  id TEXT PRIMARY KEY,
  fecha TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Tabla de Cronograma de Cimentación
CREATE TABLE IF NOT EXISTS public.foundation_schedule (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Hitos de Cimentación
CREATE TABLE IF NOT EXISTS public.foundation_milestones (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Chequeos Diarios de Cimentación
CREATE TABLE IF NOT EXISTS public.foundation_checks (
  id TEXT PRIMARY KEY,
  fecha TEXT,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Tabla de Prueba de Conexión
CREATE TABLE IF NOT EXISTS public.test_connection (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: acceso cerrado por defecto; autorización por proyecto debe configurarse antes de usar la nube.
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_connection ENABLE ROW LEVEL SECURITY;

-- Retirar la política pública heredada. No conceder acceso automático a todo usuario autenticado.
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN ('projects', 'partidas', 'daily_reports', 'workers', 'materials', 'equipment', 'incidents', 'photo_evidence', 'daily_inspections', 'foundation_schedule', 'foundation_milestones', 'foundation_checks', 'test_connection')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Permitir todo publico" ON public.%I', tbl);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', tbl);
  END LOOP;
END $$;
`;
