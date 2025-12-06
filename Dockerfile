FROM node:lts AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Validate that the SSR entry file was generated
# This ensures astro.config.ts has output: 'server' and adapter: node() configured
RUN if [ ! -f "./dist/server/entry.mjs" ]; then \
      echo "ERROR: ./dist/server/entry.mjs not found. Astro must be configured for SSR."; \
      echo "Ensure astro.config.ts has: output: 'server' and adapter: node()"; \
      exit 1; \
    fi

FROM base AS deploy
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production
# PORT can be overridden at runtime (e.g., docker run -e PORT=8080)
# Astro's Node adapter uses process.env.PORT or defaults to 8080
ENV PORT=3000

# EXPOSE doesn't support variables, so we expose the default port
EXPOSE 3000

# Use npm run start:prod which runs database migrations and then starts the server
# The build-time validation above ensures the entry file exists before this stage
CMD ["npm", "run", "start:prod"]
