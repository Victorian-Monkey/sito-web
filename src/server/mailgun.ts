import formData from 'form-data';
import Mailgun from 'mailgun.js';

export interface MailgunConfig {
  apiKey: string;
  domain: string;
  fromEmail: string;
  fromName?: string;
}

export function getMailgunClient(config: MailgunConfig) {
  const mailgunClient = new Mailgun(formData);
  return mailgunClient.client({
    username: 'api',
    key: config.apiKey,
  });
}

export async function sendContactEmail(
  config: MailgunConfig,
  to: string,
  subject: string,
  data: {
    name: string;
    email: string;
    phone?: string | null;
    message?: string | null;
  }
): Promise<void> {
  const mg = getMailgunClient(config);
  
  const html = `
    <h2>Nuovo messaggio di contatto</h2>
    <p><strong>Nome:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Telefono:</strong> ${data.phone}</p>` : ''}
    ${data.message ? `<p><strong>Messaggio:</strong></p><p>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
    <hr>
    <p><small>Inviato il ${new Date().toLocaleString('it-IT')}</small></p>
  `;

  const text = `
Nuovo messaggio di contatto

Nome: ${data.name}
Email: ${data.email}
${data.phone ? `Telefono: ${data.phone}` : ''}
${data.message ? `\nMessaggio:\n${data.message}` : ''}

Inviato il ${new Date().toLocaleString('it-IT')}
  `;

  await mg.messages.create(config.domain, {
    from: config.fromName 
      ? `${config.fromName} <${config.fromEmail}>`
      : config.fromEmail,
    to: [to],
    subject,
    text,
    html,
  });
}
