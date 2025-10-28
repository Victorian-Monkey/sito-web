// Hook personalizzato per utilizzare l'API dei contatti
// Questo può essere usato da app React/Next.js o altri framework

export interface ContattiData {
  metadata: {
    title: string;
    description: string;
    lastUpdated: string;
    version: string;
  };
  address: {
    street: string;
    neighborhood: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  socialMedia: Array<{
    platform: string;
    url: string | null;
  }>;
  openingHours: Array<{
    type: string;
    days: string[];
    hours: {
      open: string;
      close: string;
    };
  }>;
  transport: {
    metro: {
      line: string;
      station: string;
      walkingTime: string;
    };
    bus: Array<{
      lines: string[];
      stop: string;
    }>;
    parking: Array<{
      type: string;
      description: string;
    }>;
  };
}

export class ContattiAPI {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.getDefaultBaseUrl();
  }

  private getDefaultBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback per SSR
    return 'https://victorianmonkey.com';
  }

  async getContatti(): Promise<ContattiData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/contatti`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento dei contatti:', error);
      throw error;
    }
  }
}

// Esempio di utilizzo per React/Next.js
export const useContatti = (baseUrl?: string) => {
  const api = new ContattiAPI(baseUrl);
  
  return {
    getContatti: () => api.getContatti(),
  };
};

// Esempio di utilizzo per vanilla JavaScript
export const createContattiClient = (baseUrl?: string) => {
  return new ContattiAPI(baseUrl);
};
