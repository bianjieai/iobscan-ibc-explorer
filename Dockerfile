FROM node:16.0.0-alpine3.13 AS builder
WORKDIR /app
COPY . .
ARG ENVIRONMENT=null
ARG APKPROXY=http://192.168.0.60:8081/repository/apk-ustc
RUN sed -i "s+http://dl-cdn.alpinelinux.org/alpine+${APKPROXY}+g" /etc/apk/repositories && \
apk add git && npm config set registry https://registry.npm.taobao.org && \
npm install -g pnpm@6.10.3 && pnpm config set registry https://registry.npm.taobao.org && pnpm install && pnpm run build:$ENVIRONMENT

FROM nginx:1.19-alpine
RUN echo -e 'server {\n\
  root /usr/share/nginx/html;\n\
  location / {\n\
    if ($request_filename ~* index.html|.*\.ico$)\n\
    {\n\
        add_header Cache-Control "no-cache";\n\
    }\n\
    try_files $URI $URI/ /index.html;\n\
  }\n\
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/ /usr/share/nginx/html/
CMD sh -c "exec nginx -g 'daemon off;'"