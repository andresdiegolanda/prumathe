# The origin of Rumbo: the Spring Boot API, built inside Docker so the host needs no Java.
FROM maven:3.9.16-eclipse-temurin-25@sha256:93b8a14ea2f412782e4e842651273b4d903e35cc496284f178fbbe2d67d00976 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src src
RUN mvn -B -q package -DskipTests
COPY certs.sh .
RUN sh certs.sh /tls

FROM eclipse-temurin:25.0.5_8-jre-noble@sha256:e3b6f7887a50f20d8f07abf279d8a81a5953fb398a9555bd9edd56b9bd15968c
COPY --from=build /src/target/rumbo-origin.jar /opt/rumbo/rumbo-origin.jar
COPY --from=build /tls /opt/rumbo/tls
USER 10001:10001
EXPOSE 8080 8443
ENTRYPOINT ["java", "-jar", "/opt/rumbo/rumbo-origin.jar"]
