import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  QrCode, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Wifi, 
  HardHat, 
  Terminal, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  Laptop,
  AlertCircle
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'apk-builder' | 'qr-share' | 'cli'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if running on Android
    const ua = navigator.userAgent || navigator.vendor;
    setIsAndroid(/android/i.test(ua));

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://controldeobra.app';

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback message for instructions
      setActiveTab('android');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedCommand(type);
      setTimeout(() => setCopiedCommand(null), 2500);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`👷‍♂️ Instala la aplicación *Control de Obra* en tu celular Android:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Instalar Aplicación / APK Móvil</h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Android Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Control de Obra en tu teléfono o tablet para supervisión en terreno</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'android'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalación Directa Android</span>
          </button>

          <button
            onClick={() => setActiveTab('apk-builder')}
            className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'apk-builder'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Generar Paquete APK (.apk)</span>
          </button>

          <button
            onClick={() => setActiveTab('qr-share')}
            className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'qr-share'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR / Enviar</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cli'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Capacitor / Código</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: Instalación Directa Android */}
          {activeTab === 'android' && (
            <div className="space-y-5">
              {/* Native Prompt Banner or Installed Status */}
              {isInstalled ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-200">¡Aplicación instalada y en modo standalone!</h4>
                    <p className="text-xs text-emerald-400/80">Estás ejecutando Control de Obra como una aplicación independiente.</p>
                  </div>
                </div>
              ) : deferredPrompt ? (
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-transparent border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Instalador 1-Clic Detectado</h4>
                      <p className="text-xs text-slate-300">Tu navegador permite instalar la app como APK nativo en tu dispositivo ahora.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>INSTALAR AHORA</span>
                  </button>
                </div>
              ) : null}

              {/* Guía Visual Paso a Paso para Android */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Cómo instalar en cualquier celular o tablet Android:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                      1
                    </div>
                    <h4 className="font-bold text-xs text-slate-200">Abre en Google Chrome</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Abre este enlace desde el navegador Google Chrome o Samsung Internet en tu celular.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                      2
                    </div>
                    <h4 className="font-bold text-xs text-slate-200">Toca el Menú (⋮)</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Presiona los 3 puntos en la esquina superior derecha del navegador y selecciona <strong className="text-white font-semibold">"Instalar aplicación"</strong> o <strong className="text-white font-semibold">"Agregar a pantalla principal"</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                      3
                    </div>
                    <h4 className="font-bold text-xs text-slate-200">Icono APK Listo</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Android generará el icono oficial con el casco de obra en tu pantalla de inicio y se abrirá a pantalla completa sin barra web.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventajas para supervisión en obra */}
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2.5">
                <h4 className="font-semibold text-xs text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Beneficios de la versión instalada para Residentes y Supervisores:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Apertura instantánea desde el escritorio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Cámara y fotos de evidencias directas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Persistencia de sesión con Firebase Auth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Sincronización en la nube con Firestore</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Generar Paquete APK (.apk) */}
          {activeTab === 'apk-builder' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Download className="w-4 h-4" />
                  <span>Generar archivo APK instalable (.apk) con PWABuilder (Recomendado)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Puedes empaquetar esta aplicación en un archivo <strong className="text-amber-300">APK nativo de Android</strong> firmado utilizando el generador oficial de Microsoft / Google PWABuilder:
                </p>
              </div>

              <div className="space-y-3 bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
                <h4 className="font-bold text-xs text-slate-200">Pasos para descargar tu archivo .apk:</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                  <li>
                    Copia la dirección web de tu aplicación:
                    <div className="mt-1.5 flex items-center space-x-2 bg-slate-900 border border-slate-750 p-2 rounded-lg font-mono text-[11px] text-amber-400">
                      <span className="truncate flex-1">{currentUrl}</span>
                      <button
                        onClick={() => copyToClipboard(currentUrl, 'link')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1 px-2 shrink-0"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedLink ? 'Copiado' : 'Copiar URL'}</span>
                      </button>
                    </div>
                  </li>
                  <li>
                    Ingresa a <strong className="text-white">PWABuilder.com</strong> (herramienta gratuita de Google/Microsoft para exportar APKs).
                  </li>
                  <li>
                    Pega la URL y haz clic en <strong className="text-amber-300">"Package for Android"</strong> para descargar tu archivo <strong className="text-amber-300">.apk</strong> o <strong className="text-amber-300">.aab</strong>.
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                  >
                    <span>Abrir PWABuilder con mi URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Bubblewrap / TWA alternative */}
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-200 font-bold">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Método 2: Compilación con Bubblewrap CLI de Google</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Si tienes Node.js y Android SDK instalado en tu PC, puedes generar el APK mediante consola con un comando:
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                  <code>npx @bubblewrap/cli init --manifest={currentUrl}/manifest.json</code>
                  <button
                    onClick={() => copyToClipboard(`npx @bubblewrap/cli init --manifest=${currentUrl}/manifest.json`, 'bubblewrap')}
                    className="text-slate-400 hover:text-white ml-2 p-1"
                  >
                    {copiedCommand === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Escanear QR / Compartir */}
          {activeTab === 'qr-share' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 flex flex-col items-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=0f172a&margin=6`}
                    alt="Código QR para instalar en Android"
                    className="w-36 h-36 rounded-lg"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-bold text-slate-800 mt-1">Escanear con Cámara</span>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <h3 className="font-bold text-white text-base">Abre la app en tu teléfono al instante</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Apunta la cámara de tu móvil al código QR para abrir e instalar Control de Obra de inmediato.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      onClick={shareViaWhatsApp}
                      className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-md transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Enviar por WhatsApp</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(currentUrl, 'link')}
                      className="inline-flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs px-3.5 py-2 rounded-lg border border-slate-600 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-xs text-slate-400">
                <p>
                  <strong className="text-slate-200">Recomendación para equipo de campo:</strong> Envía este enlace por WhatsApp a los maestros de obra, topógrafos y asistentes para que todos tengan acceso directo a registrar reportes de avance y fotos desde cualquier frente de trabajo.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Capacitor / Android Studio */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <Laptop className="w-4 h-4" />
                  <span>Empaquetar como proyecto nativo con Capacitor & Android Studio:</span>
                </div>
                <p className="text-xs text-slate-300">
                  Si deseas generar un APK binario firmado para subir a Google Play Store o distribuir en tu empresa, puedes usar Capacitor:
                </p>

                <div className="space-y-2">
                  <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <code>npm install @capacitor/core @capacitor/cli @capacitor/android</code>
                    <button
                      onClick={() => copyToClipboard('npm install @capacitor/core @capacitor/cli @capacitor/android', 'cap1')}
                      className="text-slate-400 hover:text-white ml-2 p-1"
                    >
                      {copiedCommand === 'cap1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <code>npx cap init "Control de Obra" "com.controldeobra.app" --web-dir dist</code>
                    <button
                      onClick={() => copyToClipboard('npx cap init "Control de Obra" "com.controldeobra.app" --web-dir dist', 'cap2')}
                      className="text-slate-400 hover:text-white ml-2 p-1"
                    >
                      {copiedCommand === 'cap2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <code>npm run build && npx cap add android && npx cap open android</code>
                    <button
                      onClick={() => copyToClipboard('npm run build && npx cap add android && npx cap open android', 'cap3')}
                      className="text-slate-400 hover:text-white ml-2 p-1"
                    >
                      {copiedCommand === 'cap3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-xs text-slate-400">
                <p>
                  En Android Studio ve a <strong className="text-white">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> para generar el archivo <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">app-debug.apk</code> o <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">app-release.apk</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PWA & WebAPK con soporte offline y Firebase</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cerrar
            </button>
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
