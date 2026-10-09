import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Camera,
  Layers,
  Users,
  Boxes,
  Truck,
  AlertOctagon,
  ClipboardList,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import {
  WorkerRole,
  WorkerSpecialty,
  IncidentType,
  IncidentSeverity,
  IncidentStatus
} from '../types';

export const Modals: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    editingItem,
    project,
    partidas,
    selectedDate,
    addDailyReport,
    updateDailyReport,
    addPartida,
    updatePartida,
    addWorker,
    updateWorker,
    addMaterial,
    updateMaterial,
    addEquipment,
    updateEquipment,
    addIncident,
    updateIncident,
    addPhoto
  } = useConstruction();

  const supportedModals = [
    'new-daily-report',
    'new-partida',
    'new-worker',
    'new-material',
    'new-equipment',
    'new-incident',
    'new-photo'
  ];

  if (!activeModal || !supportedModals.includes(activeModal)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {activeModal === 'new-daily-report' && <DailyReportForm />}
        {activeModal === 'new-partida' && <PartidaForm />}
        {activeModal === 'new-worker' && <WorkerForm />}
        {activeModal === 'new-material' && <MaterialForm />}
        {activeModal === 'new-equipment' && <EquipmentForm />}
        {activeModal === 'new-incident' && <IncidentForm />}
        {activeModal === 'new-photo' && <PhotoForm />}
      </div>
    </div>
  );
};

/* 1. Daily Report Form */
const DailyReportForm: React.FC = () => {
  const {
    editingItem,
    setActiveModal,
    addDailyReport,
    updateDailyReport,
    partidas,
    project,
    selectedDate
  } = useConstruction();

  const [fecha, setFecha] = useState(editingItem?.fecha || selectedDate);
  const [frente, setFrente] = useState(editingItem?.frente || project.frentesTrabajo[0] || 'Frente 01');
  const [partidaId, setPartidaId] = useState(editingItem?.partidaId || partidas[0]?.id || '');
  const [descripcionActividad, setDescripcionActividad] = useState(editingItem?.descripcionActividad || '');
  const [metradoEjecutado, setMetradoEjecutado] = useState(editingItem?.metradoEjecutado?.toString() || '');
  const [numTrabajadores, setNumTrabajadores] = useState(editingItem?.numTrabajadores?.toString() || '6');
  const [equiposUtilizados, setEquiposUtilizados] = useState(editingItem?.equiposUtilizados || '');
  const [materialesUtilizados, setMaterialesUtilizados] = useState(editingItem?.materialesUtilizados || '');
  const [observaciones, setObservaciones] = useState(editingItem?.observaciones || '');
  const [responsable, setResponsable] = useState(editingItem?.responsable || project.residente || '');
  const [clima, setClima] = useState(editingItem?.clima || 'Soleado');
  const [turno, setTurno] = useState(editingItem?.turno || 'Diurno');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photosList, setPhotosList] = useState<string[]>(editingItem?.fotografias || []);

  const selectedPartidaObj = partidas.find(p => p.id === partidaId) || partidas[0];
  const unidad = selectedPartidaObj?.unidad || 'und';

  const handleAddPhotoUrl = () => {
    if (photoUrl.trim()) {
      setPhotosList(prev => [...prev, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPhotosList(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcionActividad.trim() || !metradoEjecutado) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const payload = {
      fecha,
      obraId: project.id,
      obraNombre: project.nombre,
      frente,
      partidaId: selectedPartidaObj?.id || 'par-01',
      partidaCodigo: selectedPartidaObj?.codigo || '01.01.01',
      partidaDescripcion: selectedPartidaObj?.descripcion || 'Partida general',
      descripcionActividad: descripcionActividad.trim(),
      metradoEjecutado: parseFloat(metradoEjecutado) || 0,
      unidad,
      numTrabajadores: parseInt(numTrabajadores) || 1,
      equiposUtilizados: equiposUtilizados.trim() || 'Herramientas menores',
      materialesUtilizados: materialesUtilizados.trim() || 'Insumos de habilitado',
      porcentajeAvance: selectedPartidaObj ? Math.min(100, Math.round(((selectedPartidaObj.metradoAcumulado + parseFloat(metradoEjecutado)) / selectedPartidaObj.metradoContractual) * 10000) / 100) : 0,
      observaciones: observaciones.trim(),
      fotografias: photosList,
      responsable: responsable.trim(),
      clima,
      turno
    };

    if (editingItem?.id) {
      updateDailyReport(editingItem.id, payload);
    } else {
      addDailyReport(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClipboardList className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Reporte Diario' : 'Nuevo Reporte Diario de Obra'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
        {/* Row 1: Fecha & Obra */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha de Ejecución *</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Frente de Trabajo *</label>
            <select
              value={frente}
              onChange={(e) => setFrente(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {project.frentesTrabajo.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Partida selection */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Partida Asociada *</label>
          <select
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
          >
            {partidas.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.descripcion} ({p.unidad})
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Description of activity */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Descripción Detallada de la Actividad Realizada *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Detalle los tramos, ejes, elementos constructivos vaciados, armados o encofrados..."
            value={descripcionActividad}
            onChange={(e) => setDescripcionActividad(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Row 4: Metrado, Unidad, Cuadrilla */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Metrado Ejecutado *
            </label>
            <div className="flex">
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="Ej. 18.5"
                value={metradoEjecutado}
                onChange={(e) => setMetradoEjecutado(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-l-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="bg-slate-200 px-3 py-2 rounded-r-xl font-bold text-slate-700 flex items-center">
                {unidad}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">N° Trabajadores *</label>
            <input
              type="number"
              min="1"
              required
              value={numTrabajadores}
              onChange={(e) => setNumTrabajadores(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Clima / Turno</label>
            <div className="grid grid-cols-2 gap-1">
              <select
                value={clima}
                onChange={(e) => setClima(e.target.value as any)}
                className="px-2 py-2 border border-slate-300 rounded-xl text-[11px]"
              >
                <option value="Soleado">Soleado</option>
                <option value="Nublado">Nublado</option>
                <option value="Lluvia Ligera">Lluvia</option>
              </select>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as any)}
                className="px-2 py-2 border border-slate-300 rounded-xl text-[11px]"
              >
                <option value="Diurno">Diurno</option>
                <option value="Nocturno">Nocturno</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 5: Equipment & Materials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Equipos Utilizados</label>
            <input
              type="text"
              placeholder="Ej. 01 Camión Mixer, 02 Vibradores 2pulg..."
              value={equiposUtilizados}
              onChange={(e) => setEquiposUtilizados(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Materiales Utilizados</label>
            <input
              type="text"
              placeholder="Ej. 18 m3 Concreto F'c 280, aditivo..."
              value={materialesUtilizados}
              onChange={(e) => setMaterialesUtilizados(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 6: Observaciones & Responsable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
            <input
              type="text"
              placeholder="Incidencias leves, ensayos de slump, tolerancias..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Responsable del Registro *</label>
            <input
              type="text"
              required
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 7: Fotografías */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block font-bold text-slate-700">Evidencias Fotográficas</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pegar URL de foto o usar botón de archivo..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddPhotoUrl}
              className="px-3 py-2 bg-slate-800 text-white rounded-xl font-bold"
            >
              Agregar
            </button>
            <label className="px-3 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold cursor-pointer flex items-center space-x-1">
              <Upload className="w-4 h-4" />
              <span>Subir</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {photosList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {photosList.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-300 group">
                  <img src={url} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => setPhotosList(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-all"
          >
            {editingItem ? 'Guardar Cambios' : 'Registrar Reporte Diario'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 2. Partida Form */
const PartidaForm: React.FC = () => {
  const { editingItem, setActiveModal, addPartida, updatePartida } = useConstruction();

  const [codigo, setCodigo] = useState(editingItem?.codigo || '');
  const [descripcion, setDescripcion] = useState(editingItem?.descripcion || '');
  const [categoria, setCategoria] = useState(editingItem?.categoria || 'Estructuras');
  const [unidad, setUnidad] = useState(editingItem?.unidad || 'm3');
  const [metradoContractual, setMetradoContractual] = useState(editingItem?.metradoContractual?.toString() || '');
  const [metradoAcumulado, setMetradoAcumulado] = useState(editingItem?.metradoAcumulado?.toString() || '0');
  const [metradoDia, setMetradoDia] = useState(editingItem?.metradoDia?.toString() || '0');
  const [precioUnitario, setPrecioUnitario] = useState(editingItem?.precioUnitario?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !descripcion.trim() || !metradoContractual) {
      alert('Complete los campos obligatorios de la partida.');
      return;
    }

    const payload = {
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      categoria: categoria.trim(),
      unidad: unidad.trim(),
      metradoContractual: parseFloat(metradoContractual) || 1,
      metradoAcumulado: parseFloat(metradoAcumulado) || 0,
      metradoDia: parseFloat(metradoDia) || 0,
      precioUnitario: parseFloat(precioUnitario) || 0
    };

    if (editingItem?.id) {
      updatePartida(editingItem.id, payload);
    } else {
      addPartida(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Partida de Obra' : 'Registrar Nueva Partida'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Código de Partida *</label>
            <input
              type="text"
              required
              placeholder="Ej. 02.03.01"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Categoría / Especialidad</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="Movimiento de Tierras">Movimiento de Tierras</option>
              <option value="Obras de Concreto Simple y Armado">Obras de Concreto Simple y Armado</option>
              <option value="Estructuras">Estructuras</option>
              <option value="Albañilería y Tabiquería">Albañilería y Tabiquería</option>
              <option value="Instalaciones Sanitarias">Instalaciones Sanitarias</option>
              <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
              <option value="Acabados">Acabados</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Descripción de la Partida *</label>
          <input
            type="text"
            required
            placeholder="Ej. Concreto F'c=210 kg/cm2 para Zapatas y Cimientos..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Unidad *</label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            >
              <option value="m3">m3 (Metro cúbico)</option>
              <option value="m2">m2 (Metro cuadrado)</option>
              <option value="ml">ml (Metro lineal)</option>
              <option value="kg">kg (Kilogramos)</option>
              <option value="und">und (Unidad)</option>
              <option value="pto">pto (Punto)</option>
              <option value="glb">glb (Global)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Metrado Contractual *</label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={metradoContractual}
              onChange={(e) => setMetradoContractual(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Metrado Acumulado</label>
            <input
              type="number"
              step="any"
              min="0"
              value={metradoAcumulado}
              onChange={(e) => setMetradoAcumulado(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Precio Unit. (S/)</label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="Opcional"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md"
          >
            {editingItem ? 'Actualizar Partida' : 'Guardar Partida'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 3. Worker Form */
const WorkerForm: React.FC = () => {
  const { editingItem, setActiveModal, addWorker, updateWorker, project, selectedDate } = useConstruction();

  const [nombre, setNombre] = useState(editingItem?.nombre || '');
  const [dni, setDni] = useState(editingItem?.dni || '');
  const [cargo, setCargo] = useState<WorkerRole>(editingItem?.cargo || 'Operario');
  const [especialidad, setEspecialidad] = useState<WorkerSpecialty>(editingItem?.especialidad || 'Estructuras / Encofrado');
  const [frente, setFrente] = useState(editingItem?.frente || project.frentesTrabajo[0] || 'Frente 01');
  const [horasTrabajadas, setHorasTrabajadas] = useState(editingItem?.horasTrabajadas?.toString() || '8.0');
  const [estado, setEstado] = useState(editingItem?.estado || 'Presente');
  const [fecha, setFecha] = useState(editingItem?.fecha || selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Ingrese el nombre del trabajador.');
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      dni: dni.trim(),
      cargo,
      especialidad,
      frente,
      horasTrabajadas: parseFloat(horasTrabajadas) || 8,
      estado,
      fecha
    };

    if (editingItem?.id) {
      updateWorker(editingItem.id, payload);
    } else {
      addWorker(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Registro de Personal' : 'Registrar Trabajador en Obra'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Santos Alarcón Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">DNI / Documento</label>
            <input
              type="text"
              placeholder="Ej. 44892103"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cargo *</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value as WorkerRole)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Ingeniero Residente">Ingeniero Residente</option>
              <option value="Ingeniero Supervisor">Ingeniero Supervisor</option>
              <option value="Asistente de Control">Asistente de Control</option>
              <option value="Maestro de Obra">Maestro de Obra</option>
              <option value="Capataz">Capataz</option>
              <option value="Operario">Operario</option>
              <option value="Oficial">Oficial</option>
              <option value="Peón">Peón</option>
              <option value="Operador de Maquinaria">Operador de Maquinaria</option>
              <option value="Topógrafo">Topógrafo</option>
              <option value="Prevencionista SST">Prevencionista SST</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Especialidad *</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value as WorkerSpecialty)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Estructuras / Encofrado">Estructuras / Encofrado</option>
              <option value="Fierrería / Armado">Fierrería / Armado</option>
              <option value="Concreto / Vaciado">Concreto / Vaciado</option>
              <option value="Albañilería">Albañilería</option>
              <option value="Instalaciones Sanitarias">Instalaciones Sanitarias</option>
              <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
              <option value="Movimiento de Tierras">Movimiento de Tierras</option>
              <option value="Seguridad y Salud (SST)">Seguridad y Salud (SST)</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Frente Asignado</label>
            <select
              value={frente}
              onChange={(e) => setFrente(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {project.frentesTrabajo.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Horas Trabajadas</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={horasTrabajadas}
              onChange={(e) => setHorasTrabajadas(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Estado de Asistencia</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
            >
              <option value="Presente">Presente</option>
              <option value="Descanso">Descanso</option>
              <option value="Permiso">Permiso</option>
              <option value="Falta">Falta</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md"
          >
            {editingItem ? 'Actualizar Personal' : 'Registrar Trabajador'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 4. Material Form */
const MaterialForm: React.FC = () => {
  const { editingItem, setActiveModal, addMaterial, updateMaterial, partidas, selectedDate } = useConstruction();

  const [material, setMaterial] = useState(editingItem?.material || '');
  const [unidad, setUnidad] = useState(editingItem?.unidad || 'bolsas');
  const [cantidadUtilizada, setCantidadUtilizada] = useState(editingItem?.cantidadUtilizada?.toString() || '');
  const [fecha, setFecha] = useState(editingItem?.fecha || selectedDate);
  const [partidaId, setPartidaId] = useState(editingItem?.partidaId || partidas[0]?.id || '');
  const [guiaRemision, setGuiaRemision] = useState(editingItem?.guiaRemision || '');
  const [observaciones, setObservaciones] = useState(editingItem?.observaciones || '');

  const selectedPartida = partidas.find(p => p.id === partidaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !cantidadUtilizada) {
      alert('Ingrese el material y la cantidad utilizada.');
      return;
    }

    const payload = {
      material: material.trim(),
      unidad: unidad.trim(),
      cantidadUtilizada: parseFloat(cantidadUtilizada) || 0,
      fecha,
      partidaId: selectedPartida?.id,
      partidaCodigo: selectedPartida?.codigo,
      partidaDescripcion: selectedPartida?.descripcion,
      guiaRemision: guiaRemision.trim(),
      observaciones: observaciones.trim()
    };

    if (editingItem?.id) {
      updateMaterial(editingItem.id, payload);
    } else {
      addMaterial(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Boxes className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Insumo de Obra' : 'Registrar Consumo de Material'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nombre del Material / Insumo *</label>
          <input
            type="text"
            required
            placeholder="Ej. Cemento Portland Tipo I, Acero corrugado 1/2 pulg..."
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cantidad Utilizada *</label>
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder="Ej. 25"
              value={cantidadUtilizada}
              onChange={(e) => setCantidadUtilizada(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unidad de Medida *</label>
            <input
              type="text"
              required
              placeholder="bolsas, m3, varillas, millar, tubos..."
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Partida Asociada</label>
          <select
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            {partidas.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">N° Guía de Remisión</label>
            <input
              type="text"
              placeholder="Ej. GR-004-99120 (Aceros Arequipa)"
              value={guiaRemision}
              onChange={(e) => setGuiaRemision(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
            <input
              type="text"
              placeholder="Calidad de lote, proveedor..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md"
          >
            {editingItem ? 'Guardar Cambios' : 'Registrar Material'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 5. Equipment Form */
const EquipmentForm: React.FC = () => {
  const { editingItem, setActiveModal, addEquipment, updateEquipment, partidas, selectedDate } = useConstruction();

  const [equipo, setEquipo] = useState(editingItem?.equipo || '');
  const [codigo, setCodigo] = useState(editingItem?.codigo || '');
  const [horasTrabajadas, setHorasTrabajadas] = useState(editingItem?.horasTrabajadas?.toString() || '7.5');
  const [operador, setOperador] = useState(editingItem?.operador || '');
  const [partidaId, setPartidaId] = useState(editingItem?.partidaId || partidas[0]?.id || '');
  const [estado, setEstado] = useState(editingItem?.estado || 'Operativo');
  const [fecha, setFecha] = useState(editingItem?.fecha || selectedDate);
  const [observaciones, setObservaciones] = useState(editingItem?.observaciones || '');

  const selectedPartida = partidas.find(p => p.id === partidaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipo.trim() || !codigo.trim()) {
      alert('Ingrese el nombre y código de la maquinaria.');
      return;
    }

    const payload = {
      equipo: equipo.trim(),
      codigo: codigo.trim(),
      horasTrabajadas: parseFloat(horasTrabajadas) || 0,
      operador: operador.trim() || 'Operador de turno',
      partidaId: selectedPartida?.id,
      partidaCodigo: selectedPartida?.codigo,
      partidaDescripcion: selectedPartida?.descripcion,
      estado,
      fecha,
      observaciones: observaciones.trim()
    };

    if (editingItem?.id) {
      updateEquipment(editingItem.id, payload);
    } else {
      addEquipment(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Maquinaria / Equipo' : 'Registrar Equipo de Obra'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Nombre / Modelo de Maquinaria *</label>
            <input
              type="text"
              required
              placeholder="Ej. Grúa Torre Potain MC 85B, Retroexcavadora CAT..."
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Código / Placa *</label>
            <input
              type="text"
              required
              placeholder="Ej. GT-01, RETRO-02"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Horas Máquina (HM) *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              required
              value={horasTrabajadas}
              onChange={(e) => setHorasTrabajadas(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Operador Responsable</label>
            <input
              type="text"
              placeholder="Nombre del operador"
              value={operador}
              onChange={(e) => setOperador(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Estado de Operatividad</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            >
              <option value="Operativo">Operativo</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="En Espera / Standby">En Espera / Standby</option>
              <option value="Averiado">Averiado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Partida Asociada</label>
          <select
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {partidas.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Observaciones Técnicas</label>
          <input
            type="text"
            placeholder="Mantenimiento preventivo, consumo de diésel..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md"
          >
            {editingItem ? 'Guardar Cambios' : 'Registrar Equipo'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 6. Incident Form */
const IncidentForm: React.FC = () => {
  const { editingItem, setActiveModal, addIncident, updateIncident, project, selectedDate } = useConstruction();

  const [fecha, setFecha] = useState(editingItem?.fecha || selectedDate);
  const [tipo, setTipo] = useState<IncidentType>(editingItem?.tipo || 'Seguridad / SST');
  const [descripcion, setDescripcion] = useState(editingItem?.descripcion || '');
  const [ubicacion, setUbicacion] = useState(editingItem?.ubicacion || '');
  const [responsable, setResponsable] = useState(editingItem?.responsable || project.residente || '');
  const [estado, setEstado] = useState<IncidentStatus>(editingItem?.estado || 'Pendiente');
  const [severidad, setSeveridad] = useState<IncidentSeverity>(editingItem?.severidad || 'Media');
  const [fotografia, setFotografia] = useState(editingItem?.fotografia || '');
  const [accionTomada, setAccionTomada] = useState(editingItem?.accionTomada || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFotografia(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || !ubicacion.trim()) {
      alert('Ingrese descripción y ubicación de la incidencia.');
      return;
    }

    const payload = {
      fecha,
      tipo,
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      responsable: responsable.trim(),
      estado,
      severidad,
      fotografia: fotografia.trim() || undefined,
      accionTomada: accionTomada.trim() || undefined
    };

    if (editingItem?.id) {
      updateIncident(editingItem.id, payload);
    } else {
      addIncident(payload);
    }

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-sm">
            {editingItem ? 'Editar Incidencia de Obra' : 'Registrar Nueva Incidencia / Ocurrencia'}
          </h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha *</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipo de Incidencia *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as IncidentType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
            >
              <option value="Seguridad / SST">Seguridad / SST</option>
              <option value="Calidad / No Conformidad">Calidad / No Conformidad</option>
              <option value="Retraso por Clima">Retraso por Clima</option>
              <option value="Desabastecimiento Material">Desabastecimiento Material</option>
              <option value="Falla de Maquinaria">Falla de Maquinaria</option>
              <option value="Modificación de Proyecto / Plano">Modificación de Proyecto / Plano</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Severidad *</label>
            <select
              value={severidad}
              onChange={(e) => setSeveridad(e.target.value as IncidentSeverity)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Descripción de la Incidencia *</label>
          <textarea
            required
            rows={3}
            placeholder="Describa el hecho ocurrido, impacto o no conformidad detectada..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ubicación Exacta *</label>
            <input
              type="text"
              required
              placeholder="Ej. Eje 4-D / Segundo Nivel, Losa 2..."
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Responsable de Atención *</label>
            <input
              type="text"
              required
              placeholder="Nombre del ingeniero o prevencionista"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Estado de la Incidencia</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as IncidentStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
            >
              <option value="Pendiente">Pendiente (Por atender)</option>
              <option value="En proceso">En proceso (Acción en curso)</option>
              <option value="Resuelto">Resuelto (Cerrada)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Acción Correctiva Tomada</label>
            <input
              type="text"
              placeholder="Medida ejecutada para solucionar el problema..."
              value={accionTomada}
              onChange={(e) => setAccionTomada(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Photo URL or Upload */}
        <div className="space-y-1">
          <label className="block font-bold text-slate-700">Fotografía de Evidencia</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="URL de foto o usar botón de archivo..."
              value={fotografia}
              onChange={(e) => setFotografia(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <label className="px-3 py-2 bg-rose-600 text-white rounded-xl font-bold cursor-pointer flex items-center space-x-1">
              <Upload className="w-4 h-4" />
              <span>Subir</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md"
          >
            {editingItem ? 'Guardar Cambios' : 'Registrar Incidencia'}
          </button>
        </div>
      </form>
    </>
  );
};

/* 7. Photo Form */
const PhotoForm: React.FC = () => {
  const { setActiveModal, addPhoto, partidas, project, selectedDate } = useConstruction();

  const [url, setUrl] = useState('');
  const [fecha, setFecha] = useState(selectedDate);
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState(project.frentesTrabajo[0] || 'Obra Principal');
  const [partidaId, setPartidaId] = useState(partidas[0]?.id || '');
  const [responsable, setResponsable] = useState(project.residente || '');

  const selectedPartida = partidas.find(p => p.id === partidaId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !descripcion.trim()) {
      alert('Por favor ingrese una fotografía y su descripción.');
      return;
    }

    addPhoto({
      url: url.trim(),
      fecha,
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      frente: ubicacion.trim(),
      partidaId: selectedPartida?.id,
      partidaCodigo: selectedPartida?.codigo,
      partidaDescripcion: selectedPartida?.descripcion,
      responsable: responsable.trim()
    });

    setActiveModal(null);
  };

  return (
    <>
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm">Subir Nueva Evidencia Fotográfica</h3>
        </div>
        <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
        <div className="space-y-2">
          <label className="block font-bold text-slate-700">Fotografía *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="https://... o cargar imagen desde dispositivo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer flex items-center space-x-1 shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Explorar</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {url && (
            <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Descripción de la Fotografía *</label>
          <input
            type="text"
            required
            placeholder="Ej. Vaciado de concreto en columnas eje 3, control de slump..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha de Captura *</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ubicación / Frente *</label>
            <input
              type="text"
              required
              placeholder="Ej. Sector 2, Frente 02..."
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Partida Asociada</label>
          <select
            value={partidaId}
            onChange={(e) => setPartidaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {partidas.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md"
          >
            Guardar Fotografía
          </button>
        </div>
      </form>
    </>
  );
};
