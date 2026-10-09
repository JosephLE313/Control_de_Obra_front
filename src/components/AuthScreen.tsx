import React, { useState } from 'react';
import {
  HardHat,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Building,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserCargo } from '../types';

type AuthMode = 'login' | 'register' | 'forgot-password';

const CARGOS_DISPONIBLES: UserCargo[] = [
  'Administrador',
  'Residente de obra',
  'Supervisor',
  'Asistente de obra',
  'Ingeniero',
  'Usuario'
];

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, resetPassword, authError, clearAuthError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states for Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form states for Register
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    cargo: 'Residente de obra' as UserCargo,
    empresa: 'Consorcio Vial & Estructuras'
  });

  // Form state for Forgot Password
  const [resetEmail, setResetEmail] = useState('');

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearAuthError();
    setValidationError(null);
    setSuccessMessage(null);
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();

    if (!loginEmail.trim() || !loginPassword) {
      setValidationError('Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();

    const { nombre, apellido, email, password, confirmPassword, telefono, cargo, empresa } = registerData;

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password || !confirmPassword || !telefono.trim() || !empresa.trim()) {
      setValidationError('Todos los campos son obligatorios.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Ingresa un formato de correo electrónico válido.');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setValidationError('La contraseña debe tener como mínimo 6 caracteres.');
      return;
    }

    // Passwords match validation
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden. Verifica nuevamente.');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        nombre,
        apellido,
        email,
        password,
        telefono,
        cargo,
        empresa
      });
      setSuccessMessage('¡Cuenta creada exitosamente en Firebase Authentication y Cloud Firestore!');
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Forgot Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();

    if (!resetEmail.trim()) {
      setValidationError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setSuccessMessage(`Se ha enviado un enlace de recuperación a ${resetEmail}. Revisa tu bandeja de entrada.`);
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  // Demo user quick helper
  const handleFillDemo = (type: 'residente' | 'admin' | 'supervisor') => {
    if (type === 'residente') {
      setLoginEmail('residente@obras.pe');
      setLoginPassword('Obra2026!');
    } else if (type === 'admin') {
      setLoginEmail('admin@obras.pe');
      setLoginPassword('Admin2026!');
    } else {
      setLoginEmail('supervisor@obras.pe');
      setLoginPassword('Super2026!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md md:max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 mb-3 group hover:scale-105 transition-transform">
            <HardHat className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            Control de Obra
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Sistema de Gestión Integral, Reportes Diarios y Cimentaciones
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl backdrop-blur-md p-6 sm:p-8 text-white">
          
          {/* Notification Alerts */}
          {(authError || validationError) && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{validationError || authError}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 1: LOGIN */}
          {/* ============================================================ */}
          {mode === 'login' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight">Iniciar Sesión</h2>
                <p className="text-xs text-slate-400">Ingresa tus credenciales para acceder a la plataforma de obra</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ingeniero@constructora.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Contraseña *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot-password')}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="btn-login-submit"
                  className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Helper Pill */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium mb-2 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>¿Probar acceso rápido?</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('residente')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-[11px] text-slate-300 font-medium text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-400 block">Residente Obra</span>
                    <span className="text-[10px] text-slate-400 truncate block">residente@obras.pe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('supervisor')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-[11px] text-slate-300 font-medium text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-400 block">Supervisor</span>
                    <span className="text-[10px] text-slate-400 truncate block">supervisor@obras.pe</span>
                  </button>
                </div>
              </div>

              {/* Toggle to Register */}
              <div className="mt-6 text-center text-xs text-slate-400">
                ¿Aún no tienes una cuenta de obra?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 2: REGISTER */}
          {/* ============================================================ */}
          {mode === 'register' && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white tracking-tight">Crear Cuenta de Usuario</h2>
                <p className="text-xs text-slate-400">Registro en Firebase Auth y perfil sincronizado en Cloud Firestore</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nombre *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={registerData.nombre}
                        onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                        placeholder="Carlos"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      value={registerData.apellido}
                      onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                      placeholder="Mendoza"
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                {/* Correo y Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Correo electrónico *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="carlos@obra.pe"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={registerData.telefono}
                        onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                        placeholder="+51 987 654 321"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Cargo y Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Cargo *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <select
                        value={registerData.cargo}
                        onChange={(e) => setRegisterData({ ...registerData, cargo: e.target.value as UserCargo })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold cursor-pointer"
                      >
                        {CARGOS_DISPONIBLES.map((c) => (
                          <option key={c} value={c} className="bg-slate-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Empresa *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={registerData.empresa}
                        onChange={(e) => setRegisterData({ ...registerData, empresa: e.target.value })}
                        placeholder="Constructora ABC"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Contraseña y Confirmación */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Mín. 6 caracteres"
                        className="w-full pl-9 pr-8 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Confirmar Contraseña *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Repetir contraseña"
                        className="w-full pl-9 pr-8 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="btn-register-submit"
                  className="w-full mt-3 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creando cuenta y registrando en Firestore...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear Cuenta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-400">
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 3: FORGOT PASSWORD */}
          {/* ============================================================ */}
          {mode === 'forgot-password' && (
            <div>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">Recuperar Contraseña</h2>
                <p className="text-xs text-slate-400">
                  Ingresa tu correo registrado para enviarte las instrucciones de restablecimiento
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Correo electrónico registrado *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="ingeniero@constructora.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando solicitud...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Enlace de Recuperación</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  ← Volver a Iniciar Sesión
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Security & Cloud Firestore Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autenticación protegida con Firebase Auth & Cloud Firestore</span>
          </p>
        </div>

      </div>
    </div>
  );
};
