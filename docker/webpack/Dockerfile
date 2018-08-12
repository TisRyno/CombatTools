FROM node:6.11.2

MAINTAINER Tech Corner <tech_corner@firebox.com>

WORKDIR /usr/src/app

RUN npm install -g yarn@'0.25'

COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

EXPOSE 8401 8080
CMD ["/entrypoint.sh"]
