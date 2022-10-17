#
# (c) 2022 by dbj@dbj.org
#
FROM alpine
LABEL "copyright"="(c) 2022 by dbj@dbj.org"

# add gcc and friends
RUN apk add build-base
# add logerr and friends
RUN apk add -U util-linux
RUN apk upgrade
RUN apk update

WORKDIR dbj

COPY logging_infrastructure_research.pdf .
COPY ../src/driver.sh .
COPY ../src/syslogdirect.sh .
COPY ../src/somelegacyapp.c .

RUN chmod 755 ./driver.sh
RUN chmod 755 ./syslogdirect.sh

# sleep 10 sec's on startup

# the executable
ENTRYPOINT ["sleep"]
# the default arguments
CMD ["10000"]
