import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Flame,
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
  Check
} from 'lucide-react';
import { testConnectionService, TestConnectionResult } from '../services/firestoreService';
import { useConstruction } from '../context/ConstructionContext';

interface TestFirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestFirebaseModal: React.FC<TestFirebaseModalProps> = ({ isOpen, onClose }) => {
  const { project, isFirestoreConnected } = useConstruction();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TestConnectionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const tests = await testConnectionService.getRecentTests(4);
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
      const res = await testConnectionService.runTest({
        projectName: project.nombre,
        projectCode: project.codigo
      });
      setResult(res);
      await loadHistory();
    } catch (err: any) {
      setResult({
        success: false,
        documentId: `test_err_${Date.now()}`,
        collectionName: 'test_connection',
        timestamp: new Date().toISOString(),
        latencyMs: 0,
        error: err?.message || 'Error desconocido al invocar Firestore'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyJSON = () => {
    if (!result?.dataWritten) return;
    navigator.clipboard.writeText(JSON.stringify(result.dataWritten, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">Prueba de Conexión Firebase</h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  test_connection
                </span>
              </div>
              <p className="text-xs text-slate-400">Escritura y verificación de documento en Google Cloud Firestore</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
          
          {/* Action Hero Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-center sm:justify-start space-x-1.5">
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span>Colección de destino: <strong className="text-slate-900 font-mono">/test_connection</strong></span>
              </span>
              <p className="text-xs text-slate-600">
                Presiona el botón para escribir un documento con metadatos y timestamp en tiempo real.
              </p>
            </div>

            <button
              onClick={handleRunTest}
              disabled={isRunning}
              id="btn-test-firebase-run"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>ESCRIBIENDO EN FIRESTORE...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>TEST FIREBASE</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div
              id="test-firebase-result-card"
              className={`rounded-2xl p-5 border shadow-md transition-all animate-in fade-in zoom-in-95 duration-200 ${
                result.success
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      result.success
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    }`}
                  >
                    {result.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">
                      {result.success ? '¡Operación Exitosa en Cloud Firestore!' : 'Error al Operar en Firestore'}
                    </h3>
                    <p className="text-xs opacity-90 font-medium">
                      {result.success
                        ? 'El documento se escribió y confirmó correctamente en la colección "test_connection".'
                        : 'No se pudo completar la escritura en la base de datos.'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg border shrink-0 ${
                    result.success
                      ? 'bg-emerald-200/60 border-emerald-300 text-emerald-900'
                      : 'bg-rose-200/60 border-rose-300 text-rose-900'
                  }`}
                >
                  {result.latencyMs} ms
                </span>
              </div>

              {/* Status Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-4">
                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Colección</span>
                  <span className="font-mono font-bold text-slate-900">{result.collectionName}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">ID del Documento</span>
                  <span className="font-mono font-bold text-slate-900 truncate block">{result.documentId}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Timestamp</span>
                  <span className="font-mono text-slate-800">{new Date(result.timestamp).toLocaleString()}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Verificación de Lectura</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{result.readBackConfirmed ? 'Confirmado en vivo (Lectura OK)' : 'Pendiente'}</span>
                  </span>
                </div>
              </div>

              {/* Error Details if any */}
              {result.error && (
                <div className="p-3 bg-rose-100/90 border border-rose-300 rounded-xl text-rose-900 text-xs font-mono mb-4 break-all">
                  <strong>Detalle del Error:</strong> {result.error}
                </div>
              )}

              {/* JSON Payload Preview */}
              {result.dataWritten && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center space-x-1">
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>Documento JSON escrito en Firestore</span>
                    </span>
                    <button
                      onClick={handleCopyJSON}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-slate-700 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 shadow-inner border border-slate-800">
                    {JSON.stringify(result.dataWritten, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Recent Test History */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Documentos recientes en <code className="text-amber-700">test_connection</code></span>
              </span>
              <button
                onClick={loadHistory}
                disabled={loadingHistory}
                className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingHistory ? 'animate-spin' : ''}`} />
                <span>Actualizar historial</span>
              </button>
            </div>

            {recentTests.length > 0 ? (
              <div className="space-y-2">
                {recentTests.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-slate-900 truncate text-[11px]">
                          {t.id}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {t.message || 'Prueba exitosa'} · {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                      {t.status || 'OK'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No hay pruebas previas registradas. Pulsa <strong>TEST FIREBASE</strong> para crear el primer documento.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
            <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>Firestore: <strong>{isFirestoreConnected ? 'Conectado' : 'Conectando'}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar Nueva Prueba'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
