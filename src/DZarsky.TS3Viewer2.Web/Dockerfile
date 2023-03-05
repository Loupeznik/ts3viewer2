FROM node:18-alpine as build

WORKDIR /app

ARG ENVIRONMENT=prod

COPY . .

RUN npm install

RUN npm run build:${ENVIRONMENT}

FROM nginx:alpine AS final

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .
COPY --from=build /app/conf/nginx.conf /etc/nginx/conf.d/default.conf
