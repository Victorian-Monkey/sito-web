import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { contactConfiguration } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { eq, asc, and } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const active = url.searchParams.get('active');
    const contactType = url.searchParams.get('contactType');
    
    let query = db.select().from(contactConfiguration);
    const conditions = [];
    
    if (active === 'true') {
      conditions.push(eq(contactConfiguration.active, true));
    }
    if (contactType) {
      conditions.push(eq(contactConfiguration.contactType, contactType));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as any;
    }
    
    const contacts = await query.orderBy(asc(contactConfiguration.order));
    
    return new Response(JSON.stringify(contacts), {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { contactType, contactInfo, order, active } = body;
    
    if (!contactType || !contactInfo) {
      return new Response(JSON.stringify({ error: 'contactType and contactInfo are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const newContact = await db.insert(contactConfiguration).values({
      contactType,
      contactInfo,
      order: order || 0,
      active: active !== undefined ? active : true,
    });
    
    const created = await db.select()
      .from(contactConfiguration)
      .where(eq(contactConfiguration.id, newContact.insertId))
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
    console.error('Error creating contact configuration:', error);
    return new Response(JSON.stringify({ error: 'Failed to create contact configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
