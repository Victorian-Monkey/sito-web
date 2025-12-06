import type { APIRoute } from 'astro';
import { getLogtoUser, logtoClient } from '../../server/logto';

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getLogtoUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch full user info from Logto
    const session = await logtoClient.getSession(request);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userInfo = await logtoClient.fetchUserInfo(session);
    
    return new Response(JSON.stringify({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      username: userInfo.username,
      picture: userInfo.picture,
      scopes: user.scopes || [],
      customData: userInfo.customData || {},
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
