// Configurazione API per gestire diversi ambienti
export const getApiBaseUrl = (): string => {
  // In sviluppo, usa localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:4321';
  }
  
  // In produzione, usa l'URL del sito o un fallback
  return import.meta.env.SITE || 'https://victorianmonkey.com';
};

export const getApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}/api/${endpoint}`;
};

// Endpoints disponibili
export const API_ENDPOINTS = {
  REGOLAMENTO: 'regolamento',
  CONTATTI: 'contatti',
  ANNUNCI: 'annunci',
  MENU: 'menu',
} as const;
