import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  CheckCheck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  PenLine,
  Check,
  Calendar,
  Layers,
  HardHat
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { FoundationActivity, FoundationActivityCheck } from '../types';

export const FoundationChecklist: React.FC = () => {
  const {
    foundationActivities,
    currentDayFoundationChecks,
    currentDayFoundationCheckedCount,
    currentDayFoundationTotalCount,
    currentDayFoundationPercentage,
    selectedDate,
    toggleFoundationActivity,
    updateFoundationActivityDetails,
    batchSetFoundationActivities,
    resetFoundationDay,
    setActiveModal,
    project
  } = useConstruction();

  const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'pending'>('all');
  const [filterPhase, setFilterPhase] = useState<string>('ALL');
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Edit notes modal state
  const [editingActivity, setEditingActivity] = useState<FoundationActivity | null>(null);
  const [editMetrado, setEditMetrado] = useState<number | ''>('');
  const [editUnidad, setEditUnidad] = useState<string>('');
  const [editObservacion, setEditObservacion] = useState<string>('');
  const [editResponsable, setEditResponsable] = useState<string>('');

  const phases = useMemo(() => {
    const set = new Set<string>();
    foundationActivities.forEach(a => set.add(a.fase));
    return Array.from(set);
  }, [foundationActivities]);

  const filteredActivities = useMemo(() => {
    return foundationActivities.filter(activity => {
      const isDone = Boolean(currentDayFoundationChecks[activity.id]?.hecho);

      // Status filter
      if (filterStatus === 'done' && !isDone) return false;
      if (filterStatus === 'pending' && isDone) return false;

      // Phase filter
      if (filterPhase !== 'ALL' && activity.fase !== filterPhase) return false;

      return true;
    });
  }, [foundationActivities, currentDayFoundationChecks, filterStatus, filterPhase]);

  const pendingCount = currentDayFoundationTotalCount - currentDayFoundationCheckedCount;

  // Handle opening quick edit for details
  const openEditDetails = (activity: FoundationActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentCheck = currentDayFoundationChecks[activity.id];
    setEditingActivity(activity);
    setEditMetrado(currentCheck?.metradoEjecutado ?? activity.metradoEstimado ?? '');
    setEditUnidad(currentCheck?.unidad ?? activity.unidadSugerida ?? 'm2');
    setEditObservacion(currentCheck?.observaciones ?? '');
    setEditResponsable(currentCheck?.responsable ?? 'Ing. Residente / Maestro de Obra');
  };

  const saveEditDetails = () => {
    if (!editingActivity) return;
    updateFoundationActivityDetails(editingActivity.id, {
      metradoEjecutado: editMetrado === '' ? undefined : Number(editMetrado),
      unidad: editUnidad,
      observaciones: editObservacion,
      responsable: editResponsable,
      hecho: true
    });
    setEditingActivity(null);
  };

  // Convert an activity into a full Daily Report modal prefill
  const handleConvertToDailyReport = (activity: FoundationActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    const check = currentDayFoundationChecks[activity.id];
    setActiveModal('new-daily-report', {
      fecha: selectedDate,
      frente: 'Frente 01 - Cimentaciones y Muros de Contención',
      partidaCodigo: activity.partidaCodigoSugerida || '01.02.04',
      partidaDescripcion: activity.titulo,
      descripcionActividad: `${activity.titulo}.\n${activity.descripcion}\nObservaciones de campo: ${check?.observaciones || 'Actividad ejecutada en cimentación según especificaciones técnicas.'}`,
      metradoEjecutado: check?.metradoEjecutado || activity.metradoEstimado || 1,
      unidad: check?.unidad || activity.unidadSugerida || 'und',
      responsable: check?.responsable || 'Ing. Roberto Huamán (Residente)',
      observaciones: `Actividad verificada en checklist de cimentación [${activity.codigo}]. ${activity.normaCalidad ? `Norma: ${activity.normaCalidad}` : ''}`
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all mb-6">
      {/* Header Container */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-md shadow-amber-500/20 shrink-0 mt-0.5">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                Control de Calidad & Cuaderno de Campo
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Fecha: <strong className="text-white ml-1">{selectedDate}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>Actividades Diarias — Etapa de Cimentación</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Lista de verificación interactiva para marcar con <strong className="text-amber-400">check</strong> las actividades realizadas hoy en zapatas, vigas de cimentación, solados, armaduras y vaciados.
            </p>
          </div>
        </div>

        {/* Progress and quick stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 px-4 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-slate-400 font-medium">Completadas</div>
              <div className="text-lg font-extrabold text-emerald-400">
                {currentDayFoundationCheckedCount} <span className="text-xs text-slate-400 font-normal">/ {currentDayFoundationTotalCount}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="text-center">
              <div className="text-xs text-slate-400 font-medium">Cumplimiento</div>
              <div className="text-lg font-extrabold text-amber-400">
                {currentDayFoundationPercentage}%
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="self-end sm:self-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isCollapsed ? 'Expandir checklist' : 'Minimizar checklist'}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 h-2">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            currentDayFoundationPercentage === 100
              ? 'bg-emerald-500'
              : currentDayFoundationPercentage > 50
              ? 'bg-amber-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${currentDayFoundationPercentage}%` }}
        />
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Controls, Filters & Batch actions toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({currentDayFoundationTotalCount})
              </button>
              <button
                onClick={() => setFilterStatus('done')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  filterStatus === 'done'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hechas ({currentDayFoundationCheckedCount})</span>
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  filterStatus === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pendientes ({pendingCount})</span>
              </button>
            </div>

            {/* Phase Selector & Batch Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="ALL">Todas las Fases de Cimentación</option>
                {phases.map(phase => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>

              <button
                onClick={() => batchSetFoundationActivities(filteredActivities.map(a => a.id), true)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                title="Marcar visibles como hechas"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Marcar visibles</span>
              </button>

              <button
                onClick={() => batchSetFoundationActivities(filteredActivities.map(a => a.id), false)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                title="Desmarcar visibles"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Desmarcar</span>
              </button>
            </div>
          </div>

          {/* Activity Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredActivities.map((activity) => {
              const check = currentDayFoundationChecks[activity.id];
              const isDone = Boolean(check?.hecho);
              const isExpanded = expandedActivityId === activity.id;

              return (
                <div
                  key={activity.id}
                  onClick={() => toggleFoundationActivity(activity.id)}
                  className={`cursor-pointer group relative rounded-xl border p-4 transition-all duration-150 select-none ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Interactive Large Checkbox */}
                    <div
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-105'
                          : 'bg-slate-100 text-transparent border-2 border-slate-300 group-hover:border-amber-500'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            isDone ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {activity.codigo}
                        </span>

                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {activity.fase}
                        </span>

                        {activity.criticidad === 'Obligatoria' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                            Crítico
                          </span>
                        )}

                        {isDone && check?.horaRegistro && (
                          <span className="text-[10px] font-medium text-emerald-700 ml-auto flex items-center">
                            <Clock className="w-3 h-3 mr-0.5" />
                            {check.horaRegistro}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-xs font-bold leading-snug transition-colors ${
                          isDone ? 'text-emerald-950 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {activity.titulo}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {activity.descripcion}
                      </p>

                      {/* Technical Norma Tag */}
                      {activity.normaCalidad && (
                        <div className="mt-2 text-[10px] text-amber-800 bg-amber-50/70 border border-amber-200/60 rounded px-2 py-0.5 inline-flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{activity.normaCalidad}</span>
                        </div>
                      )}

                      {/* Done Details (Observations & Metrado if recorded) */}
                      {isDone && (check?.observaciones || check?.metradoEjecutado) && (
                        <div className="mt-2.5 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-900 bg-emerald-100/30 p-2 rounded-lg space-y-0.5">
                          {check.metradoEjecutado !== undefined && (
                            <div className="font-semibold flex items-center justify-between">
                              <span>Metrado reportado:</span>
                              <span className="font-mono font-bold bg-emerald-200/60 px-1.5 py-0.2 rounded text-emerald-950">
                                {check.metradoEjecutado} {check.unidad || activity.unidadSugerida}
                              </span>
                            </div>
                          )}
                          {check.observaciones && (
                            <p className="text-emerald-800 text-[10px] italic">
                              "{check.observaciones}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action buttons footer */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => openEditDetails(activity, e)}
                            className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors"
                            title="Agregar metrado u observaciones a esta actividad"
                          >
                            <PenLine className="w-3 h-3" />
                            <span>{isDone ? 'Editar datos' : 'Añadir datos'}</span>
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleConvertToDailyReport(activity, e)}
                          className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 px-2.5 py-1 rounded-lg transition-colors"
                          title="Crear un reporte oficial en el cuaderno de obra para esta actividad"
                        >
                          <Plus className="w-3 h-3 text-amber-600" />
                          <span>Crear Reporte</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state inside filtered list */}
          {filteredActivities.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-2">
              <HelpCircle className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">
                No hay actividades de cimentación que coincidan con los filtros seleccionados.
              </p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPhase('ALL');
                }}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}

          {/* Quick Info & Good Practice Footer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <HardHat className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Criterio Técnico:</strong> Las actividades marcadas como obligatorias deben contar con firma de liberación en el protocolo antes del vaciado de concreto.
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  if (window.confirm(`¿Deseas reiniciar todas las actividades marcadas para la fecha ${selectedDate}?`)) {
                    resetFoundationDay(selectedDate);
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar este día</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Details Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-extrabold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                  {editingActivity.codigo}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {editingActivity.titulo}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Metrado Ejecutado
                  </label>
                  <input
                    type="number"
                    value={editMetrado}
                    onChange={(e) => setEditMetrado(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej. 25.5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Unidad de Medida
                  </label>
                  <input
                    type="text"
                    value={editUnidad}
                    onChange={(e) => setEditUnidad(e.target.value)}
                    placeholder="m2, m3, kg, und"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Responsable / Maestro de Obra
                </label>
                <input
                  type="text"
                  value={editResponsable}
                  onChange={(e) => setEditResponsable(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Observaciones de Campo / Ubicación
                </label>
                <textarea
                  rows={3}
                  value={editObservacion}
                  onChange={(e) => setEditObservacion(e.target.value)}
                  placeholder="Ej: Se completó el solado en zapatas Z-1 a Z-4 del eje A-C..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveEditDetails}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
              >
                Guardar y Marcar Hecho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
