import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  MapPin,
  User,
  Check,
  RotateCcw,
  ShieldAlert,
  ClipboardCheck,
  MessageSquare,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { Incident, IncidentStatus, IncidentType } from '../types';
import { DailyInspectionProtocol } from './DailyInspectionProtocol';

export const IncidentsView: React.FC = () => {
  const {
    incidents,
    deleteIncident,
    updateIncident,
    setActiveModal,
    pendingIncidentsCount,
    inProgressIncidentsCount,
    resolvedIncidentsCount,
    selectedDate,
    inspectionsNoConformeCount,
    inspectionsConformeCount
  } = useConstruction();

  const [activeTabMode, setActiveTabMode] = useState<'combined' | 'checklist' | 'log'>('combined');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [editingObsId, setEditingObsId] = useState<string | null>(null);
  const [tempObs, setTempObs] = useState<string>('');

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      if (filterStatus !== 'ALL' && inc.estado !== filterStatus) {
        return false;
      }
      if (filterType !== 'ALL' && inc.tipo !== filterType) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchDesc = inc.descripcion.toLowerCase().includes(q);
        const matchUbi = inc.ubicacion.toLowerCase().includes(q);
        const matchResp = inc.responsable.toLowerCase().includes(q);
        const matchTipo = inc.tipo.toLowerCase().includes(q);
        if (!matchDesc && !matchUbi && !matchResp && !matchTipo) return false;
      }
      return true;
    });
  }, [incidents, filterStatus, filterType, searchTerm]);

  const handleStatusToggle = (inc: Incident) => {
    let nextStatus: IncidentStatus = 'En proceso';
    let fechaSolucion = inc.fechaSolucion;

    if (inc.estado === 'Pendiente') {
      nextStatus = 'En proceso';
    } else if (inc.estado === 'En proceso') {
      nextStatus = 'Resuelto';
      fechaSolucion = new Date().toISOString().split('T')[0];
    } else {
      nextStatus = 'Pendiente';
      fechaSolucion = undefined;
    }

    updateIncident(inc.id, {
      estado: nextStatus,
      fechaSolucion
    });
  };

  const handleDelete = (id: string, desc: string) => {
    if (window.confirm(`¿Eliminar la incidencia registrada?`)) {
      deleteIncident(id);
    }
  };

  const handleSaveObservation = (id: string) => {
    updateIncident(id, {
      observaciones: tempObs
    });
    setEditingObsId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Módulo 7: Libro de Ocurrencias, Calidad & SST</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Registro y Control Diario de Incidencias en Obra
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verificación por check de puntos críticos de control, registro de observaciones diarias e historial de ocurrencias.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveModal('new-incident')}
            className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Incidencia Manual</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-200/80 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTabMode('combined')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTabMode === 'combined'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-amber-500" />
          <span>Vista Integral (Checklist Diario + Libro de Incidencias)</span>
        </button>

        <button
          onClick={() => setActiveTabMode('checklist')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTabMode === 'checklist'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Solo Checklist de Inspección Diaria</span>
          {inspectionsNoConformeCount > 0 && (
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {inspectionsNoConformeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabMode('log')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTabMode === 'log'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-blue-500" />
          <span>Solo Libro de Incidencias ({incidents.length})</span>
        </button>
      </div>

      {/* SECTION 1: Daily Inspection Protocol & Checklist */}
      {(activeTabMode === 'combined' || activeTabMode === 'checklist') && (
        <div className="space-y-4">
          <DailyInspectionProtocol />
        </div>
      )}

      {/* SECTION 2: Official Incident Log */}
      {(activeTabMode === 'combined' || activeTabMode === 'log') && (
        <div className="space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Libro Oficial de Incidencias y Ocurrencias Registradas</span>
              </h2>
              <p className="text-xs text-slate-500">
                Historial de eventos con estado de seguimiento, acciones correctivas y notas de observación.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
              Total: {filteredIncidents.length} registros
            </span>
          </div>

          {/* KPI Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setFilterStatus('Pendiente')}
              className={`p-4 rounded-2xl border transition-all text-left ${
                filterStatus === 'Pendiente'
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Pendientes</span>
                <AlertOctagon className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">{pendingIncidentsCount}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Requieren atención o asignación</p>
            </button>

            <button
              onClick={() => setFilterStatus('En proceso')}
              className={`p-4 rounded-2xl border transition-all text-left ${
                filterStatus === 'En proceso'
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">En Proceso</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">{inProgressIncidentsCount}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Acción correctiva en curso</p>
            </button>

            <button
              onClick={() => setFilterStatus('Resuelto')}
              className={`p-4 rounded-2xl border transition-all text-left ${
                filterStatus === 'Resuelto'
                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resueltas</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2">{resolvedIncidentsCount}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Cerradas satisfactoriamente</p>
            </button>
          </div>

          {/* Filter and Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por descripción, ubicación, tipo o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="ALL">Todos los Estados ({incidents.length})</option>
                <option value="Pendiente">Solo Pendientes</option>
                <option value="En proceso">Solo En Proceso</option>
                <option value="Resuelto">Solo Resueltas</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="ALL">Todos los Tipos</option>
                <option value="Seguridad / SST">Seguridad / SST</option>
                <option value="Calidad / No Conformidad">Calidad / No Conformidad</option>
                <option value="Retraso por Clima">Retraso por Clima</option>
                <option value="Desabastecimiento Material">Desabastecimiento Material</option>
                <option value="Falla de Maquinaria">Falla de Maquinaria</option>
                <option value="Modificación de Proyecto / Plano">Modificación de Proyecto / Plano</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Incidents Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncidents.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No hay incidencias pendientes en este filtro</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Todos los puntos inspeccionados están en orden o no coinciden con el filtro. Puede registrar una nueva incidencia con el botón superior.
                </p>
                <button
                  onClick={() => setActiveModal('new-incident')}
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Registrar Incidencia en Obra</span>
                </button>
              </div>
            ) : (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {inc.tipo}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            inc.severidad === 'Crítica'
                              ? 'bg-rose-600 text-white'
                              : inc.severidad === 'Alta'
                              ? 'bg-rose-100 text-rose-700'
                              : inc.severidad === 'Media'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {inc.severidad}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Fecha: <span className="font-semibold text-slate-600">{inc.fecha}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStatusToggle(inc)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer ${
                          inc.estado === 'Resuelto'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                            : inc.estado === 'En proceso'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-200'
                        }`}
                        title="Click para cambiar estado (Pendiente -> En proceso -> Resuelto)"
                      >
                        <span>{inc.estado}</span>
                        <RotateCcw className="w-3 h-3 ml-1 opacity-60" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {inc.descripcion}
                    </p>

                    {/* Location and Responsible */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center text-slate-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span className="truncate">{inc.ubicacion}</span>
                      </div>
                      <div className="flex items-center text-slate-600 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span className="truncate font-semibold">{inc.responsable}</span>
                      </div>
                    </div>

                    {/* Action Taken / Solution */}
                    {inc.accionTomada && (
                      <div className="text-xs bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-emerald-900">
                        <span className="font-bold">Acción Tomada: </span>
                        <span>{inc.accionTomada}</span>
                      </div>
                    )}

                    {/* Inline Observation Note Below Each Incident */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>Observación de Seguimiento:</span>
                        </span>
                        {editingObsId !== inc.id && (
                          <button
                            onClick={() => {
                              setEditingObsId(inc.id);
                              setTempObs(inc.observaciones || '');
                            }}
                            className="text-[11px] text-amber-600 hover:text-amber-700 font-bold hover:underline"
                          >
                            {inc.observaciones ? 'Editar nota' : '+ Agregar nota'}
                          </button>
                        )}
                      </div>

                      {editingObsId === inc.id ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={tempObs}
                            onChange={(e) => setTempObs(e.target.value)}
                            placeholder="Escriba la observación o medida tomada en campo..."
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500"
                          />
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setEditingObsId(null)}
                              className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 rounded-md"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveObservation(inc.id)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 text-slate-950 rounded-md hover:bg-amber-400"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {inc.observaciones || 'Sin observaciones adicionales registradas.'}
                        </p>
                      )}
                    </div>

                    {/* Photo preview */}
                    {inc.fotografia && (
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <img
                          src={inc.fotografia}
                          alt="Foto de incidencia"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {inc.fechaSolucion ? `Solucionado: ${inc.fechaSolucion}` : 'Estado: Abierto'}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setActiveModal('new-incident', inc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Editar incidencia"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inc.id, inc.descripcion)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Eliminar incidencia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
