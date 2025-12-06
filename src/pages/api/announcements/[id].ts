import type { APIRoute } from 'astro';
import { db } from '@/db';
import { announcements, entityTranslations } from '@/db/schema';
import { requireScope } from '@/server/logto';
import { eq, and } from 'drizzle-orm';
import { getTranslations } from '@/utils/translations';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const url = new URL(request.url);
    const language = url.searchParams.get('language') || 'it';
    
    const announcement = await db.select()
      .from(announcements)
      .where(eq(announcements.id, parseInt(id)))
      .limit(1);
    
    if (announcement.length === 0) {
      return new Response(JSON.stringify({ error: 'Announcement not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch translations
    const translations = await getTranslations('announcement', announcement[0].id, language);
    const title = translations.title || '';
    const description = translations.description || '';
    
    return new Response(JSON.stringify({
      ...announcement[0],
      title,
      description,
      translations,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    const { category, price, images, contactInfo, published, publishedAt } = body;
    
    await db.update(announcements)
      .set({
        category: category !== undefined ? category : undefined,
        price: price !== undefined ? price : undefined,
        images: images !== undefined ? images : undefined,
        contactInfo: contactInfo !== undefined ? contactInfo : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      })
      .where(eq(announcements.id, parseInt(id)));
    
    const updated = await db.select()
      .from(announcements)
      .where(eq(announcements.id, parseInt(id)))
      .limit(1);
    
    return new Response(JSON.stringify(updated[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === 'Unauthorized' ? 401 : 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error updating announcement:', error);
    return new Response(JSON.stringify({ error: 'Failed to update announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await requireScope(request, 'vm:admin');
    
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    await db.delete(announcements).where(eq(announcements.id, parseInt(id)));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === 'Unauthorized' ? 401 : 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error deleting announcement:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
