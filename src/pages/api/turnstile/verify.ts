import type { APIRoute } from 'astro';
import { verifyTurnstileToken } from '../../../server/turnstile';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token, 'cf-turnstile-response': turnstileResponse } = body;
    const turnstileToken = turnstileResponse || token;

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '';
    
    if (!turnstileSecret) {
      return new Response(JSON.stringify({ error: 'Turnstile is not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get client IP from request
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     '';

    const result = await verifyTurnstileToken(
      turnstileToken,
      turnstileSecret,
      clientIp || undefined
    );

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false,
        error: result.error || 'Verification failed',
        'error-codes': result['error-codes']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error verifying Turnstile token:', error);
    return new Response(JSON.stringify({ error: 'Failed to verify token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
