import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Camera,
  Users,
  Truck,
  Boxes,
  MapPin,
  CheckCircle2,
  Layers,
  ChevronDown,
  FileText,
  CheckSquare,
  BookOpen
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { DailyReport } from '../types';
import { FoundationChecklist } from './FoundationChecklist';

export const DailyReportView: React.FC = () => {
  const {
    dailyReports,
    selectedDate,
    setSelectedDate,
    deleteDailyReport,
    setActiveModal,
    setOfficialReportDate,
    project,
    currentDayFoundationCheckedCount,
    currentDayFoundationTotalCount
  } = useConstruction();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'checklist' | 'reports'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrente, setFilterFrente] = useState('ALL');
  const [filterDateMode, setFilterDateMode] = useState<'selected' | 'all'>('selected');

  // Filtered reports
  const filteredReports = useMemo(() => {
    return dailyReports.filter(report => {
      // Date filter
      if (filterDateMode === 'selected' && report.fecha !== selectedDate) {
        return false;
      }

      // Frente filter
      if (filterFrente !== 'ALL' && report.frente !== filterFrente) {
        return false;
      }

      // Text search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchCode = report.partidaCodigo?.toLowerCase().includes(query);
        const matchDesc = report.partidaDescripcion?.toLowerCase().includes(query);
        const matchAct = report.descripcionActividad?.toLowerCase().includes(query);
        const matchResp = report.responsable?.toLowerCase().includes(query);
        const matchFrente = report.frente?.toLowerCase().includes(query);
        if (!matchCode && !matchDesc && !matchAct && !matchResp && !matchFrente) {
          return false;
        }
      }

      return true;
    });
  }, [dailyReports, selectedDate, filterDateMode, filterFrente, searchTerm]);

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el reporte diario de la partida ${code}?`)) {
      deleteDailyReport(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" />
            <span>Módulo de Control y Cuaderno de Obra</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Reportes Diarios y Control de Campo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verificación de actividades en etapa de cimentación, metrados ejecutados, cuadrillas de personal, insumos y equipos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setOfficialReportDate(selectedDate);
              setActiveModal('official-report');
            }}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Reporte Oficial</span>
          </button>

          <button
            onClick={() => setActiveModal('new-daily-report')}
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Reporte Diario</span>
          </button>
        </div>
      </div>

      {/* Sub-view switcher tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Vista Completa (Checklist + Reportes)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'checklist'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Checklist Cimentación</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {currentDayFoundationCheckedCount}/{currentDayFoundationTotalCount} hechos
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('reports')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'reports'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Reportes Diarios Detallados ({filteredReports.length})</span>
          </button>
        </div>

        <div className="px-2 text-[11px] font-semibold text-slate-500 hidden sm:block">
          Día activo: <strong className="text-slate-800">{selectedDate}</strong>
        </div>
      </div>

      {/* 1. FOUNDATION ACTIVITIES CHECKLIST COMPONENT */}
      {(activeSubTab === 'all' || activeSubTab === 'checklist') && (
        <FoundationChecklist />
      )}

      {/* 2. DETAILED REPORTS SECTION */}
      {(activeSubTab === 'all' || activeSubTab === 'reports') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Historial de Reportes Diarios Registrados
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filteredReports.length} {filteredReports.length === 1 ? 'reporte' : 'reportes'}
            </span>
          </div>

          {/* Filter and search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por partida, frente, actividad o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Date scope switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setFilterDateMode('selected')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterDateMode === 'selected' ? 'bg-white text-slate-900 shadow-xs font-bold text-amber-600' : 'hover:text-slate-900'
                  }`}
                >
                  Día actual ({selectedDate})
                </button>
                <button
                  onClick={() => setFilterDateMode('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterDateMode === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Todos los días ({dailyReports.length})
                </button>
              </div>

              {/* Frente selector */}
              <select
                value={filterFrente}
                onChange={(e) => setFilterFrente(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="ALL">Todos los Frentes</option>
                {project.frentesTrabajo.map(frente => (
                  <option key={frente} value={frente}>
                    {frente}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No hay reportes diarios para los filtros seleccionados
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {searchTerm || filterFrente !== 'ALL' || filterDateMode === 'selected'
                  ? 'Prueba cambiando la fecha o utiliza el botón "+ Crear Reporte" desde el checklist de cimentación superior.'
                  : 'Aún no has registrado reportes diarios.'}
              </p>
              <button
                onClick={() => setActiveModal('new-daily-report')}
                className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Reporte Diario</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
                >
                  {/* Header of Report Card */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg">
                        {report.partidaCodigo}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {report.partidaDescripcion}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="flex items-center text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {report.fecha}
                      </span>
                      {report.clima && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200/60">
                          🌤 {report.clima}
                        </span>
                      )}
                      <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
                        <button
                          onClick={() => setActiveModal('new-daily-report', report)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Editar reporte"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id, report.partidaCodigo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Frente and Metrado Highlight */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-4 h-4 text-amber-500 mr-1.5 shrink-0" />
                        <span className="font-semibold">{report.frente}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-900 font-bold">
                          Metrado del día: <span className="text-amber-700">{report.metradoEjecutado} {report.unidad}</span>
                        </div>
                        {report.porcentajeAvance > 0 && (
                          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-800 font-bold">
                            Avance acumulado: {report.porcentajeAvance}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Descripción de Actividades Realizadas
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {report.descripcionActividad}
                      </p>
                    </div>

                    {/* Resources Grid (Workers, Equipment, Materials) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      <div>
                        <div className="flex items-center space-x-1.5 text-slate-500 font-bold mb-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Personal ({report.numTrabajadores || 0} obreros)</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Cuadrilla asignada a esta partida
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5 text-slate-500 font-bold mb-1">
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Equipos y Maquinaria</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate" title={report.equiposUtilizados}>
                          {report.equiposUtilizados || 'Herramientas manuales estándar'}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5 text-slate-500 font-bold mb-1">
                          <Boxes className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Materiales e Insumos</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate" title={report.materialesUtilizados}>
                          {report.materialesUtilizados || 'Insumos de habilitado'}
                        </p>
                      </div>
                    </div>

                    {/* Observaciones if any */}
                    {report.observaciones && (
                      <div className="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-amber-900">
                        <span className="font-bold">Observaciones: </span>
                        <span>{report.observaciones}</span>
                      </div>
                    )}

                    {/* Photos thumbnails if any */}
                    {report.fotografias && report.fotografias.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-1 text-xs font-bold text-slate-600 mb-2">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          <span>Evidencias Fotográficas ({report.fotografias.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {report.fotografias.map((url, idx) => (
                            <div
                              key={idx}
                              className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group relative shadow-xs"
                            >
                              <img
                                src={url}
                                alt={`Foto reporte ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Responsable */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Responsable del Registro: <strong className="text-slate-800">{report.responsable}</strong>
                      </span>
                      <span>Turno: <strong>{report.turno || 'Diurno'}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
