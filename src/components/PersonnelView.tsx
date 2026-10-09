import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Briefcase,
  HardHat,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { WorkerPersonnel, WorkerRole, WorkerSpecialty } from '../types';

export const PersonnelView: React.FC = () => {
  const {
    personnel,
    selectedDate,
    deleteWorker,
    setActiveModal,
    todayTotalHours,
    todayWorkersCount
  } = useConstruction();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('ALL');
  const [filterDateScope, setFilterDateScope] = useState<'today' | 'all'>('today');

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(p => {
      if (filterDateScope === 'today' && p.fecha !== selectedDate) {
        return false;
      }
      if (filterSpecialty !== 'ALL' && p.especialidad !== filterSpecialty) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchName = p.nombre.toLowerCase().includes(q);
        const matchCargo = p.cargo.toLowerCase().includes(q);
        const matchEsp = p.especialidad.toLowerCase().includes(q);
        const matchFrente = p.frente.toLowerCase().includes(q);
        if (!matchName && !matchCargo && !matchEsp && !matchFrente) return false;
      }
      return true;
    });
  }, [personnel, selectedDate, filterDateScope, filterSpecialty, searchTerm]);

  // Breakdown by cargo/role
  const rolesDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    personnel.filter(p => p.fecha === selectedDate && p.estado === 'Presente').forEach(p => {
      map[p.cargo] = (map[p.cargo] || 0) + 1;
    });
    return Object.entries(map);
  }, [personnel, selectedDate]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar registro de asistencia para ${name}?`)) {
      deleteWorker(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Módulo 4: Control de Mano de Obra y Cuadrillas</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Personal en Obra y Horas Hombre (HH)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de asistencia, asignación a frentes de trabajo y especialidades en construcción civil.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-worker')}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trabajador</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Trabajadores en Obra Hoy</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{todayWorkersCount} personas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HardHat className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Horas Hombre Jornada</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{todayTotalHours} HH</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Especialidades Activas</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{rolesDistribution.length} cargos</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, cargo, frente o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterDateScope('today')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterDateScope === 'today' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Hoy ({selectedDate})
            </button>
            <button
              onClick={() => setFilterDateScope('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterDateScope === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Todos los registros ({personnel.length})
            </button>
          </div>

          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Todas las Especialidades</option>
            <option value="Estructuras / Encofrado">Estructuras / Encofrado</option>
            <option value="Fierrería / Armado">Fierrería / Armado</option>
            <option value="Concreto / Vaciado">Concreto / Vaciado</option>
            <option value="Albañilería">Albañilería</option>
            <option value="Instalaciones Sanitarias">Instalaciones Sanitarias</option>
            <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
            <option value="Movimiento de Tierras">Movimiento de Tierras</option>
            <option value="Seguridad y Salud (SST)">Seguridad y Salud (SST)</option>
          </select>
        </div>
      </div>

      {/* Personnel Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Trabajador</th>
                <th className="py-3.5 px-4">Cargo</th>
                <th className="py-3.5 px-4">Especialidad</th>
                <th className="py-3.5 px-4">Frente de Trabajo</th>
                <th className="py-3.5 px-3 text-center">Horas</th>
                <th className="py-3.5 px-3 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No hay trabajadores registrados con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredPersonnel.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{worker.nombre}</div>
                      {worker.dni && <div className="text-[10px] text-slate-400">DNI: {worker.dni}</div>}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {worker.cargo}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {worker.especialidad}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-xs truncate max-w-[200px]" title={worker.frente}>
                      {worker.frente}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      {worker.horasTrabajadas} hrs
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        worker.estado === 'Presente' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {worker.estado}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setActiveModal('new-worker', worker)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar trabajador"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(worker.id, worker.nombre)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
