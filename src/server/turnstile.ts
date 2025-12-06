const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
  'error-codes'?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  try {
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return {
        success: false,
        error: 'Server configuration error.',
        'error-codes': ['missing-input-secret'],
      };
    }

    if (!token) {
      return {
        success: false,
        error: 'Token is required',
        'error-codes': ['missing-input-response'],
      };
    }

    const body: Record<string, string> = {
      secret: secretKey,
      response: token,
    };

    if (remoteIp) {
      body.remoteip = remoteIp;
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Turnstile service unavailable',
        'error-codes': ['service-unavailable'],
      };
    }

    const result = await response.json() as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (!result.success) {
      console.error('Turnstile verification failed:', result['error-codes']);
      return {
        success: false,
        error: 'Verification failed. Please try again.',
        'error-codes': result['error-codes'] || ['unknown-error'],
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify token',
      'error-codes': ['internal-error'],
    };
  }
}
