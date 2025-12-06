import type { APIRoute } from 'astro';
import { logtoClient } from '../../../server/logto';

export const GET: APIRoute = async ({ request }) => {
  try {
    await logtoClient.signOut(request);
    return Response.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error during logout:', error);
    return Response.redirect(new URL('/', request.url));
  }
};
