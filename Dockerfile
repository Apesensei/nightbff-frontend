FROM node:20-bookworm AS build
WORKDIR /app
COPY package.json ./
# Full install to fetch Linux binaries (not just lockfile)
RUN npm install --legacy-peer-deps
COPY . .

# Expo web export with Metro cache clear
RUN npx expo export --clear --platform web

FROM nginx:alpine
# Install wget for healthcheck (lightweight, production-ready)
RUN apk add --no-cache wget
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget --spider --quiet http://localhost:80 || exit 1
