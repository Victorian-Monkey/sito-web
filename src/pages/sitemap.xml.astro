---
import { getApiUrl, API_ENDPOINTS } from '~/config/api';

// Fetch data for dynamic routes
const annunciResponse = await fetch(getApiUrl(API_ENDPOINTS.ANNUNCI));
const annunciData = await annunciResponse.json();

const site = 'https://victorianmonkey.it';
const lastmod = new Date().toISOString();

// Static pages
const staticPages = [
  {
    url: '',
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    url: '/chi-siamo',
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: '/menu',
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    url: '/comunicazioni',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    url: '/contatti',
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    url: '/regolamento',
    changefreq: 'yearly',
    priority: '0.5'
  },
  {
    url: '/privacy-policy',
    changefreq: 'yearly',
    priority: '0.3'
  },
  {
    url: '/termini-servizio',
    changefreq: 'yearly',
    priority: '0.3'
  }
];

// Dynamic pages (annunci)
const dynamicPages = annunciData.announcements.map((annuncio: any) => ({
  url: `/comunicazioni/${annuncio.id}`,
  changefreq: 'weekly',
  priority: '0.6',
  lastmod: annuncio.date
}));

const allPages = [...staticPages, ...dynamicPages];
---

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {allPages.map((page) => (
    <url>
      <loc>{site}{page.url}</loc>
      <lastmod>{page.lastmod || lastmod}</lastmod>
      <changefreq>{page.changefreq}</changefreq>
      <priority>{page.priority}</priority>
    </url>
  ))}
</urlset>
