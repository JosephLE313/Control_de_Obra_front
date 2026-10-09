import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  Users,
  Boxes,
  Truck,
  AlertOctagon,
  Camera,
  BarChart3,
  Settings,
  FileCheck2,
  CalendarDays,
  HardHat,
  ChevronRight,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { useAuth } from '../context/AuthContext';
import { ActiveTab } from '../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    pendingIncidentsCount,
    todayReports,
    partidas,
    todayPersonnel,
    project,
    setActiveModal,
    setOfficialReportDate,
    selectedDate
  } = useConstruction();

  const { userProfile, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'reportes-diarios',
      label: '2. Reporte Diario',
      icon: ClipboardList,
      badge: todayReports.length > 0 ? `${todayReports.length} hoy` : undefined,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      id: 'cronograma-cimentacion',
      label: 'Cronograma Cimentación',
      icon: CalendarDays,
      badge: 'Fase 1',
      badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-500/30'
    },
    {
      id: 'partidas',
      label: '3. Partidas y Metrados',
      icon: Layers,
      badge: partidas.length,
      badgeColor: 'bg-slate-100 text-slate-600'
    },
    {
      id: 'personal',
      label: '4. Personal / Cuadrillas',
      icon: Users,
      badge: todayPersonnel.length > 0 ? `${todayPersonnel.length}` : undefined,
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      id: 'materiales',
      label: '5. Materiales e Insumos',
      icon: Boxes
    },
    {
      id: 'equipos',
      label: '6. Equipos y Maquinaria',
      icon: Truck
    },
    {
      id: 'incidencias',
      label: '7. Incidencias y Ocurrencias',
      icon: AlertOctagon,
      badge: pendingIncidentsCount > 0 ? pendingIncidentsCount : undefined,
      badgeColor: 'bg-rose-500/15 text-rose-600 border-rose-500/30'
    },
    {
      id: 'evidencias',
      label: '8. Evidencias Fotográficas',
      icon: Camera
    },
    {
      id: 'analisis-reportes',
      label: '9. Reportes y Curva S',
      icon: BarChart3
    }
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    if (window.confirm('¿Deseas cerrar la sesión actual?')) {
      await logout();
    }
  };

  const getInitials = () => {
    if (!userProfile) return 'U';
    const n = userProfile.nombre ? userProfile.nombre[0] : '';
    const a = userProfile.apellido ? userProfile.apellido[0] : '';
    return `${n}${a}`.toUpperCase() || 'U';
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-10 no-print ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside mobile menu */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm">Control de Obra</span>
              <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{project.codigo}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Card in Desktop Sidebar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 hidden lg:block">
          <div className="text-[11px] font-bold tracking-wider uppercase text-amber-700 mb-1 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Obra en Ejecución</span>
          </div>
          <h2 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2" title={project.nombre}>
            {project.nombre}
          </h2>
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Código: {project.codigo}</span>
            <span className="font-semibold text-slate-700">{project.moneda} S/</span>
          </div>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Módulos del Sistema
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isActive ? 'bg-slate-950/15 text-slate-950 border-slate-950/20' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions & User Profile Card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
          {/* Quick PDF Report Button */}
          <button
            onClick={() => {
              setOfficialReportDate(selectedDate);
              setActiveModal('official-report');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Generar Reporte Diario</span>
          </button>

          {/* User Profile Card */}
          {userProfile && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-xs">
              <div 
                onClick={() => {
                  setActiveModal('user-profile');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors"
                title="Ver y editar mi perfil"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {getInitials()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {userProfile.nombre} {userProfile.apellido}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold truncate">
                      {userProfile.cargo}
                    </div>
                  </div>
                </div>
                <User className="w-4 h-4 text-slate-400 hover:text-amber-600 shrink-0 ml-1" />
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveModal('user-profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[11px] text-slate-600 hover:text-amber-600 font-bold transition-colors cursor-pointer"
                >
                  Mi perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

