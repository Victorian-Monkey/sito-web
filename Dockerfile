FROM node:lts AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS deploy
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Note: This CMD assumes Astro is configured for SSR with @astrojs/node adapter
# The astro.config.ts must have output: 'server' and adapter: node() configured
# This will generate ./dist/server/entry.mjs during the build step
CMD ["node", "./dist/server/entry.mjs"]
