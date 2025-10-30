import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '~/server/firebaseAdmin';

async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const decoded = await getUserFromRequest(request);
  if (!decoded) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = adminDb();
  const userRef = db.collection('users').doc(decoded.uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    const profile = {
      uid: decoded.uid,
      email: decoded.email || null,
      displayName: decoded.name || null,
      photoURL: decoded.picture || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userRef.set(profile, { merge: true });
    return new Response(JSON.stringify(profile), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const data = snap.data();
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request }) => {
  const decoded = await getUserFromRequest(request);
  if (!decoded) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const allowed: Record<string, unknown> = {};

  const allowedFields = [
    'nome',
    'cognome',
    'email',
    'telefono',
    'sesso_assegnato',
    'nome_elezione',
    'codice_fiscale',
    'no_codice_fiscale',
    'displayName',
    'photoURL',
  ];
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      allowed[key] = body[key];
    }
  }

  const db = adminDb();
  const userRef = db.collection('users').doc(decoded.uid);
  const payload = { ...allowed, uid: decoded.uid, updatedAt: new Date() };
  await userRef.set(payload, { merge: true });
  const saved = await userRef.get();
  return new Response(JSON.stringify(saved.data()), { status: 200, headers: { 'Content-Type': 'application/json' } });
};


