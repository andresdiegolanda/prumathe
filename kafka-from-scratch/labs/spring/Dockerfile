FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package
COPY HealthProbe.java .
RUN javac HealthProbe.java

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/target/spring-example.jar /app/app.jar
COPY --from=build /src/HealthProbe.class /app/HealthProbe.class
# The heap limit lives here rather than in JAVA_TOOL_OPTIONS, which would make every JVM start
# (the application and each health probe) announce itself in the logs.
ENTRYPOINT ["java", "-Xmx384m", "-jar", "/app/app.jar"]
