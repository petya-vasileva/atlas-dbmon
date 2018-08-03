# AtlGradleDbMon
#
# VERSION       AtlGradleDbMon-1.0

# use the centos base image provided by dotCloud
# FROM openjdk:8u121-jdk
FROM anapsix/alpine-java
MAINTAINER Petya Vasileva

ENV dbmon_version 1.0-SNAPSHOT
ENV dbmon_dir /opt/dbmon
ENV catalina_base /tmp
ENV data_dir /data
ENV gradle_version 4.2.1
ENV TZ GMT
RUN mkdir -p ${catalina_base}/logs
RUN mkdir -p ${dbmon_dir}
RUN mkdir -p ${data_dir}/dump

## This works if using an externally generated war, in the local directory
ADD ./build/libs/dbmon.war ${dbmon_dir}/dbmon.war

RUN chown -R 1001:0 ${dbmon_dir}/dbmon.war
RUN chown -R 1001:0 ${catalina_base}
RUN chown -R 1001:0 ${dbmon_dir}
RUN chown -R 1001:0 ${data_dir}

USER 1001

VOLUME "/data/dump"

EXPOSE 8080

ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -jar ${dbmon_dir}/dbmon.war" ]
