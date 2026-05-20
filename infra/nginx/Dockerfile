FROM node:24-alpine AS web-build
WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
# lockfile 무시하고 fresh install — vite 7/rollup native binary 는 platform-specific
# optional dep 이라 macOS 에서 생성된 lockfile 로는 linux-musl 빌드가 실패함 (npm bug #4828)
RUN rm -f package-lock.json && npm install --workspace apps/web --include=optional --no-audit --no-fund

COPY apps/web ./apps/web
RUN npm --workspace apps/web run build

FROM nginx:1.29-alpine
ARG NGINX_CONF=default.conf
COPY infra/nginx/default.conf /tmp/default.conf
COPY infra/nginx/default.prod.conf /tmp/default.prod.conf
RUN cp "/tmp/${NGINX_CONF}" /etc/nginx/conf.d/default.conf \
  && rm /tmp/default.conf /tmp/default.prod.conf
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html
