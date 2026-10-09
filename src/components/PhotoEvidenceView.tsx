import React, { useState, useMemo } from 'react';
import {
  Camera,
  Plus,
  Search,
  Trash2,
  Calendar,
  MapPin,
  Layers,
  ExternalLink,
  X,
  Maximize2,
  Upload,
  User
} from 'lucide-react';
import { useConstruction } from '../context/ConstructionContext';
import { PhotoEvidence } from '../types';

export const PhotoEvidenceView: React.FC = () => {
  const {
    photos,
    deletePhoto,
    setActiveModal,
    partidas,
    project
  } = useConstruction();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartida, setFilterPartida] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEvidence | null>(null);

  const filteredPhotos = useMemo(() => {
    return photos.filter(pho => {
      if (filterPartida !== 'ALL' && pho.partidaId !== filterPartida && pho.partidaCodigo !== filterPartida) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchDesc = pho.descripcion?.toLowerCase().includes(q);
        const matchUbi = pho.ubicacion?.toLowerCase().includes(q);
        const matchResp = pho.responsable?.toLowerCase().includes(q);
        const matchPartida = pho.partidaCodigo?.toLowerCase().includes(q) || pho.partidaDescripcion?.toLowerCase().includes(q);
        if (!matchDesc && !matchUbi && !matchResp && !matchPartida) return false;
      }
      return true;
    });
  }, [photos, filterPartida, searchTerm]);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta fotografía de las evidencias de obra?')) {
      deletePhoto(id);
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Módulo 8: Fototeca & Registro Visual de Obra</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Evidencias Fotográficas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro visual organizado por fecha, frente de trabajo, partidas ejecutadas e incidencias.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-photo')}
          className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Fotografía</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en descripciones, ubicación, partida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={filterPartida}
            onChange={(e) => setFilterPartida(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full md:w-auto"
          >
            <option value="ALL">Todas las Partidas ({photos.length} fotos)</option>
            {partidas.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.descripcion.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No se encontraron fotografías
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Puedes agregar fotos desde los reportes diarios o directamente pulsando en "Subir Fotografía".
          </p>
          <button
            onClick={() => setActiveModal('new-photo')}
            className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primera fotografía</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((pho) => (
            <div
              key={pho.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Photo Image with Hover Overlay */}
              <div 
                onClick={() => setSelectedPhoto(pho)}
                className="relative h-48 bg-slate-100 cursor-pointer overflow-hidden"
              >
                <img
                  src={pho.url}
                  alt={pho.descripcion}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-xs text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ver Ampliada</span>
                  </span>
                </div>
                {pho.partidaCodigo && (
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {pho.partidaCodigo}
                  </div>
                )}
                <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{pho.fecha}</span>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                    {pho.descripcion}
                  </p>
                  <div className="mt-2 flex items-center text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0" />
                    <span className="truncate">{pho.ubicacion}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[170px]">
                    👤 {pho.responsable}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(pho.id);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700"
          >
            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.descripcion}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {selectedPhoto.partidaCodigo && (
                    <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Partida: {selectedPhoto.partidaCodigo}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {selectedPhoto.fecha}
                  </span>
                </div>

                <span className="text-xs text-slate-600 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1" />
                  {selectedPhoto.ubicacion}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                {selectedPhoto.descripcion}
              </h3>

              {selectedPhoto.partidaDescripcion && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Partida: </strong>{selectedPhoto.partidaDescripcion}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Registrado por: <strong>{selectedPhoto.responsable}</strong></span>
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
