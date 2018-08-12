FROM percona:5.7.18

RUN rm /etc/mysql/percona-server.conf.d/*

COPY mysqld.cnf /etc/mysql/percona-server.conf.d/mysqld.cnf

EXPOSE 3306

CMD ["mysqld"]
