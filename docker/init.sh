#!/bin/sh

# Ajuste as permissões
chown -R nginx:nginx /var/www/api

# Inicie o Nginx
nginx -g 'daemon off;'
