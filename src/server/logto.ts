import { LogtoClient } from '@logto/js';
import { logtoConfig } from '../config/logto';

export const logtoClient = new LogtoClient({
  endpoint: logtoConfig.endpoint,
  appId: logtoConfig.appId,
  appSecret: logtoConfig.appSecret,
  redirectUri: `${logtoConfig.baseUrl}/api/auth/callback`,
});

export interface LogtoUser {
  id: string;
  email?: string;
  name?: string;
  scopes?: string[];
}

export async function getLogtoUser(request: Request): Promise<LogtoUser | null> {
  try {
    const session = await logtoClient.getSession(request);
    if (!session) return null;
    
    const user = await logtoClient.fetchUserInfo(session);
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
      scopes: session.scopes || [],
    };
  } catch {
    return null;
  }
}

export async function hasScope(user: LogtoUser | null, scope: 'vm:editor' | 'vm:admin'): Promise<boolean> {
  if (!user || !user.scopes) return false;
  return user.scopes.includes(scope) || user.scopes.includes('vm:admin');
}

export async function requireAuth(request: Request): Promise<LogtoUser> {
  const user = await getLogtoUser(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireScope(
  request: Request,
  scope: 'vm:editor' | 'vm:admin'
): Promise<LogtoUser> {
  const user = await requireAuth(request);
  if (!(await hasScope(user, scope))) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return user;
}
