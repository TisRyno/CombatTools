#!/bin/bash

# Try auto install for composer
#if [ -f "/var/www/symfony/composer.lock" ]; then
  composer install --working-dir=/var/www/symfony
#fi

if [ PHP_XDEBUG_ENABLED == "1" ]; then
    sed -i '/xdebug\./s/^;//g' /etc/php.d/xdebug.ini
else
    sed -i '/xdebug\./s/^/;/g' /etc/php.d/xdebug.ini
fi

# Start php-fpm and shit
exec /usr/sbin/php-fpm
