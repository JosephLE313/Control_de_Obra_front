import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Clock,
  FileCode,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Key,
  Globe,
  UploadCloud,
  CheckCheck
} from 'lucide-react';
import { supabaseTestService, supabaseDataService, SupabaseTestResult } from '../services/supabaseService';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY
} from '../lib/supabase';
import { useConstruction } from '../context/ConstructionContext';

interface TestSupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestSupabaseModal: React.FC<TestSupabaseModalProps> = ({ isOpen, onClose }) => {
  const {
    project,
    isSupabaseConnected,
    syncDataToSupabase,
    isSyncing,
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
  } = useConstruction();

  const [activeTab, setActiveTab] = useState<'test' | 'config' | 'sql'>('test');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SupabaseTestResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Configuration inputs
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [configSaved, setConfigSaved] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // Sync state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setUrlInput(config.url || DEFAULT_SUPABASE_URL);
      setKeyInput(config.anonKey || DEFAULT_SUPABASE_ANON_KEY);
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const tests = await supabaseTestService.getRecentTests(4);
      setRecentTests(tests);
    } catch (e) {
      console.warn('Error loading history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRunTest = async () => {
    setIsRunning(true);
    setResult(null);
    setCopied(false);

    try {
      const res = await supabaseTestService.runTest({
        projectName: project.nombre,
        projectCode: project.codigo
      });
      setResult(res);
      await loadHistory();
    } catch (err: any) {
      setResult({
        success: false,
        documentId: `test_err_${Date.now()}`,
        tableName: 'test_connection',
        timestamp: new Date().toISOString(),
        latencyMs: 0,
        error: err?.message || 'Error desconocido al invocar Supabase'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigError(null);
    const ok = saveSupabaseConfig(urlInput, keyInput);
    if (!ok) setConfigError("Usa una URL válida y una clave publishable/anon pública. No se permiten claves secret ni service_role.");
    if (ok) {
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
      setActiveTab('test');
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleCopyJSON = () => {
    if (!result?.dataWritten) return;
    navigator.clipboard.writeText(JSON.stringify(result.dataWritten, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
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
      setSeedMessage(res.message);
    } catch (e: any) {
      setSeedMessage(`Error: ${e?.message || String(e)}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">Conexión a Supabase</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  isSupabaseConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isSupabaseConnected ? 'CONECTADO' : 'PENDIENTE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PostgreSQL en la nube de Supabase • Reemplazo directo de Firebase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('test')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'test'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Prueba de Conexión
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Credenciales y URL
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Script SQL (Tablas)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'test' && (
            <>
              {/* Info banner */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-950 block">Conexión Directa a Supabase</span>
                  <p className="text-slate-600">
                    La aplicación ahora interactúa con Supabase para almacenar la información de la obra. Puedes probar la conectividad en vivo escribiendo un registro de verificación en la tabla <code className="bg-emerald-100 text-emerald-900 font-mono px-1 py-0.5 rounded text-[11px]">test_connection</code>.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleRunTest}
                  disabled={isRunning}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Ejecutando Test en Supabase...' : 'Ejecutar Test de Conexión'}</span>
                </button>

                <button
                  onClick={handleSeedData}
                  disabled={isSeeding || isSyncing}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl border border-slate-300 transition-all cursor-pointer text-xs disabled:opacity-50"
                  title="Sincronizar todos los datos de la obra a Supabase"
                >
                  <UploadCloud className={`w-4 h-4 ${isSeeding ? 'animate-bounce' : ''}`} />
                  <span>{isSeeding ? 'Sincronizando...' : 'Subir Datos de Obra a Supabase'}</span>
                </button>
              </div>

              {seedMessage && (
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{seedMessage}</span>
                </div>
              )}

              {/* Test Result Display */}
              {result && (
                <div className={`p-4 rounded-xl border transition-all ${
                  result.success
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-300 text-rose-950'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-3">
                    <div className="flex items-center space-x-2">
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span className="font-extrabold text-sm tracking-tight">
                        {result.success ? 'Conexión a Supabase Exitosa' : 'Fallo en la Conexión'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/70 border border-current/20">
                      {result.latencyMs} ms
                    </span>
                  </div>

                  {result.success ? (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block">Tabla:</span>
                          <span className="font-bold text-slate-800">{result.tableName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ID Generado:</span>
                          <span className="font-bold text-slate-800 truncate block">{result.documentId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Lectura Confirmada:</span>
                          <span className="font-bold text-emerald-700">✓ Sí (SELECT verificado)</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Timestamp:</span>
                          <span className="text-slate-800 truncate block">{result.timestamp}</span>
                        </div>
                      </div>

                      {result.dataWritten && (
                        <div className="relative mt-2">
                          <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-36">
                            {JSON.stringify(result.dataWritten, null, 2)}
                          </pre>
                          <button
                            onClick={handleCopyJSON}
                            className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center space-x-1 cursor-pointer"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copiado' : 'Copiar'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-rose-800">{result.error}</p>
                      {result.errorDetails && (
                        <pre className="bg-slate-900 text-rose-300 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-24">
                          {result.errorDetails}
                        </pre>
                      )}
                      {result.requiresTableCreation && (
                        <div className="pt-2">
                          <button
                            onClick={() => setActiveTab('sql')}
                            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                          >
                            <span>Ir a la pestaña de Script SQL para copiar el esquema</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Recent tests history */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Últimas Pruebas Registradas</span>
                  </span>
                  <button
                    onClick={loadHistory}
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    Actualizar
                  </button>
                </div>

                {loadingHistory ? (
                  <div className="p-4 text-center text-xs text-slate-400">Cargando historial...</div>
                ) : recentTests.length > 0 ? (
                  <div className="space-y-1.5">
                    {recentTests.map((t, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-mono text-slate-700 text-[11px]">{t.id || 'test'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
                    Aún no hay registros de prueba en Supabase.
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Conectar tu Proyecto de Supabase</span>
                <p>
                  Ingresa las credenciales de tu proyecto Supabase (disponibles en <strong>Project Settings &gt; API</strong> en supabase.com).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Project URL (VITE_SUPABASE_URL)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <span>Anon Public Key (VITE_SUPABASE_ANON_KEY)</span>
                </label>
                <input
                  type="password"
                  aria-label="Clave pública de Supabase"
                  autoComplete="off"
                  placeholder="Clave pública publishable o anon"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {configError && <p role="alert" className="text-xs text-red-700">{configError}</p>}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    <span>Ir a Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput(DEFAULT_SUPABASE_URL);
                      setKeyInput(DEFAULT_SUPABASE_ANON_KEY);
                      saveSupabaseConfig(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
                      setConfigSaved(true);
                      setTimeout(() => setConfigSaved(false), 2000);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Borrar configuración local
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  {configSaved ? <CheckCheck className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
                  <span>{configSaved ? '¡Guardado con Éxito!' : 'Guardar y Conectar'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Script de Creación de Tablas (DDL)</h4>
                  <p className="text-[11px] text-slate-500">
                    Este esquema cierra el acceso público. Configura autorización por proyecto antes de habilitar la sincronización.
                  </p>
                </div>
                <button
                  onClick={handleCopySQL}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs py-1.5 px-3 rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{sqlCopied ? '¡SQL Copiado!' : 'Copiar Script'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 text-emerald-300 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-72 border border-slate-800 selection:bg-emerald-600 selection:text-white">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Motor de Base de Datos: <strong>Supabase (PostgreSQL)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

const SaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);
