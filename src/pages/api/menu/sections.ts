import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { menuSections } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { eq, asc } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const active = url.searchParams.get('active');
    
    let query = db.select().from(menuSections);
    
    if (active === 'true') {
      query = query.where(eq(menuSections.active, true)) as any;
    }
    
    const sections = await query.orderBy(asc(menuSections.order));
    
    return new Response(JSON.stringify(sections), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menu sections:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch menu sections' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { order, active } = body;
    
    const newSection = await db.insert(menuSections).values({
      order: order || 0,
      active: active !== undefined ? active : true,
    });
    
    const created = await db.select()
      .from(menuSections)
      .where(eq(menuSections.id, newSection.insertId))
      .limit(1);
    
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
    console.error('Error creating menu section:', error);
    return new Response(JSON.stringify({ error: 'Failed to create menu section' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
