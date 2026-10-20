FROM maven:3.9.16-eclipse-temurin-25@sha256:93b8a14ea2f412782e4e842651273b4d903e35cc496284f178fbbe2d67d00976 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package

FROM eclipse-temurin:25.0.4.1_1-jre@sha256:dbb43d81099eec91e0800226ed2296d03146ee7857165b95112372ad0d67e87f
WORKDIR /course
COPY --from=build /src/target/llm-app.jar /opt/app/llm-app.jar
# The incident closures of lessons 19, 23 and 24 live in a named volume mounted here, shared by
# the app and the MCP server; a new volume takes this directory's owner. The events volume of the
# live viewer is shared by several images with different users, so its folder is writable by all.
RUN mkdir /state && chown 10001:10001 /state && mkdir -m 1777 /events
USER 10001:10001
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xmx512m", "-jar", "/opt/app/llm-app.jar"]
CMD ["help"]
