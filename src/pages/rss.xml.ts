import type { APIRoute } from 'astro';
import { getApiUrl, API_ENDPOINTS } from '~/config/api';

export const GET: APIRoute = async () => {
  try {
    // Fetch annunci data from API
    const response = await fetch(getApiUrl(API_ENDPOINTS.ANNUNCI));
    const annunciData = await response.json();

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${annunciData.metadata.title}</title>
    <description>${annunciData.metadata.description}</description>
    <link>${getApiBaseUrl()}</link>
    <language>it-IT</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${getApiBaseUrl()}/rss.xml" rel="self" type="application/rss+xml"/>
    
    ${annunciData.announcements.map(annuncio => `
    <item>
      <title><![CDATA[${annuncio.title}]]></title>
      <description><![CDATA[${annuncio.excerpt}]]></description>
      <link>${getApiBaseUrl()}/annunci#${annuncio.id}</link>
      <guid isPermaLink="false">${annuncio.id}</guid>
      <pubDate>${new Date(annuncio.date).toUTCString()}</pubDate>
      <category>${annunciData.categories.find(c => c.id === annuncio.category)?.name}</category>
      ${annuncio.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>`).join('')}
  </channel>
</rss>`;

    return new Response(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Error generating RSS feed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};

function getApiBaseUrl(): string {
  return import.meta.env.DEV 
    ? 'http://localhost:4321' 
    : (import.meta.env.SITE || 'https://victorianmonkey.com');
}