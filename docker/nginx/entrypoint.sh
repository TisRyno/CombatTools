#!/bin/sh

if [ ! -f "/etc/nginx/ssl/server.crt" ]; then
  echo "Building you a new key ...";
  openssl req -config /etc/nginx/v3.conf -new -nodes -days 3650 -newkey rsa:2048 -reqexts SAN -extensions SAN -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt -x509
fi

exec /usr/sbin/nginx -g "daemon off;"
