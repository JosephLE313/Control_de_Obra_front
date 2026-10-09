import React, { useMemo } from 'react';
import {
  FileText,
  Printer,
  X,
  Calendar,
  Building2,
  Users,
  Boxes,
  Truck,
  AlertOctagon,
  Camera,
  CheckCircle2,
  HardHat,
  Download,
  Share2
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';

export const OfficialDailyReportModal: React.FC = () => {
  const {
    project,
    dailyReports,
    personnel,
    materials,
    equipment,
    incidents,
    photos,
    officialReportDate,
    setOfficialReportDate,
    activeModal,
    setActiveModal,
    overallProgress
  } = useConstruction();

  const reportDate = officialReportDate || '2026-08-26';

  // Filter items for this official report date
  const dayReports = useMemo(() => {
    return dailyReports.filter(r => r.fecha === reportDate);
  }, [dailyReports, reportDate]);

  const dayPersonnel = useMemo(() => {
    return personnel.filter(p => p.fecha === reportDate && p.estado === 'Presente');
  }, [personnel, reportDate]);

  const dayMaterials = useMemo(() => {
    return materials.filter(m => m.fecha === reportDate);
  }, [materials, reportDate]);

  const dayEquipment = useMemo(() => {
    return equipment.filter(e => e.fecha === reportDate);
  }, [equipment, reportDate]);

  const dayIncidents = useMemo(() => {
    return incidents.filter(i => i.fecha === reportDate);
  }, [incidents, reportDate]);

  const dayPhotos = useMemo(() => {
    return photos.filter(p => p.fecha === reportDate);
  }, [photos, reportDate]);

  const totalWorkers = dayPersonnel.length;
  const totalHH = dayPersonnel.reduce((sum, p) => sum + (p.horasTrabajadas || 8), 0);

  const handlePrint = () => {
    window.print();
  };

  if (activeModal !== 'official-report') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
        {/* Modal Top Action Bar (hidden in print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                10. Reporte Diario de Obra Oficial (Hoja de Cuaderno de Obra)
              </h2>
              <p className="text-[11px] text-slate-400">
                Documento oficial imprimible para residente y supervisor de obra
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Date selector inside modal */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setOfficialReportDate(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body (A4 Styled Layout) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 print:p-0 print:overflow-visible space-y-6">
          {/* Institutional Engineering Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-600">
                  INFORME DIARIO DE AVANCE FÍSICO Y CONTROL DE CAMPO
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif uppercase tracking-tight mt-0.5">
                  {project.nombre}
                </h1>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  CÓDIGO: {project.codigo} | UBICACIÓN: {project.ubicacion}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-block bg-slate-900 text-amber-400 font-mono font-bold text-xs px-3 py-1 rounded">
                  FECHA: {reportDate}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  AVANCE GENERAL: {overallProgress}%
                </div>
              </div>
            </div>

            {/* Project Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block font-semibold">Entidad / Cliente:</span>
                <span className="font-bold text-slate-800">{project.cliente}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Contratista Ejecutor:</span>
                <span className="font-bold text-slate-800">{project.contratista}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Supervisión de Obra:</span>
                <span className="font-bold text-slate-800">{project.supervisor}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Residente de Obra:</span>
                <span className="font-bold text-slate-800">{project.residente}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Activities and Metrados Executed */}
          <div className="space-y-2 print-break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded border-l-4 border-amber-500">
              1. Actividades y Partidas Ejecutadas en la Jornada
            </h3>

            {dayReports.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No se registraron partidas ejecutadas para esta fecha en el sistema.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                      <th className="py-2 px-3">Partida</th>
                      <th className="py-2 px-3">Frente de Trabajo</th>
                      <th className="py-2 px-3">Descripción de Actividad Realizada</th>
                      <th className="py-2 px-3 text-right">Metrado</th>
                      <th className="py-2 px-3 text-center">Cuadrilla</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dayReports.map(r => (
                      <tr key={r.id} className="align-top">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 shrink-0">
                          {r.partidaCodigo}
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-medium">{r.frente}</td>
                        <td className="py-2 px-3 text-slate-700 leading-snug">
                          {r.descripcionActividad}
                          {r.observaciones && (
                            <span className="block text-[10px] text-amber-800 mt-0.5">
                              Obs: {r.observaciones}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {r.metradoEjecutado} {r.unidad}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600">
                          {r.numTrabajadores} obreros
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2 & 3: Personnel & Resources (Side by Side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-break-inside-avoid">
            {/* Personnel */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded border-l-4 border-blue-500 flex justify-between">
                <span>2. Personal en Obra ({totalWorkers} pers / {totalHH} HH)</span>
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                      <th className="py-1.5 px-2.5">Nombre</th>
                      <th className="py-1.5 px-2">Cargo / Esp.</th>
                      <th className="py-1.5 px-2 text-center">Horas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dayPersonnel.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-2 px-2 text-center text-slate-400">
                          Sin personal registrado en esta fecha.
                        </td>
                      </tr>
                    ) : (
                      dayPersonnel.map(p => (
                        <tr key={p.id}>
                          <td className="py-1.5 px-2.5 font-medium text-slate-900">{p.nombre}</td>
                          <td className="py-1.5 px-2 text-slate-600">{p.cargo}</td>
                          <td className="py-1.5 px-2 text-center font-bold text-slate-800">{p.horasTrabajadas}h</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Materials & Equipment */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded border-l-4 border-emerald-500">
                3. Equipos y Materiales Utilizados
              </h3>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block text-[11px]">Equipos / Maquinaria:</span>
                  {dayEquipment.length === 0 ? (
                    <span className="text-slate-400 text-[11px] italic">Herramientas menores de mano</span>
                  ) : (
                    <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                      {dayEquipment.map(eq => (
                        <li key={eq.id}>
                          <strong>{eq.codigo}</strong>: {eq.equipo} ({eq.horasTrabajadas} HM) - Op: {eq.operador}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block text-[11px]">Materiales e Insumos:</span>
                  {dayMaterials.length === 0 ? (
                    <span className="text-slate-400 text-[11px] italic">Materiales menores de habilitación</span>
                  ) : (
                    <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                      {dayMaterials.map(m => (
                        <li key={m.id}>
                          {m.material}: <strong>{m.cantidadUtilizada} {m.unidad}</strong> {m.guiaRemision ? `(${m.guiaRemision})` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Incidents & Occurrences */}
          <div className="space-y-2 print-break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded border-l-4 border-rose-500">
              4. Ocurrencias, Seguridad e Incidencias del Día
            </h3>

            {dayIncidents.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg">
                Jornada sin accidentes de trabajo, incidentes críticos ni paralizaciones reportadas.
              </p>
            ) : (
              <div className="space-y-2">
                {dayIncidents.map(inc => (
                  <div key={inc.id} className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-rose-900">
                      <span>[{inc.tipo}] {inc.ubicacion}</span>
                      <span className="uppercase text-[10px] bg-rose-200 px-1.5 py-0.5 rounded">{inc.estado}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{inc.descripcion}</p>
                    {inc.accionTomada && (
                      <p className="text-emerald-800 text-[11px] font-medium">
                        <strong>Acción:</strong> {inc.accionTomada}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Photo Evidence Appendix */}
          {dayPhotos.length > 0 && (
            <div className="space-y-2 print-break-inside-avoid">
              <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-1 rounded border-l-4 border-amber-500">
                5. Registro Fotográfico de la Jornada
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {dayPhotos.slice(0, 3).map(pho => (
                  <div key={pho.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-1.5 space-y-1">
                    <div className="h-28 bg-slate-200 rounded overflow-hidden">
                      <img
                        src={pho.url}
                        alt={pho.descripcion}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium line-clamp-2 leading-tight">
                      {pho.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures Block */}
          <div className="pt-12 mt-8 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs print-break-inside-avoid">
            <div className="space-y-1">
              <div className="w-48 mx-auto border-t border-slate-800 pt-1 font-bold text-slate-900">
                {project.residente}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">
                Ingeniero Residente de Obra
              </p>
              <p className="text-[10px] text-slate-400">{project.contratista}</p>
            </div>

            <div className="space-y-1">
              <div className="w-48 mx-auto border-t border-slate-800 pt-1 font-bold text-slate-900">
                {project.supervisor}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">
                Ingeniero Supervisor / Inspector
              </p>
              <p className="text-[10px] text-slate-400">{project.cliente}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
