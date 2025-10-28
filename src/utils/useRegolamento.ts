// Hook personalizzato per utilizzare l'API del regolamento
// Questo può essere usato da app React/Next.js o altri framework

export interface RegolamentoData {
  metadata: {
    title: string;
    description: string;
    lastUpdated: string;
    version: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  rules: Array<{
    id: string;
    number: number;
    title: string;
    icon: string;
    iconColor: string;
    content: string[];
    highlight?: string;
    note?: string;
    special?: boolean;
  }>;
  cta: {
    title: string;
    description: string;
    buttons: Array<{
      text: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
  };
}

export class RegolamentoAPI {
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

  async getRegolamento(): Promise<RegolamentoData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/regolamento`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento del regolamento:', error);
      throw error;
    }
  }

}

// Esempio di utilizzo per React/Next.js
export const useRegolamento = (baseUrl?: string) => {
  const api = new RegolamentoAPI(baseUrl);
  
  return {
    getRegolamento: () => api.getRegolamento(),
  };
};

// Esempio di utilizzo per vanilla JavaScript
export const createRegolamentoClient = (baseUrl?: string) => {
  return new RegolamentoAPI(baseUrl);
};
