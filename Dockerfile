FROM nginx:1.14.2-alpine
# WORKDIR /app

COPY back/nginx.template.conf /etc/nginx/conf.d/default.conf
COPY --chown=nobody:nobody back/ /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
ENV PORT=80
CMD ["nginx", "-g", "daemon off;"]