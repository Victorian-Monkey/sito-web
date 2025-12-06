import type { APIRoute } from 'astro';
import { logtoClient } from '../../../server/logto';

export const GET: APIRoute = async ({ request }) => {
  try {
    await logtoClient.handleSignInCallback(request);
    return Response.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error handling callback:', error);
    return Response.redirect(new URL('/tana/login?error=auth_failed', request.url));
  }
};
