# 🐒 Victorian Monkey Website

🌟 _Il sito web ufficiale del Victorian Monkey - La Tana dei Nerd_. 🌟

**Victorian Monkey** è il sito web ufficiale della community "La Tana dei Nerd", costruito con **[Astro 5.0](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) + [Firebase](https://firebase.google.com/)**. Un'esperienza moderna e performante per la community.

> 🎲 **Sviluppato gratuitamente da [Vicedomini Softworks](https://vicedomini.ltd)** per supportare la causa di diffusione dei giochi da tavolo e ritorno ad una vita più lenta e coesa, dal vivo.

- ✅ **Performance ottimale** con punteggi eccellenti in **PageSpeed Insights**.
- ✅ **Design moderno** con **Tailwind CSS**, supporto **Dark mode** e **RTL**.
- ✅ **Blog veloce e SEO-friendly** con **RSS feed** automatico, supporto **MDX**, **Categorie & Tag**, **Social Share**.
- ✅ **Ottimizzazione immagini** con **Astro Assets** e **Unpic** per CDN universale.
- ✅ **Sitemap automatica** basata sulle route del progetto.
- ✅ **Open Graph tags** per condivisione sui social media.
- ✅ **Analytics integrati** con Google Analytics e Splitbee.
- ✅ **Autenticazione Firebase** con supporto social login (Google, Facebook, GitHub, Discord).
- ✅ **Form dinamici** con validazione avanzata e integrazione API.
- ✅ **Community features** per la gestione della Tana dei Nerd.

<br>

![Victorian Monkey Website Screenshot](./public/images/victorian-monkey-screenshot.png)

[![Victorian Monkey](https://img.shields.io/badge/made%20by%20-Victorian%20Monkey-556bf2?style=flat-square&logo=monkey&logoColor=white&labelColor=101827)](https://github.com/victorian-monkey)
[![Vicedomini Softworks](https://img.shields.io/badge/developed%20by%20-Vicedomini%20Softworks-FF6B35?style=flat-square&logo=code&logoColor=white&labelColor=000000)](https://vicedomini.ltd)
[![Firebase](https://img.shields.io/badge/powered%20by%20-Firebase-orange?style=flat-square&logo=firebase&logoColor=white&labelColor=000000)](https://firebase.google.com/)
[![Astro](https://img.shields.io/badge/built%20with%20-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white&labelColor=000000)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/styled%20with%20-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white&labelColor=000000)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-AGPL--3.0-red?style=flat-square&color=dddddd&labelColor=000000)](https://github.com/victorian-monkey/vm-site/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/victorian-monkey)

<br>

<details open>
<summary>Table of Contents</summary>

- [Demo](#demo)
- [Caratteristiche](#caratteristiche)
- [Tecnologie](#tecnologie)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Firebase Setup](#firebase-setup)
  - [Deploy](#deploy)
- [Community](#community)
- [Contributing](#contributing)
- [License](#license)

</details>

<br>

## Demo

📌 [https://victorian-monkey.vercel.app/](https://victorian-monkey.vercel.app/)

<br>

## Caratteristiche

### 🎯 **Community Features**
- **La Tana dei Nerd**: Area riservata per i membri della community
- **Autenticazione avanzata**: Login/registrazione con Firebase
- **Social Login**: Google, Facebook, GitHub, Discord
- **Form dinamici**: Contatti, registrazione, login con validazione avanzata

### 🚀 **Performance & SEO**
- **Core Web Vitals ottimali**: Performance eccellenti
- **SEO-friendly**: Meta tags, sitemap, RSS feed
- **Dark mode**: Supporto completo tema scuro/chiaro
- **Mobile-first**: Design responsive

### 🛠️ **Tecnologie**
- **Astro 5.0**: Framework moderno e veloce
- **Tailwind CSS**: Styling utility-first
- **Firebase**: Backend-as-a-Service
- **TypeScript**: Type safety
- **MDX**: Blog con componenti React

### 🎲 **Missione**
- **Giochi da tavolo**: Promuovere il ritorno ai giochi fisici e sociali
- **Vita lenta**: Contrastare la frenesia digitale con momenti di condivisione
- **Community**: Creare legami reali attraverso il gioco e la tecnologia
- **Open Source**: Codice libero per il bene comune

<br>

## Tecnologie

- **[Astro 5.0](https://astro.build/)** - Framework web moderno
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[MDX](https://mdxjs.com/)** - Markdown con componenti React

## Getting started

**Victorian Monkey** è il sito web ufficiale della community "La Tana dei Nerd", costruito con tecnologie moderne per offrire un'esperienza utente eccellente.

Il progetto utilizza **Astro 5.0** come framework principale, **Tailwind CSS** per lo styling, e **Firebase** per l'autenticazione e il backend. Il design è ottimizzato per performance e accessibilità, con supporto completo per dark mode e dispositivi mobili.

### Prerequisiti
- Node.js 18+ 
- npm o yarn
- Account Firebase

### Project structure

Il progetto Victorian Monkey è organizzato come segue:

```
/
├── public/
│   ├── _headers
│   ├── robots.txt
│   └── decapcms/          # Configurazione CMS
├── src/
│   ├── assets/
│   │   ├── favicons/      # Icone del sito
│   │   ├── images/        # Immagini statiche
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/
│   │   ├── blog/          # Componenti blog
│   │   ├── common/        # Componenti comuni
│   │   ├── ui/            # Componenti UI (SocialLogin, Form, etc.)
│   │   ├── widgets/       # Widget principali (Header, Footer, etc.)
│   │   └── ...
│   ├── data/
│   │   ├── forms/         # Configurazioni form dinamici
│   │   ├── post/          # Contenuti blog
│   │   └── ...            # Altri dati JSON
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── TanaLayout.astro  # Layout per area Tana
│   │   └── ...
│   ├── pages/
│   │   ├── tana/          # Area riservata Tana dei Nerd
│   │   │   ├── login.astro
│   │   │   └── registrazione.astro
│   │   ├── api/           # API endpoints
│   │   └── ...
│   ├── utils/             # Utility functions
│   ├── config.yaml        # Configurazione principale
│   └── types.d.ts         # Definizioni TypeScript
├── package.json
├── astro.config.ts
└── ...
```

Astro cerca file `.astro` o `.md` nella directory `src/pages/`. Ogni pagina viene esposta come route basata sul nome del file.

La directory `src/components/` contiene tutti i componenti Astro/React/Vue/Svelte/Preact riutilizzabili.

Le risorse statiche, come le immagini, possono essere posizionate nella directory `public/` se non richiedono trasformazioni, o nella directory `assets/` se vengono importate direttamente.

<br>

### Commands

Tutti i comandi vengono eseguiti dalla root del progetto:

| Comando             | Azione                                             |
| :------------------ | :------------------------------------------------- |
| `npm install`       | Installa le dipendenze                             |
| `npm run dev`       | Avvia il server di sviluppo su `localhost:4321`    |
| `npm run build`     | Compila il sito per la produzione in `./dist/`     |
| `npm run preview`   | Anteprima del build localmente, prima del deploy   |
| `npm run check`     | Controlla il progetto per errori                   |
| `npm run fix`       | Esegue Eslint e formatta il codice con Prettier    |
| `npm run astro ...` | Esegue comandi CLI come `astro add`, `astro preview` |

<br>

### Firebase Setup

1. **Crea un progetto Firebase**:
   - Vai su [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuovo progetto chiamato "victorian-monkey"

2. **Abilita Authentication**:
   - Vai su Authentication > Sign-in method
   - Abilita i provider che vuoi usare (Google, Facebook, GitHub, Discord)

3. **Configura le variabili d'ambiente**:
   ```bash
   # Crea un file .env.local
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Installa le dipendenze Firebase**:
   ```bash
   npm install firebase
   ```

### Configuration

File di configurazione principale: `./src/config.yaml`

```yaml
site:
  name: 'Victorian Monkey'
  site: 'https://victorian-monkey.vercel.app'
  base: '/'
  trailingSlash: false

  googleSiteVerificationId: false

# Default SEO metadata
metadata:
  title:
    default: 'Victorian Monkey - La Tana dei Nerd'
    template: '%s — Victorian Monkey'
  description: 'Il sito web ufficiale del Victorian Monkey - La Tana dei Nerd. Community per appassionati di tecnologia, gaming e cultura nerd.'
  robots:
    index: true
    follow: true
  openGraph:
    site_name: 'Victorian Monkey'
    images:
      - url: '~/assets/images/victorian-monkey-og.png'
        width: 1200
        height: 628
    type: website
  twitter:
    handle: '@victorianmonkey'
    site: '@victorianmonkey'
    cardType: summary_large_image

i18n:
  language: it
  textDirection: ltr

apps:
  blog:
    isEnabled: true
    postsPerPage: 6

    post:
      isEnabled: true
      permalink: '/blog/%slug%'
      robots:
        index: true

    list:
      isEnabled: true
      pathname: 'blog'
      robots:
        index: true

    category:
      isEnabled: true
      pathname: 'category'
      robots:
        index: true

    tag:
      isEnabled: true
      pathname: 'tag'
      robots:
        index: false

    isRelatedPostsEnabled: true
    relatedPostsCount: 4

analytics:
  vendors:
    googleAnalytics:
      id: null

ui:
  theme: 'system'
```

<br>

#### Personalizzazione Design

Per personalizzare font, colori o altri elementi, modifica i seguenti file:

- `src/components/CustomStyles.astro`
- `src/assets/styles/tailwind.css`

### Deploy

#### Deploy in produzione (manuale)

Puoi creare un build ottimizzato per la produzione con:

```shell
npm run build
```

Ora il tuo sito web è pronto per essere deployato. Tutti i file generati si trovano nella cartella `dist`, che puoi deployare su qualsiasi servizio di hosting preferisci.

#### Deploy su Vercel

Il sito è attualmente deployato su Vercel. Per aggiornamenti:

1. Push delle modifiche su GitHub
2. Vercel eseguirà automaticamente il build e il deploy
3. Il sito sarà disponibile su `https://victorian-monkey.vercel.app`

#### Deploy su altri servizi

Il progetto può essere deployato su:
- **Netlify**: Compatibile con build statici
- **Firebase Hosting**: Integrazione nativa con Firebase
- **GitHub Pages**: Per hosting gratuito
- **Altri provider**: Qualsiasi servizio che supporti siti statici

<br>

## Community

### 🐒 **La Tana dei Nerd**
Victorian Monkey è la community ufficiale per tutti gli appassionati di tecnologia, gaming, e cultura nerd. Unisciti alla nostra community per:

- 🎮 **Gaming sessions** e tornei
- 💻 **Tech talks** e workshop
- 📚 **Condivisione conoscenze** e progetti
- 🎯 **Eventi esclusivi** per membri

### 📱 **Come Partecipare**
1. Registrati sul sito web
2. Accedi alla Tana dei Nerd
3. Partecipa alle discussioni e agli eventi
4. Condividi i tuoi progetti e idee

## Contributing

Se hai idee, suggerimenti o trovi bug, apri pure una discussione, un issue o crea una pull request.
Sarebbe molto utile per tutti noi e saremmo felici di ascoltare e agire.

## License

**Victorian Monkey** è rilasciato sotto licenza **GNU Affero General Public License v3.0 (AGPL-3.0)** — vedi il file [LICENSE](./LICENSE.md) per i dettagli.

### 🎲 **Missione Vicedomini Softworks**

Questo progetto è stato sviluppato, e viene hostato, gratuitamente da **[Vicedomini Softworks](https://vicedomini.ltd)** per supportare la causa di diffusione dei giochi da tavolo e promuovere un ritorno ad una vita più lenta e coesa, dal vivo. 

La licenza AGPL-3.0 garantisce che il codice rimanga libero e aperto, permettendo alla community di contribuire e migliorare continuamente la piattaforma per il bene comune.
