import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
  BarChart3,
  CalendarCheck2,
  Sparkles,
  Milestone,
  ArrowRight,
  Info
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { ScheduleTask, ScheduleMilestone } from '../types';

export const FoundationScheduleView: React.FC = () => {
  const {
    foundationScheduleTasks,
    foundationMilestones,
    foundationScheduleOverallRealProgress,
    foundationSchedulePlannedProgress,
    updateScheduleTask,
    toggleMilestone,
    resetFoundationSchedule,
    selectedDate
  } = useConstruction();

  const [filterWbs, setFilterWbs] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<ScheduleTask | null>(null);
  const [editProgressValue, setEditProgressValue] = useState<number>(0);

  const deviation = Math.round((foundationScheduleOverallRealProgress - foundationSchedulePlannedProgress) * 10) / 10;
  const isAhead = deviation >= 0;

  // Filter tasks
  const filteredTasks = foundationScheduleTasks.filter(t => {
    if (filterWbs === 'ALL') return true;
    return t.frente === filterWbs;
  });

  const completedCount = foundationScheduleTasks.filter(t => t.estado === 'Completada').length;
  const inProgressCount = foundationScheduleTasks.filter(t => t.estado === 'En Proceso').length;
  const pendingCount = foundationScheduleTasks.filter(t => t.estado === 'No Iniciada').length;

  const handleOpenProgressModal = (task: ScheduleTask) => {
    setSelectedTask(task);
    setEditProgressValue(task.avanceReal);
  };

  const handleSaveProgress = () => {
    if (!selectedTask) return;
    updateScheduleTask(selectedTask.id, {
      avanceReal: editProgressValue
    });
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
              Fase 01 - Estructuras Subterráneas
            </span>
            <span className="text-xs text-slate-300 font-mono flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Fecha de Control: {selectedDate}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400 shrink-0" />
            <span>Cronograma de Obras: Etapa de Cimentación</span>
          </h1>

          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Programación valorada, ruta crítica (CPM), seguimiento de curvas de avance (Programado vs. Real) e hitos de liberación técnica para excavaciones, zapatas, vigas y muros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => resetFoundationSchedule()}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Cronograma</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Avance Real Cimentación</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {foundationScheduleOverallRealProgress}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${foundationScheduleOverallRealProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Avance Programado</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-700 mt-2">
            {foundationSchedulePlannedProgress}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Meta a la fecha según contrato</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Desviación (Curva S)</span>
            <AlertTriangle className={`w-4 h-4 ${isAhead ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black mt-2 ${isAhead ? 'text-emerald-600' : 'text-rose-600'}`}>
            {deviation > 0 ? `+${deviation}%` : `${deviation}%`}
          </div>
          <p className={`text-[11px] font-semibold mt-2 ${isAhead ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isAhead ? 'Ritmo adelantado respecto a meta' : 'Presenta desfase; acelerar cuadrillas'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Estado de Partidas</span>
            <CalendarCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
            <span className="text-xs text-slate-400">hechas /</span>
            <span className="text-lg font-bold text-amber-600">{inProgressCount}</span>
            <span className="text-xs text-slate-400">activas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{pendingCount} partidas pendientes de inicio</p>
        </div>
      </div>

      {/* SECTION: Key Milestones of Foundation Stage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Milestone className="w-4 h-4 text-amber-600" />
              <span>Hitos Técnicos de Liberación y Calidad (Check de Cumplimiento)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Protocolos obligatorios antes de continuar con los vaciados de concreto y rellenos.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {foundationMilestones.filter(m => m.completado).length} de {foundationMilestones.length} Aprobados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {foundationMilestones.map((m) => (
            <div
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                m.completado
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      {m.fechaProgramada}
                    </span>
                    {m.completado && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Liberado
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {m.titulo}
                  </h3>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                  m.completado
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-300 bg-white text-transparent hover:border-slate-400'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                {m.descripcion}
              </p>

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span>Resp: {m.responsable}</span>
                {m.fechaReal && <span className="font-semibold text-emerald-700">OK: {m.fechaReal}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Gantt & Task Master List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Subheader and Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Programación Detallada de Actividades de Cimentación</span>
            </h2>
            <p className="text-xs text-slate-500">
              Haga clic en "Actualizar Avance" para registrar porcentaje real y fecha de ejecución de cada partida.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Frente:</span>
            <select
              value={filterWbs}
              onChange={(e) => setFilterWbs(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="ALL">Todos los Frentes</option>
              <option value="Frente 01 - Excavaciones y Zapatas">Frente 01 - Excavaciones y Zapatas</option>
              <option value="Frente 02 - Muros de Contención">Frente 02 - Muros de Contención</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ítem / Actividad</th>
                <th className="py-3 px-3">Fechas Prog.</th>
                <th className="py-3 px-2 text-center">Duración</th>
                <th className="py-3 px-3">Metrado Total</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 min-w-[200px]">Progreso Real vs Programado</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => {
                const isCrit = task.rutaCritica;
                const isFinished = task.avanceReal >= 100;
                const diff = task.avanceReal - task.avanceProgramado;

                return (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Activity title */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {task.wbs}
                          </span>
                          {isCrit && (
                            <span className="text-[9px] font-extrabold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded uppercase">
                              Ruta Crítica
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {task.nombre}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Resp: {task.responsable} • Cuadrilla: {task.cuadrilla}
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-[11px]">
                      <div className="font-mono text-slate-700">{task.fechaInicioProg}</div>
                      <div className="font-mono text-slate-400">al {task.fechaFinProg}</div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-800">{task.duracionDias}</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">días</span>
                    </td>

                    {/* Metrado */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {task.metradoTotal ? (
                        <div>
                          <span className="font-bold text-slate-800">{task.metradoTotal}</span>{' '}
                          <span className="text-slate-500">{task.unidad}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Global</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          task.estado === 'Completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.estado === 'En Proceso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.estado}
                      </span>
                    </td>

                    {/* Progress Bars */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">Real: {task.avanceReal}%</span>
                          <span className="text-slate-400">Prog: {task.avanceProgramado}%</span>
                        </div>

                        {/* Dual bar: Blue is real, Amber/Gray is programmed */}
                        <div className="relative w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-slate-300 opacity-50"
                            style={{ width: `${task.avanceProgramado}%` }}
                            title={`Programado: ${task.avanceProgramado}%`}
                          />
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isFinished
                                ? 'bg-emerald-500'
                                : diff < 0
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${task.avanceReal}%` }}
                            title={`Real: ${task.avanceReal}%`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenProgressModal(task)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>Actualizar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Edit Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedTask.wbs}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Actualizar Avance de Partida
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTask.nombre}
                </p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Avance Programado:</span>
                <span className="font-bold text-slate-800">{selectedTask.avanceProgramado}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Responsable / Cuadrilla:</span>
                <span className="font-bold text-slate-800">{selectedTask.cuadrilla}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Porcentaje de Avance Físico Real:</span>
                <span className="text-blue-600 font-extrabold text-sm">{editProgressValue}%</span>
              </label>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={editProgressValue}
                onChange={(e) => setEditProgressValue(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (No iniciada)</span>
                <span>50% (En proceso)</span>
                <span>100% (Completada)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-all"
              >
                Guardar Progreso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
