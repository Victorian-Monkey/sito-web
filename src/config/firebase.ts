import { type FirebaseApp, type FirebaseOptions, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { doc, type Firestore, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    let config: FirebaseOptions = {};
    if (import.meta.env.PUBLIC_FIREBASE_API_KEY)
      config = {
        apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY as string,
        authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN as string,
        projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID as string,
        appId: import.meta.env.PUBLIC_FIREBASE_APP_ID as string,
        storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET as string | undefined,
        messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
        measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID as string | undefined,
      };

    app = getApps().length ? getApps()[0] : initializeApp(config);
  }
  return app!;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth!;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db!;
}

export async function ensureUserDocument(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}) {
  const database = getDb();
  const userRef = doc(database, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      userRef,
      {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
