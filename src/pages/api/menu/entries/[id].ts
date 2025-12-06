import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { menuEntries } from '../../../../db/schema';
import { requireScope } from '../../../../server/logto';
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
    
    const entry = await db.select()
      .from(menuEntries)
      .where(eq(menuEntries.id, parseInt(id)))
      .limit(1);
    
    if (entry.length === 0) {
      return new Response(JSON.stringify({ error: 'Menu entry not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(entry[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menu entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch menu entry' }), {
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
    const { sectionId, parentId, link, order, active } = body;
    
    await db.update(menuEntries)
      .set({
        sectionId: sectionId !== undefined ? (sectionId ? parseInt(sectionId) : null) : undefined,
        parentId: parentId !== undefined ? (parentId ? parseInt(parentId) : null) : undefined,
        link: link !== undefined ? link : undefined,
        order: order !== undefined ? order : undefined,
        active: active !== undefined ? active : undefined,
      })
      .where(eq(menuEntries.id, parseInt(id)));
    
    const updated = await db.select()
      .from(menuEntries)
      .where(eq(menuEntries.id, parseInt(id)))
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
    console.error('Error updating menu entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu entry' }), {
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
    
    await db.delete(menuEntries).where(eq(menuEntries.id, parseInt(id)));
    
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
    console.error('Error deleting menu entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete menu entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
