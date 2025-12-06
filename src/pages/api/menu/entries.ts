import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { menuEntries } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { eq, asc, and } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sectionId = url.searchParams.get('sectionId');
    const parentId = url.searchParams.get('parentId');
    const active = url.searchParams.get('active');
    
    let query = db.select().from(menuEntries);
    const conditions = [];
    
    if (sectionId) {
      conditions.push(eq(menuEntries.sectionId, parseInt(sectionId)));
    }
    if (parentId) {
      conditions.push(eq(menuEntries.parentId, parseInt(parentId)));
    }
    if (active === 'true') {
      conditions.push(eq(menuEntries.active, true));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as any;
    }
    
    const entries = await query.orderBy(asc(menuEntries.order));
    
    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menu entries:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch menu entries' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { sectionId, parentId, link, order, active } = body;
    
    const newEntry = await db.insert(menuEntries).values({
      sectionId: sectionId ? parseInt(sectionId) : null,
      parentId: parentId ? parseInt(parentId) : null,
      link: link || null,
      order: order || 0,
      active: active !== undefined ? active : true,
    });
    
    const created = await db.select()
      .from(menuEntries)
      .where(eq(menuEntries.id, newEntry.insertId))
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
    console.error('Error creating menu entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to create menu entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
