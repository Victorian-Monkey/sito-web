/**
 * Client-side Turnstile utilities
 * 
 * Based on: https://dev.to/isnan__h/integrate-cloudflare-turnstile-into-astro-and-react-apps-5dl0
 * 
 * To use Turnstile in your forms:
 * 
 * 1. Add the Turnstile script to your page (or use loadTurnstileScript):
 *    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
 * 
 * 2. Add the widget to your form:
 *    <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
 * 
 * 3. Get the token before form submission:
 *    const token = getTurnstileToken();
 * 
 * 4. Include the token in your form submission as 'cf-turnstile-response'
 */

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement | string, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        size?: 'normal' | 'compact' | 'flexible';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

/**
 * Load Turnstile script dynamically
 */
export function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.turnstile) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Get Turnstile token from the widget
 * @param widgetId Optional widget ID, if not provided will search for any widget
 */
export function getTurnstileToken(widgetId?: string): string | undefined {
  if (!window.turnstile) {
    console.error('Turnstile is not loaded');
    return undefined;
  }

  if (widgetId) {
    return window.turnstile.getResponse(widgetId);
  }

  // Try to find the token from any Turnstile widget
  const widgets = document.querySelectorAll('.cf-turnstile');
  for (const widget of widgets) {
    const id = widget.getAttribute('data-widget-id');
    if (id) {
      const token = window.turnstile.getResponse(id);
      if (token) return token;
    }
  }

  return undefined;
}

/**
 * Reset Turnstile widget
 * @param widgetId Optional widget ID, if not provided will reset all widgets
 */
export function resetTurnstile(widgetId?: string): void {
  if (!window.turnstile) return;

  if (widgetId) {
    window.turnstile.reset(widgetId);
    return;
  }

  // Reset all widgets
  const widgets = document.querySelectorAll('.cf-turnstile');
  widgets.forEach((widget) => {
    const id = widget.getAttribute('data-widget-id');
    if (id) {
      window.turnstile!.reset(id);
    }
  });
}

/**
 * Render Turnstile widget programmatically
 * @param element Element or selector where to render the widget
 * @param siteKey Your Turnstile site key
 * @param options Additional options
 */
export function renderTurnstile(
  element: HTMLElement | string,
  siteKey: string,
  options?: {
    callback?: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
    size?: 'normal' | 'compact' | 'flexible';
  }
): string | undefined {
  if (!window.turnstile) {
    console.error('Turnstile is not loaded. Call loadTurnstileScript() first.');
    return undefined;
  }

  return window.turnstile.render(element, {
    sitekey: siteKey,
    ...options,
  });
}
