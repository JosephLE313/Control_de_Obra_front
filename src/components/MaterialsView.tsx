import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  FileCheck,
  PackageCheck
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { MaterialUsage } from '../types';

export const MaterialsView: React.FC = () => {
  const {
    materials,
    selectedDate,
    deleteMaterial,
    setActiveModal,
    todayMaterials
  } = useConstruction();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateScope, setFilterDateScope] = useState<'today' | 'all'>('all');

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      if (filterDateScope === 'today' && m.fecha !== selectedDate) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchMat = m.material.toLowerCase().includes(q);
        const matchPartida = m.partidaCodigo?.toLowerCase().includes(q) || m.partidaDescripcion?.toLowerCase().includes(q);
        const matchGuia = m.guiaRemision?.toLowerCase().includes(q);
        if (!matchMat && !matchPartida && !matchGuia) return false;
      }
      return true;
    });
  }, [materials, selectedDate, filterDateScope, searchTerm]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar registro de consumo de material: ${name}?`)) {
      deleteMaterial(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Módulo 5: Control de Insumos & Almacén de Obra</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Consumo de Materiales por Partida
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de cantidades utilizadas, guías de remisión y vinculación directa a partidas de obra.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-material')}
          className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Material</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por material, partida o guía de remisión..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setFilterDateScope('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterDateScope === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Todos los registros ({materials.length})
          </button>
          <button
            onClick={() => setFilterDateScope('today')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterDateScope === 'today' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Hoy ({todayMaterials.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Material / Insumo</th>
                <th className="py-3.5 px-3 text-right">Cantidad Utilizada</th>
                <th className="py-3.5 px-3 text-center">Unidad</th>
                <th className="py-3.5 px-4">Partida Asociada</th>
                <th className="py-3.5 px-3 text-center">Fecha</th>
                <th className="py-3.5 px-4">Guía / Observaciones</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No hay registros de materiales que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.material}</div>
                      {m.stockDisponible !== undefined && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Stock en almacén: {m.stockDisponible} {m.unidad}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900 text-sm">
                      {m.cantidadUtilizada.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                        {m.unidad}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {m.partidaCodigo ? (
                        <div>
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                            {m.partidaCodigo}
                          </span>
                          <p className="text-slate-700 font-medium truncate max-w-xs mt-0.5">
                            {m.partidaDescripcion}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Uso general</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                      {m.fecha}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {m.guiaRemision && (
                        <div className="font-semibold text-slate-800">
                          Doc: {m.guiaRemision}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {m.observaciones || '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setActiveModal('new-material', m)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Editar material"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.material)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar material"
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
