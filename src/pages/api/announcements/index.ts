import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { announcements, entityTranslations } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { eq, and, desc } from 'drizzle-orm';
import { getTranslations } from '../../../utils/translations';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const published = url.searchParams.get('published');
    const language = url.searchParams.get('language') || 'it';
    const category = url.searchParams.get('category');
    
    let query = db.select().from(announcements);
    const conditions = [];
    
    if (published === 'true') {
      conditions.push(eq(announcements.published, true));
    }
    if (category) {
      conditions.push(eq(announcements.category, category));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions)) as any;
    }
    
    const allAnnouncements = await query.orderBy(desc(announcements.createdAt));
    
    // Fetch translations for all announcements
    const announcementIds = allAnnouncements.map(a => a.id);
    const translations = announcementIds.length > 0
      ? await db.select()
          .from(entityTranslations)
          .where(
            and(
              eq(entityTranslations.entityType, 'announcement'),
              eq(entityTranslations.language, language)
            )
          )
      : [];
    
    // Combine announcements with translations
    const announcementsWithTranslations = allAnnouncements.map(announcement => {
      const announcementTranslations = translations.filter(t => t.entityId === announcement.id);
      const title = announcementTranslations.find(t => t.field === 'title')?.content || '';
      const description = announcementTranslations.find(t => t.field === 'description')?.content || '';
      
      return {
        ...announcement,
        title,
        description,
        translations: announcementTranslations.reduce((acc, t) => {
          acc[t.field] = t.content;
          return acc;
        }, {} as Record<string, string>),
      };
    });
    
    return new Response(JSON.stringify(announcementsWithTranslations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return new Response(JSON.stringify({ error: 'Failed to load announcements data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const body = await request.json();
    const { category, price, images, contactInfo, published, publishedAt } = body;
    
    const newAnnouncement = await db.insert(announcements).values({
      category: category || null,
      price: price || null,
      images: images || null,
      contactInfo: contactInfo || null,
      published: published || false,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    });
    
    const created = await db.select()
      .from(announcements)
      .where(eq(announcements.id, newAnnouncement.insertId))
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
    console.error('Error creating announcement:', error);
    return new Response(JSON.stringify({ error: 'Failed to create announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
