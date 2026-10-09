import React, { useState } from 'react';
import {
  Settings,
  Database,
  Building2,
  X,
  Save,
  CheckCircle2,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Cloud,
  RefreshCw,
  Download,
  Upload,
  Radio,
  FileCheck,
  Users,
  Package,
  Truck,
  AlertTriangle,
  Camera,
  Calendar,
  Zap
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { ProjectInfo } from '../types';

export const ProjectSettingsModal: React.FC = () => {
  const {
    project,
    updateProjectInfo,
    activeModal,
    setActiveModal,
    resetToDefaults,
    exportBackupJSON,
    importBackupJSON,
    isSupabaseConnected,
    isSyncing,
    lastSyncTime,
    syncDataToSupabase,
    partidas,
    dailyReports,
    personnel,
    materials,
    equipment,
    incidents,
    photos,
    foundationScheduleTasks,
    foundationMilestones
  } = useConstruction();

  const [activeTab, setActiveTab] = useState<'project' | 'database'>('database');
  const [formData, setFormData] = useState<ProjectInfo>({ ...project });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (activeModal !== 'project-settings') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  const handleManualSync = async () => {
    setSyncSuccess(false);
    await syncDataToSupabase();
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackupJSON(content);
        if (ok) {
          alert('¡Respaldo importado y sincronizado con éxito!');
        } else {
          alert('Error al leer el archivo JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Database className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Configuración de Obra & Base de Datos Supabase</h2>
              <p className="text-[11px] text-slate-400">PostgreSQL en tiempo real con Supabase</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'border-emerald-500 text-emerald-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase (PostgreSQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'project'
                ? 'border-emerald-500 text-emerald-600 font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Datos Contractuales de Obra</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs">
          {activeTab === 'database' ? (
            <div className="space-y-6">
              {/* Supabase Status Card */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 text-white border border-emerald-900/60 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span className={`text-xs font-extrabold uppercase tracking-wider ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isSupabaseConnected ? 'Supabase Conectado & Operativo' : 'Supabase Configuración Pendiente'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Motor PostgreSQL Supabase
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Tus obras, partidas, reportes diarios, personal, materiales, equipos e incidencias se sincronizan con las tablas relacionales de Supabase.
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModal('test-supabase')}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-black text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                        title="Probar y configurar conexión a Supabase"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>TEST SUPABASE</span>
                      </button>

                      <button
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 border border-slate-700"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                      </button>
                    </div>
                    {lastSyncTime && (
                      <span className="text-[10px] text-slate-400">
                        Última sync: {lastSyncTime.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                {syncSuccess && (
                  <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tablas sincronizadas y confirmadas en Supabase.</span>
                  </div>
                )}
              </div>

              {/* Collections Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Tablas Activas en Supabase</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">projects</div>
                      <div className="text-[11px] text-slate-500">1 Obra Activa</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">partidas</div>
                      <div className="text-[11px] text-slate-500">{partidas.length} Partidas y Metrados</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">daily_reports</div>
                      <div className="text-[11px] text-slate-500">{dailyReports.length} Reportes Diarios</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">workers</div>
                      <div className="text-[11px] text-slate-500">{personnel.length} Trabajadores</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">materials</div>
                      <div className="text-[11px] text-slate-500">{materials.length} Materiales e Insumos</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">equipment</div>
                      <div className="text-[11px] text-slate-500">{equipment.length} Maquinarias y Equipos</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">incidents</div>
                      <div className="text-[11px] text-slate-500">{incidents.length} Incidencias</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">photo_evidence</div>
                      <div className="text-[11px] text-slate-500">{photos.length} Fotos de Campo</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">foundation_schedule</div>
                      <div className="text-[11px] text-slate-500">{foundationScheduleTasks.length} Partidas Cronograma</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveModal('test-supabase')}
                    className="bg-emerald-50/80 border border-emerald-300/80 rounded-xl p-3 flex items-center space-x-3 cursor-pointer hover:bg-emerald-100/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4 fill-slate-950" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-950 truncate flex items-center space-x-1">
                        <span>test_connection</span>
                        <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">PROBAR</span>
                      </div>
                      <div className="text-[11px] text-emerald-700">Verificar Conexión en Vivo</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup and Local JSON Tools */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block text-xs">
                  Copia de Seguridad y Migración JSON
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={exportBackupJSON}
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Descargar Respaldo JSON</span>
                  </button>

                  <label className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Restaurar Respaldo JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (window.confirm('¿Deseas restablecer los datos de demostración iniciales en Firestore?')) {
                        resetToDefaults();
                      }
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors ml-auto cursor-pointer"
                  >
                    Restablecer Datos Iniciales
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nombre de la Obra *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código de Obra *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ubicación / Ciudad</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente / Entidad Propietaria</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa Contratista</label>
                  <input
                    type="text"
                    value={formData.contratista}
                    onChange={(e) => setFormData({ ...formData, contratista: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supervisión / Inspector</label>
                  <input
                    type="text"
                    value={formData.supervisor}
                    onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ingeniero Residente</label>
                  <input
                    type="text"
                    value={formData.residente}
                    onChange={(e) => setFormData({ ...formData, residente: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Fin Estimada</label>
                  <input
                    type="date"
                    value={formData.fechaFinEstimada}
                    onChange={(e) => setFormData({ ...formData, fechaFinEstimada: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Frentes de trabajo */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Frentes de Trabajo Activos (Separados por coma)
                </label>
                <input
                  type="text"
                  value={formData.frentesTrabajo.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    frentesTrabajo: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center space-x-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Datos de la obra actualizados y guardados en Cloud Firestore.</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros en Firestore</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
