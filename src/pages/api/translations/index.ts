import type { APIRoute } from 'astro';
import { db } from '@/db';
import { entityTranslations } from '@/db/schema';
import { requireScope } from '@/server/logto';
import { eq, and, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const entityType = url.searchParams.get('entityType');
    const entityId = url.searchParams.get('entityId');
    const language = url.searchParams.get('language');
    
    let query = db.select().from(entityTranslations);
    const conditions = [];
    
    if (entityType) {
      conditions.push(eq(entityTranslations.entityType, entityType));
    }
    if (entityId) {
      conditions.push(eq(entityTranslations.entityId, parseInt(entityId)));
    }
    if (language) {
      conditions.push(eq(entityTranslations.language, language));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const translations = await query.orderBy(desc(entityTranslations.createdAt));
    
    return new Response(JSON.stringify(translations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch translations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { entityType, entityId, language, field, content } = body;
    
    if (!entityType || !entityId || !language || !field || !content) {
      return new Response(JSON.stringify({ 
        error: 'entityType, entityId, language, field, and content are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Check if translation already exists
    const existing = await db.select()
      .from(entityTranslations)
      .where(
        and(
          eq(entityTranslations.entityType, entityType),
          eq(entityTranslations.entityId, entityId),
          eq(entityTranslations.language, language),
          eq(entityTranslations.field, field)
        )
      )
      .limit(1);
    
    let result;
    if (existing.length > 0) {
      // Update existing
      await db.update(entityTranslations)
        .set({ content })
        .where(eq(entityTranslations.id, existing[0].id));
      result = await db.select()
        .from(entityTranslations)
        .where(eq(entityTranslations.id, existing[0].id))
        .limit(1);
    } else {
      // Create new
      const insert = await db.insert(entityTranslations).values({
        entityType,
        entityId,
        language,
        field,
        content,
      });
      result = await db.select()
        .from(entityTranslations)
        .where(eq(entityTranslations.id, insert.insertId))
        .limit(1);
    }
    
    return new Response(JSON.stringify(result[0]), {
      status: existing.length > 0 ? 200 : 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === 'Unauthorized' ? 401 : 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error creating/updating translation:', error);
    return new Response(JSON.stringify({ error: 'Failed to save translation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
