import type { APIRoute } from 'astro';
import { db } from '@/db';
import { menuSections } from '@/db/schema';
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
    
    const section = await db.select()
      .from(menuSections)
      .where(eq(menuSections.id, parseInt(id)))
      .limit(1);
    
    if (section.length === 0) {
      return new Response(JSON.stringify({ error: 'Menu section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(section[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menu section:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch menu section' }), {
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
    const { order, active } = body;
    
    await db.update(menuSections)
      .set({
        order: order !== undefined ? order : undefined,
        active: active !== undefined ? active : undefined,
      })
      .where(eq(menuSections.id, parseInt(id)));
    
    const updated = await db.select()
      .from(menuSections)
      .where(eq(menuSections.id, parseInt(id)))
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
    console.error('Error updating menu section:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu section' }), {
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
    
    await db.delete(menuSections).where(eq(menuSections.id, parseInt(id)));
    
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
    console.error('Error deleting menu section:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete menu section' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
