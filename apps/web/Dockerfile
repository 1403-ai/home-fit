FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package.json package.json
COPY apps/web/package.json apps/web/package.json
RUN npm install --workspace apps/web
COPY apps/web ./apps/web
RUN npm --workspace apps/web run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package.json
COPY apps/web/package.json apps/web/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/apps/web/index.html ./apps/web/index.html
COPY --from=build /app/apps/web/vite.config.ts ./apps/web/vite.config.ts
WORKDIR /app/apps/web
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
