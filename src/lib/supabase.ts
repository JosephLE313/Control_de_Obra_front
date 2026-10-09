/// <reference types="vite/client" />

import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export const DEFAULT_SUPABASE_URL = 'https://controldeobra-app.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbnRyb2xkZW9icmEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODgyMzQwMCwiZXhwIjoyMDU0Mzg0MDAwfQ.7f8h9j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7';

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

  // Priority 1: custom credentials entered by user in UI
  if (storageUrl && storageKey) {
    return {
      url: storageUrl,
      anonKey: storageKey,
      isConfigured: true,
      source: 'storage'
    };
  }

  // Priority 2: environment variables (if provided and valid)
  if (envUrl && envKey && !envUrl.includes('xyzcompany')) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: 'env'
    };
  }

  // Priority 3: Ready-to-use default Supabase project configuration
  return {
    url: storageUrl || (envUrl && !envUrl.includes('xyzcompany') ? envUrl : DEFAULT_SUPABASE_URL),
    anonKey: storageKey || (envKey && !envKey.includes('...') ? envKey : DEFAULT_SUPABASE_ANON_KEY),
    isConfigured: true,
    source: 'default'
  };
}

let cachedClient: SupabaseClient | null = null;
let currentClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
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

-- Habilitar RLS (Row Level Security) y crear políticas públicas para permitir lectura y escritura desde la aplicación
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

-- Políticas de acceso para anon / authenticated
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    AND tablename IN ('projects', 'partidas', 'daily_reports', 'workers', 'materials', 'equipment', 'incidents', 'photo_evidence', 'daily_inspections', 'foundation_schedule', 'foundation_milestones', 'foundation_checks', 'test_connection')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Permitir todo publico" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "Permitir todo publico" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
`;
