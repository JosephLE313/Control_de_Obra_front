import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Shield,
  ShieldCheck,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserCargo, UserProfile } from '../types';

const CARGOS_DISPONIBLES: UserCargo[] = [
  'Administrador',
  'Residente de obra',
  'Supervisor',
  'Asistente de obra',
  'Ingeniero',
  'Usuario'
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfileData, logout, refreshUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombre: userProfile.nombre || '',
        apellido: userProfile.apellido || '',
        telefono: userProfile.telefono || '',
        cargo: userProfile.cargo || 'Usuario',
        empresa: userProfile.empresa || '',
        fotoPerfil: userProfile.fotoPerfil || ''
      });
    }
  }, [userProfile, isOpen]);

  if (!isOpen || !userProfile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    try {
      await updateProfileData({
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        telefono: formData.telefono?.trim(),
        cargo: formData.cargo,
        empresa: formData.empresa?.trim()
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al guardar los cambios en Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      onClose();
      await logout();
    }
  };

  const getInitials = () => {
    const n = userProfile.nombre ? userProfile.nombre[0] : 'U';
    const a = userProfile.apellido ? userProfile.apellido[0] : 'O';
    return `${n}${a}`.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/20">
              {getInitials()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {userProfile.nombre} {userProfile.apellido}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {userProfile.estado || 'Activo'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{userProfile.cargo} · {userProfile.empresa}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800 text-xs">
          
          {/* Notifications */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Perfil actualizado con éxito en Cloud Firestore!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 font-bold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* User Info Form / Display */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Información Personal y de Obra
              </span>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-bold text-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar datos</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Nombre */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                    {userProfile.nombre}
                  </div>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Apellido</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.apellido || ''}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900">
                    {userProfile.apellido}
                  </div>
                )}
              </div>

              {/* Correo Electrónico (Read Only) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-600 flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{userProfile.email}</span>
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{userProfile.telefono || 'No registrado'}</span>
                  </div>
                )}
              </div>

              {/* Cargo */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo en Obra</label>
                {isEditing ? (
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value as UserCargo })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {CARGOS_DISPONIBLES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-900 bg-amber-50/50 flex items-center space-x-2">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{userProfile.cargo}</span>
                  </div>
                )}
              </div>

              {/* Empresa */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Empresa / Contratista</label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.empresa || ''}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 flex items-center space-x-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{userProfile.empresa}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button when Editing */}
            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Guardando en Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* System & Firestore Metadata Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Registro del Sistema en Firebase
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Fecha de Registro:</strong>{' '}
                  {userProfile.fechaRegistro ? new Date(userProfile.fechaRegistro).toLocaleDateString() : 'N/D'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Última Conexión:</strong>{' '}
                  {userProfile.ultimaConexion ? new Date(userProfile.ultimaConexion).toLocaleString() : 'N/D'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-600 sm:col-span-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  <strong>UID Auth:</strong> <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">{userProfile.uid}</code>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer with Logout Option */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleLogout}
            id="btn-profile-logout"
            className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};
