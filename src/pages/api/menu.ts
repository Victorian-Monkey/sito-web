import type { APIRoute } from 'astro';
import { db } from '../../db';
import { menuEntries, menuSections, entityTranslations } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const language = url.searchParams.get('language') || 'it';
    const active = url.searchParams.get('active') !== 'false';
    
    // Fetch menu sections
    let sectionsQuery = db.select().from(menuSections);
    if (active) {
      sectionsQuery = sectionsQuery.where(eq(menuSections.active, true)) as any;
    }
    const sections = await sectionsQuery.orderBy(asc(menuSections.order));
    
    // Fetch menu entries
    let entriesQuery = db.select().from(menuEntries);
    if (active) {
      entriesQuery = entriesQuery.where(eq(menuEntries.active, true)) as any;
    }
    const entries = await entriesQuery.orderBy(asc(menuEntries.order));
    
    // Fetch translations for sections
    const sectionIds = sections.map(s => s.id);
    const sectionTranslations = sectionIds.length > 0
      ? await db.select()
          .from(entityTranslations)
          .where(
            and(
              eq(entityTranslations.entityType, 'menu_section'),
              eq(entityTranslations.language, language)
            )
          )
      : [];
    
    // Fetch translations for entries
    const entryIds = entries.map(e => e.id);
    const entryTranslations = entryIds.length > 0
      ? await db.select()
          .from(entityTranslations)
          .where(
            and(
              eq(entityTranslations.entityType, 'menu_entry'),
              eq(entityTranslations.language, language)
            )
          )
      : [];
    
    // Combine sections with translations
    const sectionsWithTranslations = sections.map(section => {
      const translations = sectionTranslations.filter(t => t.entityId === section.id);
      const title = translations.find(t => t.field === 'title')?.content || '';
      return {
        ...section,
        title,
        translations: translations.reduce((acc, t) => {
          acc[t.field] = t.content;
          return acc;
        }, {} as Record<string, string>),
      };
    });
    
    // Combine entries with translations
    const entriesWithTranslations = entries.map(entry => {
      const translations = entryTranslations.filter(t => t.entityId === entry.id);
      const label = translations.find(t => t.field === 'label')?.content || '';
      return {
        ...entry,
        label,
        translations: translations.reduce((acc, t) => {
          acc[t.field] = t.content;
          return acc;
        }, {} as Record<string, string>),
      };
    });
    
    return new Response(JSON.stringify({
      sections: sectionsWithTranslations,
      entries: entriesWithTranslations,
    }), {
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
    console.error('Error fetching menu:', error);
    return new Response(JSON.stringify({ error: 'Failed to load menu data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
