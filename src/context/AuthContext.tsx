import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  FirebaseUser
} from '../lib/firebase';
import { UserProfile, UserCargo } from '../types';
import { userService } from '../services/firestoreService';

interface SignUpData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  cargo: UserCargo;
  empresa: string;
  fotoPerfil?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  clearAuthError: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_GUEST_PROFILE: UserProfile = {
  uid: 'residente-principal',
  nombre: 'Ingeniero',
  apellido: 'Residente',
  email: 'residente.obra@constructora.com',
  telefono: '+51 987 654 321',
  cargo: 'Residente de obra',
  empresa: 'Constructora e Inmobiliaria',
  estado: 'activo',
  fechaRegistro: new Date().toISOString(),
  ultimaConexion: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(DEFAULT_GUEST_PROFILE);
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Helper to translate Firebase Auth errors to user-friendly Spanish messages
  const parseAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/operation-not-allowed':
        return 'El proveedor de inicio de sesión con Correo/Contraseña está inactivo en Firebase Console. Actívalo en Authentication > Sign-in method > Correo electrónico / Contraseña.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo electrónico o contraseña incorrectos. Verifica tus credenciales.';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado. Por favor inicia sesión.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener como mínimo 6 caracteres.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico ingresado no es válido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde por seguridad.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido inhabilitada. Contacta al administrador.';
      default:
        return err?.message || 'Ocurrió un error en el servicio de autenticación.';
    }
  };

  const clearAuthError = () => setAuthError(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore 'usuarios' collection
          let profile = await userService.getUserProfile(user.uid);
          
          if (profile) {
            setUserProfile(profile);
            // Update last connection time
            await userService.updateUserLastConnection(user.uid);
          } else {
            // If profile does not exist yet (e.g. legacy or freshly created in Auth without Firestore hook), create a default profile
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              nombre: user.displayName?.split(' ')[0] || 'Usuario',
              apellido: user.displayName?.split(' ').slice(1).join(' ') || 'Obra',
              email: user.email || '',
              telefono: '',
              cargo: 'Usuario',
              empresa: 'Constructora Principal',
              estado: 'activo',
              fechaRegistro: new Date().toISOString(),
              ultimaConexion: new Date().toISOString()
            };
            await userService.saveUserProfile(fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        } catch (err) {
          console.error('[AuthContext] Error loading user profile:', err);
        }
      } else {
        setUserProfile(DEFAULT_GUEST_PROFILE);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await userService.getUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (e) {
      console.warn('Error refreshing profile:', e);
    }
  };

  // Sign In with email & password
  const signIn = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = credential.user;
      
      // Update last connection and load profile
      let profile = await userService.getUserProfile(user.uid);
      if (profile) {
        await userService.updateUserLastConnection(user.uid);
        setUserProfile(profile);
      }
    } catch (err: any) {
      const message = parseAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Sign Up with user profile creation in Firestore
  const signUp = async (data: SignUpData) => {
    setAuthError(null);
    try {
      // 1. Create auth user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      const user = userCredential.user;

      // 2. Set Firebase Auth displayName
      const fullName = `${data.nombre.trim()} ${data.apellido.trim()}`.trim();
      await fbUpdateProfile(user, {
        displayName: fullName
      });

      // 3. Create user document in Cloud Firestore 'usuarios' collection with exact UID
      const newProfile: UserProfile = {
        uid: user.uid,
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono.trim(),
        cargo: data.cargo,
        empresa: data.empresa.trim(),
        fotoPerfil: data.fotoPerfil || '',
        estado: 'activo',
        fechaRegistro: new Date().toISOString(),
        ultimaConexion: new Date().toISOString()
      };

      await userService.saveUserProfile(newProfile);
      setUserProfile(newProfile);
      setCurrentUser(user);
    } catch (err: any) {
      const message = parseAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    try {
      if (currentUser) {
        await fbSignOut(auth);
      }
      setCurrentUser(null);
      setUserProfile(DEFAULT_GUEST_PROFILE);
    } catch (err: any) {
      const message = parseAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const message = parseAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Update Profile in Firestore
  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!userProfile) {
      throw new Error('No hay una sesión de usuario activa.');
    }

    try {
      if (currentUser) {
        await userService.updateUserProfile(currentUser.uid, updates);
        
        // Update Firebase Auth displayName if nombre/apellido changed
        if (updates.nombre || updates.apellido) {
          const n = updates.nombre || userProfile.nombre;
          const a = updates.apellido || userProfile.apellido;
          await fbUpdateProfile(currentUser, {
            displayName: `${n} ${a}`.trim()
          });
        }
      }

      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: any) {
      console.error('[AuthContext] Error updating profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authError,
        signIn,
        signUp,
        logout,
        resetPassword,
        updateProfileData,
        clearAuthError,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
