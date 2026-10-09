import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  AlertOctagon,
  Menu
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    pendingIncidentsCount,
    todayReports
  } = useConstruction();

  const mainItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'reportes-diarios',
      label: 'Diario',
      icon: ClipboardList,
      badge: todayReports.length
    },
    {
      id: 'partidas',
      label: 'Partidas',
      icon: Layers
    },
    {
      id: 'incidencias',
      label: 'Incidencias',
      icon: AlertOctagon,
      badge: pendingIncidentsCount > 0 ? pendingIncidentsCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg no-print">
      <div className="flex items-center justify-around h-16 px-2">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative text-[11px] font-medium transition-colors ${
                isActive ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600 stroke-[2.5]' : 'text-slate-500'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
              {isActive && (
                <span className="w-8 h-0.5 bg-amber-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More button to toggle full sidebar drawer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
        >
          <Menu className="w-5 h-5 text-slate-500" />
          <span className="mt-1">Módulos</span>
        </button>
      </div>
    </nav>
  );
};
