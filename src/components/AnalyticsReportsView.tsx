import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Layers,
  MapPin,
  User,
  Download,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Boxes,
  Truck,
  AlertOctagon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useConstruction } from '../context/ConstructionContext';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export const AnalyticsReportsView: React.FC = () => {
  const {
    dailyReports,
    partidas,
    personnel,
    materials,
    equipment,
    incidents,
    project,
    overallProgress
  } = useConstruction();

  const [filterStartDate, setFilterStartDate] = useState('2026-08-01');
  const [filterEndDate, setFilterEndDate] = useState('2026-08-31');
  const [filterPartida, setFilterPartida] = useState('ALL');
  const [filterFrente, setFilterFrente] = useState('ALL');
  const [filterResponsable, setFilterResponsable] = useState('ALL');

  // Extract unique responsables
  const responsables = useMemo(() => {
    const set = new Set<string>();
    dailyReports.forEach(r => {
      if (r.responsable) set.add(r.responsable);
    });
    return Array.from(set);
  }, [dailyReports]);

  // Filtered reports dataset
  const filteredReports = useMemo(() => {
    return dailyReports.filter(r => {
      if (r.fecha < filterStartDate || r.fecha > filterEndDate) return false;
      if (filterPartida !== 'ALL' && r.partidaId !== filterPartida && r.partidaCodigo !== filterPartida) return false;
      if (filterFrente !== 'ALL' && r.frente !== filterFrente) return false;
      if (filterResponsable !== 'ALL' && r.responsable !== filterResponsable) return false;
      return true;
    });
  }, [dailyReports, filterStartDate, filterEndDate, filterPartida, filterFrente, filterResponsable]);

  // Metrados by Partida for Bar Chart
  const metradosChartData = useMemo(() => {
    return partidas.map(p => ({
      codigo: p.codigo,
      nombre: p.descripcion.length > 20 ? p.descripcion.substring(0, 20) + '...' : p.descripcion,
      contractual: p.metradoContractual,
      acumulado: p.metradoAcumulado,
      porcentaje: p.porcentajeAvance
    }));
  }, [partidas]);

  // Daily Metrados trend within range
  const dailyTrendData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReports.forEach(r => {
      map[r.fecha] = (map[r.fecha] || 0) + (r.metradoEjecutado || 0);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, metrado]) => ({
        fecha,
        metrado
      }));
  }, [filteredReports]);

  // Personnel by Specialty for Pie Chart
  const specialtyPieData = useMemo(() => {
    const map: Record<string, number> = {};
    personnel.forEach(p => {
      map[p.especialidad] = (map[p.especialidad] || 0) + (p.horasTrabajadas || 8);
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [personnel]);

  // Export filtered data to CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Código Partida', 'Descripción', 'Frente', 'Metrado Ejecutado', 'Unidad', 'Trabajadores', 'Responsable', 'Observaciones'];
    const rows = filteredReports.map(r => [
      r.fecha,
      `"${r.partidaCodigo}"`,
      `"${r.partidaDescripcion?.replace(/"/g, '""')}"`,
      `"${r.frente}"`,
      r.metradoEjecutado,
      r.unidad,
      r.numTrabajadores,
      `"${r.responsable}"`,
      `"${r.observaciones?.replace(/"/g, '""') || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Avance_${project.codigo}_${filterStartDate}_a_${filterEndDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Módulo 9: Analítica, Métricas & Informes Consolidados</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Reportes y Curvas de Avance Físico
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filtra información histórica por fechas, frentes de trabajo, partidas y cuadrillas.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Exportar a CSV / Excel</span>
        </button>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Filtros de Consulta Multicriterio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Frente */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Frente de Trabajo
            </label>
            <select
              value={filterFrente}
              onChange={(e) => setFilterFrente(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">Todos los Frentes</option>
              {project.frentesTrabajo.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Partida */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Partida
            </label>
            <select
              value={filterPartida}
              onChange={(e) => setFilterPartida(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">Todas las Partidas</option>
              {partidas.map(p => (
                <option key={p.id} value={p.id}>{p.codigo} - {p.descripcion.substring(0, 25)}...</option>
              ))}
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Responsable
            </label>
            <select
              value={filterResponsable}
              onChange={(e) => setFilterResponsable(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">Todos los Responsables</option>
              {responsables.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress % by Partida */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Porcentaje de Avance Acumulado por Partida (%)
            </h3>
            <span className="text-xs font-bold text-amber-600">
              {overallProgress}% Total Ponderado
            </span>
          </div>

          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metradosChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="codigo" type="category" tick={{ fontSize: 11, fontWeight: 'bold' }} width={60} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Avance']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="porcentaje" fill="#f59e0b" radius={[0, 4, 4, 0]} name="% Avance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personnel HH by Specialty */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Distribución de Horas Hombre (HH) por Especialidad
            </h3>
            <Users className="w-4 h-4 text-blue-500" />
          </div>

          <div className="h-64 sm:h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name.substring(0, 12)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {specialtyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filtered Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            Resultados Filtrados ({filteredReports.length} reportes diarios)
          </div>
          <div className="text-xs text-slate-500">
            Rango: {filterStartDate} al {filterEndDate}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Partida</th>
                <th className="py-3 px-4">Frente</th>
                <th className="py-3 px-4 text-right">Metrado Ejecutado</th>
                <th className="py-3 px-4 text-center">Trabajadores</th>
                <th className="py-3 px-4">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron reportes diarios con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredReports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.fecha}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-700">{r.partidaCodigo}</span>
                      <span className="text-slate-600 ml-1.5">{r.partidaDescripcion}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.frente}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {r.metradoEjecutado} {r.unidad}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">
                      {r.numTrabajadores}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.responsable}</td>
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
