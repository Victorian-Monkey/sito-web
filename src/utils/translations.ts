import { db } from '../db';
import { entityTranslations } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function getTranslations(
  entityType: string,
  entityId: number,
  language: string = 'it'
): Promise<Record<string, string>> {
  const translations = await db.select()
    .from(entityTranslations)
    .where(
      and(
        eq(entityTranslations.entityType, entityType),
        eq(entityTranslations.entityId, entityId),
        eq(entityTranslations.language, language)
      )
    );
  
  return translations.reduce((acc, t) => {
    acc[t.field] = t.content;
    return acc;
  }, {} as Record<string, string>);
}

export async function getTranslation(
  entityType: string,
  entityId: number,
  field: string,
  language: string = 'it'
): Promise<string | null> {
  const translations = await getTranslations(entityType, entityId, language);
  return translations[field] || null;
}
