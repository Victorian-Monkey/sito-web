import type { APIRoute } from 'astro';
import { db } from '@/db';
import { pages } from '@/db/schema';
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
    
    const page = await db.select().from(pages).where(eq(pages.id, parseInt(id))).limit(1);
    
    if (page.length === 0) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(page[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch page' }), {
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
    const { slug, template, published, publishedAt } = body;
    
    await db.update(pages)
      .set({
        slug: slug || undefined,
        template: template !== undefined ? template : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      })
      .where(eq(pages.id, parseInt(id)));
    
    const updated = await db.select().from(pages).where(eq(pages.id, parseInt(id))).limit(1);
    
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
    console.error('Error updating page:', error);
    return new Response(JSON.stringify({ error: 'Failed to update page' }), {
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
    
    await db.delete(pages).where(eq(pages.id, parseInt(id)));
    
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
    console.error('Error deleting page:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete page' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
