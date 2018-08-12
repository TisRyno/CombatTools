FROM centos:6.9

RUN yum -y update && \
    yum -y install ruby rubygems ruby-devel \
        mysql-devel autoconf bison flex gcc \
        gcc-c++ kernel-devel make m4 patch

ENV PATH "/usr/lib/ruby/gems/1.8/bin:/usr/bin:${PATH}"

RUN gem install json_pure --no-ri --no-rdoc -v 1.8.2 && \
    gem install i18n --no-ri --no-rdoc -v 0.6.0 && \
    gem install rake --no-ri --no-rdoc -v 0.8.7 && \
    gem install hpricot --no-ri --no-rdoc -v 0.6 && \
    gem install soap4r --no-ri --no-rdoc -v 1.5.8 && \
    gem install tmail --no-ri --no-rdoc -v 1.2.7.1 && \
    gem install logging --no-ri --no-rdoc -v 1.4.3 && \
    gem install ferret --no-ri --no-rdoc -v 0.11.6 && \
    gem install mysql --no-ri --no-rdoc -v 2.8.1 && \
    gem install rails --no-ri --no-rdoc -v 2.3.17 && \
    gem install rake --no-ri --no-rdoc -v 0.9.2.2 && \
    gem install mongrel --no-ri --no-rdoc -v 1.1.5 && \
    gem install mongrel_cluster --no-ri --no-rdoc -v 1.0.5 && \
    gem install hoe --no-ri --no-rdoc -v 1.8.3 && \
    gem install ZenTest --no-ri --no-rdoc -v 3.9.2 && \
    gem install runt --no-ri --no-rdoc -v 0.7 && \
    gem install uuidtools --no-ri --no-rdoc -v 1.0.3 && \
    gem install fastercsv --no-ri --no-rdoc -v 1.2.3 && \
    gem install prawn --no-ri --no-rdoc -v 0.2.0 && \
    gem install composite_primary_keys --ignore-dependencies --no-ri --no-rdoc -v 1.0.3 && \
    gem install has_many_polymorphs --ignore-dependencies --no-ri --no-rdoc -v 2.12 && \
    gem install thread_safe --no-ri --ignore-dependencies --no-rdoc -v 0.3.5 && \
    gem install tzinfo --no-ri --ignore-dependencies --no-rdoc -v 1.2.2 && \
    gem install minitest --no-ri --ignore-dependencies --no-rdoc -v 5.7.0 && \
    gem install memcache-client --no-ri --no-rdoc -v 1.5.0 && \
    gem install rsolr --no-ri --no-rdoc -v 1.0.0

RUN mkdir -p /etc/mongrel/{logs, run}

RUN sed -i -e '223d' /usr/lib/ruby/site_ruby/1.8/rubygems.rb && \
    sed -i -e '226d' /usr/lib/ruby/site_ruby/1.8/rubygems.rb

# Then the entrypoint ...
COPY entrypoint.sh /entrypoint.sh

RUN chmod 755 /entrypoint.sh

EXPOSE 44444

CMD ["/entrypoint.sh"]
