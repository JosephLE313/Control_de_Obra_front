import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  DollarSign,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { Partida } from '../types';

export const PartidasView: React.FC = () => {
  const {
    partidas,
    deletePartida,
    setActiveModal,
    quickAddMetradoToPartida
  } = useConstruction();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [quickMetradoModal, setQuickMetradoModal] = useState<{ isOpen: boolean; partida: Partida | null; amount: string }>({
    isOpen: false,
    partida: null,
    amount: ''
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    partidas.forEach(p => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [partidas]);

  // Filtered list
  const filteredPartidas = useMemo(() => {
    return partidas.filter(p => {
      if (selectedCategory !== 'ALL' && p.categoria !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchCode = p.codigo.toLowerCase().includes(q);
        const matchDesc = p.descripcion.toLowerCase().includes(q);
        const matchCat = p.categoria?.toLowerCase().includes(q);
        if (!matchCode && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [partidas, selectedCategory, searchTerm]);

  // Statistics
  const totalContractual = useMemo(() => {
    return partidas.reduce((sum, p) => sum + (p.metradoContractual * (p.precioUnitario || 1)), 0);
  }, [partidas]);

  const totalAcumulado = useMemo(() => {
    return partidas.reduce((sum, p) => sum + (Math.min(p.metradoAcumulado, p.metradoContractual) * (p.precioUnitario || 1)), 0);
  }, [partidas]);

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la partida ${code}? Esta acción no se puede deshacer.`)) {
      deletePartida(id);
    }
  };

  const handleQuickMetradoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMetradoModal.partida) return;
    const val = parseFloat(quickMetradoModal.amount);
    if (isNaN(val) || val <= 0) {
      alert('Por favor ingrese un metrado válido mayor a 0');
      return;
    }
    quickAddMetradoToPartida(quickMetradoModal.partida.id, val);
    setQuickMetradoModal({ isOpen: false, partida: null, amount: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Módulo de Partidas & Presupuesto</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Catálogo de Partidas y Control de Metrados
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo automático de porcentaje de avance: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">% = (Acumulado / Contractual) × 100</code>
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-partida')}
          className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Partida</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. 02.01.02) o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="ALL">Todas las Categorías ({partidas.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Partidas Table / Responsive Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4 min-w-[220px]">Descripción de la Partida</th>
                <th className="py-3.5 px-3 text-center">Unidad</th>
                <th className="py-3.5 px-3 text-right">Metrado Contractual</th>
                <th className="py-3.5 px-3 text-right">Metrado Acumulado</th>
                <th className="py-3.5 px-3 text-right">Metrado del Día</th>
                <th className="py-3.5 px-4 min-w-[170px]">Porcentaje de Avance</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPartidas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron partidas con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredPartidas.map((p) => {
                  const pct = Math.min(100, Math.round(((p.metradoAcumulado || 0) / (p.metradoContractual || 1)) * 10000) / 100);
                  const isCompleted = pct >= 100;
                  const isStarted = pct > 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-900 px-2 py-1 rounded transition-colors">
                          {p.codigo}
                        </span>
                      </td>

                      {/* Description & Category */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 leading-snug">
                          {p.descripcion}
                        </p>
                        {p.categoria && (
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            {p.categoria}
                          </span>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                          {p.unidad}
                        </span>
                      </td>

                      {/* Contractual Metrado */}
                      <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                        {p.metradoContractual.toLocaleString()}
                      </td>

                      {/* Accumulated Metrado */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                        {p.metradoAcumulado.toLocaleString()}
                      </td>

                      {/* Day Metrado */}
                      <td className="py-3.5 px-3 text-right">
                        {p.metradoDia > 0 ? (
                          <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                            +{p.metradoDia.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Progress % Bar */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-bold ${
                              isCompleted ? 'text-emerald-700' : isStarted ? 'text-amber-700' : 'text-slate-400'
                            }`}>
                              {pct}%
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isCompleted ? 'Completado' : isStarted ? 'En curso' : 'Sin iniciar'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setQuickMetradoModal({ isOpen: true, partida: p, amount: '' })}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Ingreso rápido de metrado ejecutado"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveModal('new-partida', p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Editar partida"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.codigo)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar partida"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Metrado Modal */}
      {quickMetradoModal.isOpen && quickMetradoModal.partida && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Avance Rápido de Campo</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {quickMetradoModal.partida.codigo} - {quickMetradoModal.partida.descripcion}
            </h3>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Metrado Contractual:</span>
                <span className="font-bold">{quickMetradoModal.partida.metradoContractual} {quickMetradoModal.partida.unidad}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Metrado Acumulado Actual:</span>
                <span className="font-bold">{quickMetradoModal.partida.metradoAcumulado} {quickMetradoModal.partida.unidad}</span>
              </div>
            </div>

            <form onSubmit={handleQuickMetradoSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Metrado adicional a sumar ({quickMetradoModal.partida.unidad}):
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  autoFocus
                  placeholder={`Ej. 15.5 ${quickMetradoModal.partida.unidad}`}
                  value={quickMetradoModal.amount}
                  onChange={(e) => setQuickMetradoModal(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickMetradoModal({ isOpen: false, partida: null, amount: '' })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-sm"
                >
                  Guardar Avance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
