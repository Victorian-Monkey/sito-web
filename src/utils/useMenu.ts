// Hook personalizzato per utilizzare l'API del menu
// Questo può essere usato da app React/Next.js o altri framework

export interface MenuItem {
  name: string;
  price: number;
  description: string;
}

export interface MenuSubsection {
  title: string;
  type: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  subsections: MenuSubsection[];
}

export type MenuData = MenuSection[];

export class MenuAPI {
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

  async getMenu(): Promise<MenuData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/menu`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento del menu:', error);
      throw error;
    }
  }

  // Helper per cercare elementi nel menu
  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const menu = await this.getMenu();
    const allItems: MenuItem[] = [];
    
    menu.forEach(section => {
      section.subsections.forEach(subsection => {
        allItems.push(...subsection.items);
      });
    });
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Helper per ottenere elementi per tipo
  async getItemsByType(type: string): Promise<MenuItem[]> {
    const menu = await this.getMenu();
    const allItems: MenuItem[] = [];
    
    menu.forEach(section => {
      section.subsections.forEach(subsection => {
        if (subsection.type === type) {
          allItems.push(...subsection.items);
        }
      });
    });
    
    return allItems;
  }

  // Helper per ottenere sottosezioni per tipo
  async getSubsectionsByType(type: string): Promise<MenuSubsection[]> {
    const menu = await this.getMenu();
    const subsections: MenuSubsection[] = [];
    
    menu.forEach(section => {
      section.subsections.forEach(subsection => {
        if (subsection.type === type) {
          subsections.push(subsection);
        }
      });
    });
    
    return subsections;
  }

  // Helper per ottenere tutti i tipi disponibili
  async getAvailableTypes(): Promise<string[]> {
    const menu = await this.getMenu();
    const types = new Set<string>();
    
    menu.forEach(section => {
      section.subsections.forEach(subsection => {
        types.add(subsection.type);
      });
    });
    
    return Array.from(types);
  }
}

// Esempio di utilizzo per React/Next.js
export const useMenu = (baseUrl?: string) => {
  const api = new MenuAPI(baseUrl);
  
  return {
    getMenu: () => api.getMenu(),
    searchMenuItems: (query: string) => api.searchMenuItems(query),
    getItemsByCategory: (category: string) => api.getItemsByCategory(category),
    getItemsByType: (type: string) => api.getItemsByType(type),
    getSubsectionsByType: (type: string) => api.getSubsectionsByType(type),
    getAvailableTypes: () => api.getAvailableTypes(),
  };
};

// Esempio di utilizzo per vanilla JavaScript
export const createMenuClient = (baseUrl?: string) => {
  return new MenuAPI(baseUrl);
};
