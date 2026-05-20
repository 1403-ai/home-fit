FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspace apps/api --legacy-peer-deps

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY apps/api ./apps/api
RUN npm --workspace apps/api run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package.json
COPY apps/api/package.json apps/api/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
