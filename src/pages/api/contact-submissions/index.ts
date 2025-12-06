import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { contactSubmissions } from '../../../db/schema';
import { requireScope } from '../../../server/logto';
import { desc } from 'drizzle-orm';
import { sendContactEmail } from '../../../server/mailgun';
import { verifyTurnstileToken } from '../../../server/turnstile';

// Get configuration from environment variables
const getMailgunConfig = () => {
  const apiKey = process.env.MAILGUN_API_KEY || '';
  const domain = process.env.MAILGUN_DOMAIN || '';
  const fromEmail = process.env.MAILGUN_FROM_EMAIL || 'noreply@victorianmonkey.it';
  const fromName = process.env.MAILGUN_FROM_NAME || 'Victorian Monkey';
  const toEmail = process.env.MAILGUN_TO_EMAIL || process.env.MAILGUN_FROM_EMAIL || '';

  if (!apiKey || !domain || !toEmail) {
    throw new Error('Mailgun configuration is incomplete');
  }

  return {
    apiKey,
    domain,
    fromEmail,
    fromName,
    toEmail,
  };
};

const getTurnstileSecret = () => {
  return process.env.TURNSTILE_SECRET_KEY || '';
};

export const GET: APIRoute = async ({ request }) => {
  try {
    await requireScope(request, 'vm:editor');
    
    const allSubmissions = await db.select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
    
    return new Response(JSON.stringify(allSubmissions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === 'Unauthorized' ? 401 : 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Error fetching contact submissions:', error);
    return new Response(JSON.stringify({ error: 'Failed to load contact submissions' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, message, 'cf-turnstile-response': turnstileToken } = body;
    
    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate Turnstile token
    const turnstileSecret = getTurnstileSecret();
    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: 'Turnstile token is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get client IP from request
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                       request.headers.get('x-real-ip') ||
                       '';

      const turnstileResult = await verifyTurnstileToken(
        turnstileToken,
        turnstileSecret,
        clientIp || undefined
      );

      if (!turnstileResult.success) {
        return new Response(JSON.stringify({ 
          error: turnstileResult.error || 'Turnstile verification failed',
          'error-codes': turnstileResult['error-codes']
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Save to database
    const newSubmission = await db.insert(contactSubmissions).values({
      name,
      email,
      phone: phone || null,
      message: message || null,
    });

    // Send email via Mailgun
    try {
      const mailgunConfig = getMailgunConfig();
      await sendContactEmail(
        mailgunConfig,
        mailgunConfig.toEmail,
        `Nuovo messaggio di contatto da ${name}`,
        {
          name,
          email,
          phone: phone || null,
          message: message || null,
        }
      );
    } catch (emailError: any) {
      // Log email error but don't fail the request
      console.error('Error sending email via Mailgun:', emailError);
      // Still return success since the submission was saved to the database
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      id: newSubmission.insertId,
      message: 'Your message has been sent successfully'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error creating contact submission:', error);
    
    // Handle Mailgun configuration errors
    if (error.message?.includes('Mailgun configuration')) {
      return new Response(JSON.stringify({ 
        error: 'Email service is not configured properly' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to create contact submission' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
