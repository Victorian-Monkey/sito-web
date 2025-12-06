# Railway Deployment Guide

This project is configured for deployment on Railway.

## Prerequisites

1. A Railway account
2. A MySQL database (can be provisioned via Railway)
3. A Logto instance configured

## Environment Variables

Set the following environment variables in Railway:

### Database Configuration
```
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<your-mysql-user>
DB_PASSWORD=<your-mysql-password>
DB_NAME=victorian_monkey
```

### Logto Configuration
```
LOGTO_ENDPOINT=https://your-logto-endpoint.logto.app
LOGTO_APP_ID=your-app-id
LOGTO_APP_SECRET=your-app-secret
PUBLIC_BASE_URL=https://your-railway-app.up.railway.app
```

### Mailgun Configuration (for contact form emails)
```
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
MAILGUN_FROM_EMAIL=noreply@your-domain.com
MAILGUN_FROM_NAME=Victorian Monkey
MAILGUN_TO_EMAIL=contact@your-domain.com
```

### Cloudflare Turnstile Configuration (for spam protection)
```
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

### Tesseramento API (optional)
```
TESSERAMENTO_API_URL=https://your-tesseramento-api-url
```

## Deployment Steps

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the project and use the `railway.json` configuration with Railpack
3. **Note**: If you have a `Dockerfile` in the root, Railway will prioritize it over Railpack. To use Railpack, either remove or rename the Dockerfile.
4. Add a MySQL service in Railway (or use an external MySQL database)
5. Set all required environment variables
6. Deploy!

## Database Migrations

After deployment, run migrations to set up the database schema:

```bash
npm run db:push
```

Or use Railway's CLI:
```bash
railway run npm run db:push
```

## Build & Start

Railway will automatically:
- Run `npm install` to install dependencies
- Run `npm run build` to build the application
- Run `npm start` to start the server

The application will be available on the Railway-provided domain.
