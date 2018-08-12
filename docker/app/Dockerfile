FROM centos:6.9

# It's essential to get this env as much as possible like prod

MAINTAINER Tech Corner <tech_corner@firebox.com>

RUN  rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-6.noarch.rpm \
    && rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm

RUN yum -y update \
    && yum -y install php71w php71w-opcache php71w-devel git \
    php71w-cli php71w-pdo php71w-pear php71w-mcrypt php71w-xml \
    php71w-gd php71w-mbstring php71w-bcmath php71w-mysqlnd \
    php71w-soap php71w-process php71w-pecl-redis php71w-pecl-imagick \
    php71w-pecl-xdebug \
    php71w-fpm \
    openssh-clients \
    && yum clean all

# Just so you know which dontainer you're in
RUN echo 'export PS1="[\u@docker-php] \W # "' >> /root/.bash_profile

RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

COPY php-fpm-*.conf /etc/php-fpm.d/
COPY entrypoint.sh /entrypoint.sh

RUN rm /etc/php-fpm.d/www.conf && chmod 755 /entrypoint.sh

COPY php.ini /etc/php.ini

# Apparently you cannot change the hosts file as you want. Thanks docker.
# RUN echo '\n\n\
#     officedb=192.168.1.27\n'\
# >> /etc/hosts

# Mime types are used by symfony to load and deliver legacy assets correctly
COPY mime.types /etc/mime.types

WORKDIR /var/www

EXPOSE 9000 9005
CMD ["/entrypoint.sh"]
