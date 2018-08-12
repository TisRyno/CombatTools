FROM nginx:1.11.7-alpine

MAINTAINER Tech Corner <tech_corner@firebox.com>

COPY index.html /usr/share/nginx/html

# This will be useful once you try to generate your own cert
COPY v3.conf /etc/nginx/v3.conf

# Then nginx config...
COPY nginx-*.conf /etc/nginx/conf.d/
# COPY nginx-webpack.conf /etc/nginx/conf.d/webpack.conf

# Then the entrypoint ...
COPY entrypoint.sh /entrypoint.sh

RUN mkdir /var/www && \
	chown -R nginx:nginx /var/www  && \
	apk add --no-cache --update openssl && \
	rm /etc/nginx/conf.d/default.conf && \
	chmod 755 /entrypoint.sh


EXPOSE 80 443 8401
CMD ["/entrypoint.sh"]
