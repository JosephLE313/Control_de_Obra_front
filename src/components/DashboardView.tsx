import React, { useMemo } from 'react';
import {
  TrendingUp,
  Users,
  AlertOctagon,
  Layers,
  Calendar,
  Building2,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Compass,
  Briefcase,
  ChevronRight,
  Zap,
  MapPin,
  CheckSquare,
  HardHat,
  User,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useConstruction } from '../context/ConstructionContext';
import { useAuth } from '../context/AuthContext';

export const DashboardView: React.FC = () => {
  const {
    project,
    selectedDate,
    overallProgress,
    todayReports,
    todayWorkersCount,
    todayTotalHours,
    todayIncidents,
    pendingIncidentsCount,
    inProgressIncidentsCount,
    resolvedIncidentsCount,
    partidas,
    dailyReports,
    currentDayFoundationCheckedCount,
    currentDayFoundationTotalCount,
    currentDayFoundationPercentage,
    setActiveTab,
    setActiveModal,
    setOfficialReportDate
  } = useConstruction();

  const { userProfile } = useAuth();

  // Calculate executed items today
  const totalMetradoEjecutadoHoy = useMemo(() => {
    return todayReports.reduce((sum, rep) => sum + (rep.metradoEjecutado || 0), 0);
  }, [todayReports]);

  // Weekly progress chart mock data based on recent reports
  const weeklyData = useMemo(() => {
    const days = [
      { day: 'Lun 21', fecha: '2026-08-21', real: 48.2, planificado: 50.0, metrado: 120 },
      { day: 'Mar 22', fecha: '2026-08-22', real: 51.0, planificado: 52.5, metrado: 145 },
      { day: 'Mié 23', fecha: '2026-08-23', real: 53.8, planificado: 54.0, metrado: 130 },
      { day: 'Jue 24', fecha: '2026-08-24', real: 56.4, planificado: 56.0, metrado: 165 },
      { day: 'Vie 25', fecha: '2026-08-25', real: 59.2, planificado: 58.0, metrado: 180 },
      { day: 'Sáb 26 (Hoy)', fecha: '2026-08-26', real: overallProgress, planificado: 60.0, metrado: totalMetradoEjecutadoHoy || 110 }
    ];
    return days;
  }, [overallProgress, totalMetradoEjecutadoHoy]);

  // Partidas breakdown by category
  const partidasByCategory = useMemo(() => {
    const categories: Record<string, { total: number; ejecutado: number; count: number }> = {};
    partidas.forEach(p => {
      const cat = p.categoria || 'Otras Obras';
      if (!categories[cat]) {
        categories[cat] = { total: 0, ejecutado: 0, count: 0 };
      }
      categories[cat].total += p.metradoContractual;
      categories[cat].ejecutado += p.metradoAcumulado;
      categories[cat].count += 1;
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      avance: Math.min(100, Math.round((data.ejecutado / (data.total || 1)) * 100)),
      count: data.count
    }));
  }, [partidas]);

  const formattedSelectedDate = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Personalized Welcome Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {userProfile?.nombre ? userProfile.nombre[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Bienvenido, {userProfile?.nombre ? `${userProfile.nombre} ${userProfile.apellido || ''}` : 'Usuario'}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Sesión activa</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              <span className="font-bold text-amber-700">{userProfile?.cargo || 'Residente de obra'}</span>
              {userProfile?.empresa && (
                <>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span>{userProfile.empresa}</span>
                </>
              )}
              {userProfile?.email && (
                <>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="text-slate-500">{userProfile.email}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveModal('user-profile')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Editar perfil</span>
          </button>
        </div>
      </div>

      {/* Top Banner / Project Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md font-bold tracking-wide">
                {project.codigo}
              </span>
              <span className="flex items-center text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                {project.ubicacion}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300/90 font-medium capitalize flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {formattedSelectedDate}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              {project.nombre}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 pt-1">
              <div>
                <span className="text-slate-400">Contratista: </span>
                <span className="font-semibold text-slate-200">{project.contratista}</span>
              </div>
              <div>
                <span className="text-slate-400">Residente: </span>
                <span className="font-semibold text-slate-200">{project.residente}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 md:pt-0">
            <button
              onClick={() => setActiveModal('test-firebase')}
              id="dashboard-test-firebase-btn"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              title="Probar escritura en colección test_connection"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>TEST FIREBASE</span>
            </button>
            <button
              onClick={() => setActiveModal('new-daily-report')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Avance</span>
            </button>
            <button
              onClick={() => {
                setOfficialReportDate(selectedDate);
                setActiveModal('official-report');
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Reporte Oficial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Foundation Phase Active Stage Banner with Checklist Quick Access */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-300/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.2 rounded font-mono">
                Etapa Activa: Cimentación
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {currentDayFoundationCheckedCount} de {currentDayFoundationTotalCount} actividades verificadas hoy
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Checklist Diario de Cimentación: {currentDayFoundationPercentage}% de actividades liberadas hoy
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden hidden sm:block">
            <div
              className={`h-2.5 rounded-full transition-all ${
                currentDayFoundationPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${currentDayFoundationPercentage}%` }}
            />
          </div>

          <button
            onClick={() => setActiveTab('daily-reports')}
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Abrir Checklist de Cimentación</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Indicator Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avance General Ponderado
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {overallProgress}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              En plazo
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>Programado: 60.0%</span>
              <span className="font-semibold text-slate-600">{partidas.length} Partidas activas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Today's Executed Partidas & Metrado */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Partidas Ejecutadas Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {todayReports.length}
            </span>
            <span className="text-xs text-slate-500">
              en {new Set(todayReports.map(r => r.frente)).size || 0} frentes
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Metrado total del día:</span>
            <span className="font-bold text-slate-800">{totalMetradoEjecutadoHoy.toLocaleString()} unids</span>
          </div>
          <button
            onClick={() => setActiveTab('partidas')}
            className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span>Ver catálogo de partidas</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* KPI 3: Personnel in Site */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Personal en Obra Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {todayWorkersCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Trabajadores activos
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Horas Hombre (HH):</span>
            <span className="font-bold text-slate-800">{todayTotalHours} HH registradas</span>
          </div>
          <button
            onClick={() => setActiveTab('personal')}
            className="mt-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center"
          >
            <span>Ver lista de cuadrillas</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* KPI 4: Incidents & Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Incidencias & Ocurrencias
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              pendingIncidentsCount > 0 
                ? 'bg-rose-100 text-rose-700 animate-pulse' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingIncidentsCount}
            </span>
            <span className="text-xs font-semibold text-rose-600">
              Pendientes
            </span>
            <span className="text-xs text-slate-400">
              ({inProgressIncidentsCount} en proceso)
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Resueltas:</span>
            <span className="font-bold text-emerald-600">{resolvedIncidentsCount} cerradas</span>
          </div>
          <button
            onClick={() => setActiveTab('incidencias')}
            className="mt-2 text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center"
          >
            <span>Gestionar incidencias</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Analytics & Daily Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Progress & Curva S */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Resumen de Avance Semanal (Curva S & Metrado Diario)
                </h3>
                <p className="text-xs text-slate-500">
                  Comparativa de avance físico acumulado (%) vs programación contractual
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-medium">
                <span className="flex items-center text-amber-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-1.5 inline-block" />
                  Avance Real (%)
                </span>
                <span className="flex items-center text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-slate-300 mr-1.5 inline-block" />
                  Programado (%)
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[40, 70]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Avance']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="real"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReal)"
                    name="Avance Real"
                  />
                  <Area
                    type="monotone"
                    dataKey="planificado"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="none"
                    name="Planificado"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Executed Activities Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Actividades y Partidas Registradas Hoy ({selectedDate})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reportes-diarios')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                Ver todos los reportes →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayReports.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    No hay reportes diarios registrados para la fecha {selectedDate}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Puedes ingresar el primer reporte diario o cambiar la fecha en la cabecera.
                  </p>
                  <button
                    onClick={() => setActiveModal('new-daily-report')}
                    className="mt-3 inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crear reporte de hoy</span>
                  </button>
                </div>
              ) : (
                todayReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                          {report.partidaCodigo}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {report.partidaDescripcion}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                        {report.metradoEjecutado} {report.unidad}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.descripcionActividad}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        {report.frente}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span>👷 {report.numTrabajadores} trabajadores</span>
                        <span>👤 {report.responsable}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Category Progress & Active Incidents */}
        <div className="space-y-6">
          {/* Progress by Category */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Avance por Categoría de Obra</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="mt-4 space-y-3.5">
              {partidasByCategory.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-900">{cat.avance}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        cat.avance >= 90 
                          ? 'bg-emerald-500' 
                          : cat.avance >= 50 
                          ? 'bg-amber-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${cat.avance}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {cat.count} partidas en esta especialidad
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Incidencias Registradas
                </h3>
              </div>
              <button
                onClick={() => setActiveModal('new-incident')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayIncidents.length === 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Sin incidencias reportadas en la fecha seleccionada ({selectedDate}).</span>
                </div>
              ) : (
                todayIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{inc.tipo}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.estado === 'Resuelto' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : inc.estado === 'En proceso'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inc.estado}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] line-clamp-2">
                      {inc.descripcion}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                      <span>📍 {inc.ubicacion}</span>
                      <span className="font-medium text-slate-700">{inc.responsable}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveTab('incidencias')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Ver todas las incidencias de obra ({pendingIncidentsCount + inProgressIncidentsCount + resolvedIncidentsCount}) →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
