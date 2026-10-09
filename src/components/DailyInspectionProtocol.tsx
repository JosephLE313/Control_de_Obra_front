import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertOctagon,
  FileCheck2,
  HardHat,
  Eye,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { DailyInspectionItem, InspectionStatus } from '../types';

export const DailyInspectionProtocol: React.FC = () => {
  const {
    dailyInspectionItems,
    currentDayInspections,
    inspectionsConformeCount,
    inspectionsNoConformeCount,
    inspectionsPendienteCount,
    selectedDate,
    setDailyInspectionStatus,
    updateDailyInspectionObs,
    convertInspectionToIncident,
    resetDailyInspections,
    setActiveModal
  } = useConstruction();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>(null);

  const categories = [
    'ALL',
    'SST & Seguridad',
    'Calidad Estructural',
    'Maquinaria y Equipos',
    'Materiales y Abastecimiento',
    'Condiciones Ambientales'
  ];

  const filteredItems = dailyInspectionItems.filter(item => {
    if (categoryFilter !== 'ALL' && item.categoria !== categoryFilter) {
      return false;
    }
    const currentStatus = currentDayInspections[item.id]?.estado || 'pendiente';
    if (statusFilter !== 'ALL' && currentStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const totalItems = dailyInspectionItems.length;
  const verifiedCount = inspectionsConformeCount + inspectionsNoConformeCount;
  const percentage = Math.round((verifiedCount / (totalItems || 1)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full">
              Protocolo Diario en Obra
            </span>
            <span className="text-xs text-slate-300 font-mono flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Fecha: {selectedDate}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Control de Inspección Diaria, SST y Detección de Incidencias</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verifique con un check el estado de conformidad de cada punto crítico del día. Ingrese observaciones directas abajo de cada ítem para registrar incidencias de campo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              dailyInspectionItems.forEach(item => {
                if (!currentDayInspections[item.id] || currentDayInspections[item.id]?.estado === 'pendiente') {
                  setDailyInspectionStatus(item.id, 'conforme');
                }
              });
            }}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aprobar Restantes</span>
          </button>

          <button
            onClick={() => resetDailyInspections()}
            className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-xl transition-all border border-slate-700"
            title="Reiniciar inspecciones del día"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Día</span>
          </button>
        </div>
      </div>

      {/* Metric Counters & Progress */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Conformes (OK)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700 mt-1">{inspectionsConformeCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Puntos sin riesgo hoy</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Con Incidencia</span>
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-700 mt-1">{inspectionsNoConformeCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Requieren corrección</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Pendientes</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-700 mt-1">{inspectionsPendienteCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Por inspeccionar</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Cumplimiento</span>
              <span className="font-bold text-slate-800">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  inspectionsNoConformeCount > 0
                    ? 'bg-amber-500'
                    : percentage === 100
                    ? 'bg-emerald-500'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{verifiedCount} de {totalItems} verificados</p>
          </div>
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Todas las Categorías' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="conforme">Solo Conformes (OK)</option>
              <option value="no_conforme">Solo con Incidencia</option>
              <option value="pendiente">Solo Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inspection Items List */}
      <div className="divide-y divide-slate-100 p-4 sm:p-5 space-y-4">
        {filteredItems.map((item, idx) => {
          const checkState = currentDayInspections[item.id] || {
            itemId: item.id,
            estado: 'pendiente',
            observaciones: '',
            horaRegistro: undefined
          };

          const isConforme = checkState.estado === 'conforme';
          const isNoConforme = checkState.estado === 'no_conforme';
          const isPendiente = !checkState.estado || checkState.estado === 'pendiente';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all p-4 sm:p-5 ${
                isNoConforme
                  ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-400/30'
                  : isConforme
                  ? 'bg-emerald-50/20 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Item Header and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                      {item.codigo}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.categoria}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.criticidad === 'Crítica'
                          ? 'bg-rose-600 text-white'
                          : item.criticidad === 'Alta'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      Criticidad: {item.criticidad}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                    {idx + 1}. {item.titulo}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Criterio de Aceptación: </span>
                    {item.criterioAceptacion}
                  </p>
                </div>

                {/* State Check Toggle Buttons */}
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start">
                  <button
                    onClick={() => setDailyInspectionStatus(item.id, 'conforme')}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isConforme
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                    title="Marcar como Conforme / Sin Incidencia"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Conforme</span>
                  </button>

                  <button
                    onClick={() => setDailyInspectionStatus(item.id, 'no_conforme')}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isNoConforme
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-rose-600 hover:bg-white/70'
                    }`}
                    title="Marcar con Incidencia / No Conforme"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Incidencia</span>
                  </button>

                  <button
                    onClick={() => setDailyInspectionStatus(item.id, 'pendiente')}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isPendiente
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
                    }`}
                    title="Dejar en Pendiente de Inspección"
                  >
                    <Clock className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Direct Observation Section Underneath each Item */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Observación y Ocurrencia del Día en Obra:</span>
                  </label>
                  {checkState.horaRegistro && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Registrado a las {checkState.horaRegistro}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder={`Escriba la observación de campo para "${item.titulo}"... (ej. Conforme según cota, o detectado desfase de 2cm a corregir)`}
                    value={checkState.observaciones || ''}
                    onChange={(e) => updateDailyInspectionObs(item.id, e.target.value, checkState.accionCorrectiva)}
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                      isNoConforme
                        ? 'bg-rose-50/50 border-rose-300 focus:bg-white focus:ring-rose-500/20 focus:border-rose-500 text-slate-800'
                        : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-amber-500/20 focus:border-amber-500 text-slate-800'
                    }`}
                  />
                </div>

                {/* Additional Action for No Conforme: convert to Incident */}
                {isNoConforme && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-rose-100/70 border border-rose-200 rounded-xl text-xs">
                    <div className="flex items-center space-x-2 text-rose-900">
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-semibold">
                        {checkState.esIncidenciaRegistrada 
                          ? 'Incidencia formal registrada en el Libro de Incidencias.' 
                          : 'Este punto requiere registro formal como Incidencia en obra.'}
                      </span>
                    </div>

                    {!checkState.esIncidenciaRegistrada ? (
                      <button
                        onClick={() => convertInspectionToIncident(item.id)}
                        className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-all shrink-0"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Pasar a Libro de Incidencias</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registrado</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
