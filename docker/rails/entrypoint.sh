#!/bin/bash

mongrel_rails start --user root --group root -a 0.0.0.0 -p 44444 --prefix /rails -e development -l /etc/mongrel/logs \
    -P /etc/mongrel/run -c /var/www/firebox/rails -d;