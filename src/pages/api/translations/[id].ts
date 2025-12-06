import type { APIRoute } from 'astro';
import { db } from '@/db';
import { entityTranslations } from '@/db/schema';
import { requireScope } from '@/server/logto';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const translation = await db.select()
      .from(entityTranslations)
      .where(eq(entityTranslations.id, parseInt(id)))
      .limit(1);
    
    if (translation.length === 0) {
      return new Response(JSON.stringify({ error: 'Translation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(translation[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching translation:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch translation' }), {
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
    const { content, language, field } = body;
    
    await db.update(entityTranslations)
      .set({
        content: content || undefined,
        language: language || undefined,
        field: field || undefined,
      })
      .where(eq(entityTranslations.id, parseInt(id)));
    
    const updated = await db.select()
      .from(entityTranslations)
      .where(eq(entityTranslations.id, parseInt(id)))
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
    console.error('Error updating translation:', error);
    return new Response(JSON.stringify({ error: 'Failed to update translation' }), {
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
    
    await db.delete(entityTranslations).where(eq(entityTranslations.id, parseInt(id)));
    
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
    console.error('Error deleting translation:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete translation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
