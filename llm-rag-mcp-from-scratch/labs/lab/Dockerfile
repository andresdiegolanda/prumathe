FROM maven:3.9.16-eclipse-temurin-25@sha256:93b8a14ea2f412782e4e842651273b4d903e35cc496284f178fbbe2d67d00976 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package

FROM eclipse-temurin:25.0.4.1_1-jre@sha256:dbb43d81099eec91e0800226ed2296d03146ee7857165b95112372ad0d67e87f
WORKDIR /course
COPY --from=build /src/target/llm-lab.jar /opt/lab/llm-lab.jar
COPY --from=build /src/target/lib /opt/lab/lib
# The conversation history of lesson 04 lives in a named volume mounted here; a new volume takes
# this directory's owner, so the lab user can write it.
RUN mkdir /state && chown 10001:10001 /state
USER 10001:10001
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xmx256m", "-jar", "/opt/lab/llm-lab.jar"]
CMD ["help"]
