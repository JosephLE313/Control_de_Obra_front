/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConstructionProvider, useConstruction } from './context/ConstructionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { DailyReportView } from './components/DailyReportView';
import { PartidasView } from './components/PartidasView';
import { PersonnelView } from './components/PersonnelView';
import { MaterialsView } from './components/MaterialsView';
import { EquipmentView } from './components/EquipmentView';
import { IncidentsView } from './components/IncidentsView';
import { PhotoEvidenceView } from './components/PhotoEvidenceView';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { FoundationScheduleView } from './components/FoundationScheduleView';
import { OfficialDailyReportModal } from './components/OfficialDailyReportModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { TestSupabaseModal } from './components/TestSupabaseModal';
import { UserProfileModal } from './components/UserProfileModal';
import { InstallAppModal } from './components/InstallAppModal';
import { Modals } from './components/Modals';

const AppLayout: React.FC = () => {
  const { currentView, setCurrentView, activeModal, setActiveModal } = useConstruction();

  // Render Main Application Layout directly without forcing login screen
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main App Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Desktop Sidebar (hidden on mobile) */}
        <Sidebar />

        {/* Dynamic View Area */}
        <main className="flex-1 min-w-0">
          {(currentView === 'dashboard' || currentView === 'perfil') && <DashboardView />}
          {(currentView === 'daily-reports' || currentView === 'reportes-diarios') && <DailyReportView />}
          {(currentView === 'cronograma' || currentView === 'cronograma-cimentacion') && <FoundationScheduleView />}
          {currentView === 'partidas' && <PartidasView />}
          {(currentView === 'personnel' || currentView === 'personal') && <PersonnelView />}
          {(currentView === 'materials' || currentView === 'materiales') && <MaterialsView />}
          {(currentView === 'equipment' || currentView === 'equipos') && <EquipmentView />}
          {(currentView === 'incidents' || currentView === 'incidencias') && <IncidentsView />}
          {(currentView === 'photos' || currentView === 'evidencias') && <PhotoEvidenceView />}
          {(currentView === 'reports' || currentView === 'analisis-reportes') && <AnalyticsReportsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (visible only on mobile/tablet) */}
      <BottomNav />

      {/* Interactive Global Modals */}
      <Modals />
      <OfficialDailyReportModal />
      <ProjectSettingsModal />
      <TestSupabaseModal
        isOpen={activeModal === 'test-supabase' || activeModal === 'test-firebase'}
        onClose={() => setActiveModal(null)}
      />
      <UserProfileModal
        isOpen={activeModal === 'user-profile' || currentView === 'perfil'}
        onClose={() => {
          setActiveModal(null);
          if (currentView === 'perfil') setCurrentView('dashboard');
        }}
      />
      <InstallAppModal
        isOpen={activeModal === 'install-app'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ConstructionProvider>
        <AppLayout />
      </ConstructionProvider>
    </AuthProvider>
  );
}


