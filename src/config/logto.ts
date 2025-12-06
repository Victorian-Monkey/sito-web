import * as dotenv from 'dotenv';

dotenv.config();

export const logtoConfig = {
  endpoint: import.meta.env.LOGTO_ENDPOINT || process.env.LOGTO_ENDPOINT || '',
  appId: import.meta.env.LOGTO_APP_ID || process.env.LOGTO_APP_ID || '',
  appSecret: import.meta.env.LOGTO_APP_SECRET || process.env.LOGTO_APP_SECRET || '',
  baseUrl: import.meta.env.PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL || 'http://localhost:4321',
};
