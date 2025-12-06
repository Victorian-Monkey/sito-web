import type { APIRoute } from 'astro';
import { logtoClient } from '../../../server/logto';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Request only basic scopes at login
    // Logto will grant additional scopes (vm:editor, vm:admin) based on user's actual permissions
    // This maintains proper role-based access control
    const url = await logtoClient.getAuthorizationUrl(request, {
      scopes: ['openid', 'profile', 'email'],
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
