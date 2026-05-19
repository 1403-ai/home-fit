FROM node:20-alpine AS web-build
WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace apps/web

COPY apps/web ./apps/web
RUN npm --workspace apps/web run build

FROM nginx:1.27-alpine
ARG NGINX_CONF=default.conf
COPY infra/nginx/default.conf /tmp/default.conf
COPY infra/nginx/default.prod.conf /tmp/default.prod.conf
RUN cp "/tmp/${NGINX_CONF}" /etc/nginx/conf.d/default.conf \
  && rm /tmp/default.conf /tmp/default.prod.conf
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html
