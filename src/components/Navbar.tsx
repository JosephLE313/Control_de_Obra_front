import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Plus, 
  FileText, 
  Menu, 
  Database, 
  Layers, 
  AlertTriangle,
  HardHat,
  Share2,
  Cloud,
  CloudCheck,
  RefreshCw,
  Zap,
  User,
  LogOut,
  ChevronDown,
  Smartphone,
  Download
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const {
    project,
    selectedDate,
    setSelectedDate,
    setActiveTab,
    setActiveModal,
    setOfficialReportDate,
    pendingIncidentsCount,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isSupabaseConnected,
    isFirestoreConnected,
    isSyncing,
    syncDataToSupabase
  } = useConstruction();

  const { userProfile, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getInitials = () => {
    if (!userProfile) return 'U';
    const n = userProfile.nombre ? userProfile.nombre[0] : '';
    const a = userProfile.apellido ? userProfile.apellido[0] : '';
    return `${n}${a}`.toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    setShowUserDropdown(false);
    if (window.confirm('¿Deseas cerrar sesión en Control de Obra?')) {
      await logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-white font-sans">
                    Control de Obra
                  </span>
                  {/* Supabase Status Badge */}
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal('test-supabase');
                    }}
                    className={`hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-extrabold tracking-wider rounded-full border cursor-pointer transition-all ${
                      isSupabaseConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                    title="Base de datos Supabase conectada y sincronizada en la nube"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{isSyncing ? 'Guardando...' : 'Supabase'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
                  {project.nombre}
                </p>
              </div>
            </div>
          </div>

          {/* Date Selector, Action Buttons & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Date Picker */}
            <div className="hidden sm:flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>

            {/* Install APK / Mobile App Button */}
            <button
              id="navbar-install-apk-btn"
              onClick={() => setActiveModal('install-app')}
              className="hidden lg:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-bold shadow-sm transition-all cursor-pointer group"
              title="Instalar como App nativa en Android / Descargar APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Instalar APK</span>
            </button>

            {/* Quick Generate Daily Report */}
            <button
              onClick={() => {
                setOfficialReportDate(selectedDate);
                setActiveModal('official-report');
              }}
              className="hidden md:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Generar Reporte Diario Oficial Imprimible"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reporte Diario</span>
            </button>

            {/* TEST SUPABASE Button */}
            <button
              id="navbar-test-supabase-btn"
              onClick={() => setActiveModal('test-supabase')}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-lg shadow-md shadow-emerald-500/20 border border-emerald-400/40 transition-all active:scale-95 cursor-pointer"
              title="Probar conexión en vivo con base de datos Supabase"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">TEST SUPABASE</span>
              <span className="sm:hidden">SUPABASE</span>
            </button>

            {/* Quick Add Dropdown / Button */}
            <button
              onClick={() => setActiveModal('new-daily-report')}
              className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Registro</span>
              <span className="sm:hidden">Nuevo</span>
            </button>

            {/* Settings & Supabase Config */}
            <button
              onClick={() => setActiveModal('project-settings')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Configuración de Obra y Base de Datos Supabase"
            >
              <Database className="w-4 h-4" />
              {isSupabaseConnected && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
              )}
            </button>

            {/* USER PROFILE & LOGOUT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                id="navbar-user-dropdown-btn"
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all cursor-pointer group"
                title="Menú de Usuario"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  {getInitials()}
                </div>
                <div className="hidden xl:block min-w-0 pr-1">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                    {userProfile?.nombre || 'Usuario'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                    {userProfile?.cargo || 'Miembro'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <div className="px-3.5 py-2.5 border-b border-slate-800">
                      <p className="font-bold text-white truncate">
                        {userProfile?.nombre} {userProfile?.apellido}
                      </p>
                      <p className="text-[11px] text-amber-400 font-semibold">{userProfile?.cargo}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{userProfile?.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveModal('install-app');
                        }}
                        className="w-full px-3.5 py-2 text-left text-emerald-400 hover:bg-slate-800 flex items-center space-x-2.5 transition-colors cursor-pointer font-bold"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Instalar en Android / APK</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveModal('user-profile');
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-amber-400 flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-semibold">Mi perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveModal('project-settings');
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-slate-400" />
                        <span>Configuración de Obra</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3.5 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-colors cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

