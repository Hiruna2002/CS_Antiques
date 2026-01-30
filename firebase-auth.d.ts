// firebase-auth.d.ts  (place at project root)
declare module "firebase/auth" {
  // RN-only helpers
  export function initializeAuth(app: any, options?: any): any;
  export function getReactNativePersistence(storage: any): any;

  // auth lifecycle / listeners
  export function onAuthStateChanged(
    auth: any,
    cb: (user: User | null) => void,
    errorCb?: (err: any) => void,
    completed?: () => void
  ): () => void;
  export function onIdTokenChanged(auth: any, cb: (user: User | null) => void): () => void;

  // common auth actions
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function getAuth(app?: any): any;
  export function sendPasswordResetEmail(auth: any, email: string): Promise<any>;
  export function sendEmailVerification(user: User): Promise<any>;
  export function updateProfile(user: User, profile: any): Promise<any>;
  export function reload(user: User): Promise<any>;

  // Minimal User shape so `import { User } from "firebase/auth"` works
  export type User = {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    emailVerified?: boolean;
    metadata?: any;
    providerData?: any[];
    // allow indexing for any other properties the runtime user object may have
    [key: string]: any;
  };

  // fallback - allow other named exports without type errors
  export const Auth: any;
  export const UserCredential: any;
  export const UserInfo: any;
}
