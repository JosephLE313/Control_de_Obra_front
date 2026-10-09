import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { EquipmentUsage } from '../types';

export const EquipmentView: React.FC = () => {
  const {
    equipment,
    selectedDate,
    deleteEquipment,
    setActiveModal,
    todayEquipment
  } = useConstruction();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('ALL');
  const [filterDateScope, setFilterDateScope] = useState<'today' | 'all'>('all');

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e => {
      if (filterDateScope === 'today' && e.fecha !== selectedDate) {
        return false;
      }
      if (filterState !== 'ALL' && e.estado !== filterState) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchEq = e.equipo.toLowerCase().includes(q);
        const matchCod = e.codigo.toLowerCase().includes(q);
        const matchOp = e.operador.toLowerCase().includes(q);
        const matchPartida = e.partidaCodigo?.toLowerCase().includes(q) || e.partidaDescripcion?.toLowerCase().includes(q);
        if (!matchEq && !matchCod && !matchOp && !matchPartida) return false;
      }
      return true;
    });
  }, [equipment, selectedDate, filterDateScope, filterState, searchTerm]);

  const totalHoursWorked = useMemo(() => {
    return filteredEquipment.reduce((sum, e) => sum + (e.horasTrabajadas || 0), 0);
  }, [filteredEquipment]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar registro de equipo: ${name}?`)) {
      deleteEquipment(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Módulo 6: Maquinaria y Equipos de Obra</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Control de Maquinaria y Horas Máquina (HM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Seguimiento a horómetros, operadores asignados, operatividad y partidas asociadas.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-equipment')}
          className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Equipo</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por equipo, código (GT-01), operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterDateScope('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterDateScope === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Todos ({equipment.length})
            </button>
            <button
              onClick={() => setFilterDateScope('today')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterDateScope === 'today' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Hoy ({todayEquipment.length})
            </button>
          </div>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Operativo">Operativo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
            <option value="En Espera / Standby">En Espera / Standby</option>
            <option value="Averiado">Averiado</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Equipo / Maquinaria</th>
                <th className="py-3.5 px-3 text-center">Horas Máquina</th>
                <th className="py-3.5 px-4">Operador Responsable</th>
                <th className="py-3.5 px-4">Partida Asociada</th>
                <th className="py-3.5 px-3 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron registros de maquinaria o equipos.
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {eq.codigo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {eq.equipo}
                      {eq.observaciones && (
                        <p className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                          {eq.observaciones}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      {eq.horasTrabajadas} HM
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {eq.operador}
                    </td>

                    <td className="py-3.5 px-4">
                      {eq.partidaCodigo ? (
                        <div>
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                            {eq.partidaCodigo}
                          </span>
                          <p className="text-slate-600 text-xs truncate max-w-xs mt-0.5">
                            {eq.partidaDescripcion}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Servicio general de obra</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        eq.estado === 'Operativo'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : eq.estado === 'En Mantenimiento'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : eq.estado === 'Averiado'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {eq.estado}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setActiveModal('new-equipment', eq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Editar equipo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(eq.id, eq.equipo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar equipo"
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
