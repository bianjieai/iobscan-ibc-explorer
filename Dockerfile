FROM node:14.4.0-alpine3.12 AS builder
WORKDIR /app
COPY . .
ARG ENVIRONMENT=dev
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories && \
apk add make git && npm config set registry https://registry.npm.taobao.org && \
npm install -g pnpm@6.10.3 && pnpm config set registry https://registry.npm.taobao.org && pnpm install && pnpm run build:$ENVIRONMENT

FROM nginx:1.19-alpine
RUN echo -e 'server {\n\
  location / {\n\
    if ($request_filename ~ index.html)\n\
    {\n\
        add_header Cache-Control "no-cache";\n\
    }\n\
    root /usr/share/nginx/html;\n\
    try_files $URI $URI/ /index.html;\n\
  }\n\
}' > /nginx.template

COPY --from=builder /app/dist/ /usr/share/nginx/html/
CMD sh -c "envsubst < /nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"