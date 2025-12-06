import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { pages } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const published = url.searchParams.get('published');
    
    let query = db.select().from(pages);
    
    if (published === 'true') {
      query = query.where(eq(pages.published, true)) as any;
    }
    
    const allPages = await query.orderBy(desc(pages.createdAt));
    
    return new Response(JSON.stringify(allPages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { slug, template, published, publishedAt } = body;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const newPage = await db.insert(pages).values({
      slug,
      template: template || null,
      published: published || false,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    });
    
    const created = await db.select().from(pages).where(eq(pages.id, newPage.insertId)).limit(1);
    
    return new Response(JSON.stringify(created[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === 'Unauthorized' ? 401 : 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error creating page:', error);
    return new Response(JSON.stringify({ error: 'Failed to create page' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
