import type { APIRoute } from 'astro';
import { requireAuth } from '../../server/logto';

// Placeholder for external tesseramento API
// Replace EXTERNAL_TESSERAMENTO_API_URL with your actual external service URL
const EXTERNAL_TESSERAMENTO_API_URL = process.env.TESSERAMENTO_API_URL || '';

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await requireAuth(request);
    
    if (!EXTERNAL_TESSERAMENTO_API_URL) {
      return new Response(JSON.stringify({ error: 'Tesseramento API not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Forward request to external tesseramento API
    const response = await fetch(`${EXTERNAL_TESSERAMENTO_API_URL}/tesseramento`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch tesseramento' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error fetching tesseramento:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tesseramento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
