import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

function getPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY || process.env.PRIVATE_KEY;
  return raw ? raw.replace(/\\n/g, '\n') : undefined;
}

export function getFirebaseAdminApp() {
  if (!getApps().length) {
    // 1. Prova con service account JSON file (sviluppo locale)
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccountPath) {
      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        initializeApp({
          credential: cert(serviceAccount),
        });
        return getApps()[0];
      } catch (error) {
        console.error('Error loading service account from file:', error);
      }
    }

    // 2. Prova con variabili d'ambiente separate
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = getPrivateKey();

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
      // 3. Fallback: usa applicationDefault() (Firebase App Hosting)
      initializeApp({ credential: applicationDefault() });
    }
  }
  return getApps()[0];
}

export const adminAuth = () => getAuth(getFirebaseAdminApp());
export const adminDb = () => getFirestore(getFirebaseAdminApp());


