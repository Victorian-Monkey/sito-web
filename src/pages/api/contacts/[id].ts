import type { APIRoute } from 'astro';
import { db } from '@/db';
import { contactConfiguration } from '@/db/schema';
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
    
    const contact = await db.select()
      .from(contactConfiguration)
      .where(eq(contactConfiguration.id, parseInt(id)))
      .limit(1);
    
    if (contact.length === 0) {
      return new Response(JSON.stringify({ error: 'Contact configuration not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(contact[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching contact configuration:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch contact configuration' }), {
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
    const { contactType, contactInfo, order, active } = body;
    
    await db.update(contactConfiguration)
      .set({
        contactType: contactType || undefined,
        contactInfo: contactInfo || undefined,
        order: order !== undefined ? order : undefined,
        active: active !== undefined ? active : undefined,
      })
      .where(eq(contactConfiguration.id, parseInt(id)));
    
    const updated = await db.select()
      .from(contactConfiguration)
      .where(eq(contactConfiguration.id, parseInt(id)))
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
    console.error('Error updating contact configuration:', error);
    return new Response(JSON.stringify({ error: 'Failed to update contact configuration' }), {
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
    
    await db.delete(contactConfiguration).where(eq(contactConfiguration.id, parseInt(id)));
    
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
    console.error('Error deleting contact configuration:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete contact configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
