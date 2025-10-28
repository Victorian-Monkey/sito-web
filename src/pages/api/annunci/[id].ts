import type { APIRoute } from 'astro';
import annunciData from '../../data/annunci.json';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID annuncio mancante' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Cerca l'annuncio per ID
  const annuncio = annunciData.announcements.find(a => a.id === id);
  
  if (!annuncio) {
    return new Response(JSON.stringify({ error: 'Annuncio non trovato' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Restituisce l'annuncio con le categorie
  const response = {
    ...annuncio,
    categoryInfo: annunciData.categories.find(c => c.id === annuncio.category)
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=3600',
    },
  });
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
