import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Chi Siamo',
      href: getPermalink('/chi-siamo'),
    },
    {
      text: 'Menu',
      href: getPermalink('/menu'),
    },
    {
      text: 'Comunicazioni',
      href: getPermalink('/comunicazioni'),
    },
    {
      text: 'Contatti',
      href: getPermalink('/contatti'),
    },
    {
      text: 'Regolamento',
      href: getPermalink('/regolamento'),
    },
  ],
  actions: [
    { 
      text: '👑 Area Socio', 
      href: getPermalink('/contatti'), 
      variant: 'primary' 
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Contatti',
      links: [
        { text: '💬 WhatsApp', href: 'https://wa.me/393513093686?text=Ciao%20Victorian%20Monkey%2C%20vorrei%20chiedere%20', target: '_blank' },
        { text: '📞 Contattaci', href: getPermalink('/contatti') },
        { text: '📍 Dove siamo', href: 'https://maps.google.com/?q=Via+dei+Piceni+29,+Roma', target: '_blank' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: getPermalink('/privacy-policy') },
    { text: 'Regolamento', href: getPermalink('/regolamento') },
  ],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/393513093686?text=Ciao%20Victorian%20Monkey%2C%20vorrei%20chiedere%20' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/victorianmonkey' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/victorianmonkey' },
  ],
  footNote: `
    Made with ❤️ for the Victorian Monkey community · All rights reserved.
  `,
};
