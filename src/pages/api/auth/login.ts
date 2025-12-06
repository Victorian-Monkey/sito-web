import type { APIRoute } from 'astro';
import { logtoClient } from '../../../server/logto';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Request scopes for editor and admin roles
    const url = await logtoClient.getAuthorizationUrl(request, {
      scopes: ['openid', 'profile', 'email', 'vm:editor', 'vm:admin'],
    });
    return Response.redirect(url.toString());
  } catch (error) {
    console.error('Error generating login URL:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate login URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
