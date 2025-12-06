// Server-side configuration for Logto
// Uses process.env since this is only used in server-side contexts
// PUBLIC_* variables are available in both import.meta.env and process.env in Astro SSR
export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT || '',
  appId: process.env.LOGTO_APP_ID || '',
  appSecret: process.env.LOGTO_APP_SECRET || '',
  baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4321',
};
